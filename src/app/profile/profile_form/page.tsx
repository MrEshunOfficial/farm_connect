"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  IdentityCardType,
  UserProfileFormData,
  userProfileFormSchema,
} from "@/store/type/userProfileTypesSchema";
import { useSession } from "next-auth/react";
import { createUserProfile } from "@/store/profile.slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import ImageUpload from "./ImageUpload";
import { useRouter } from "next/navigation";
import { Gender, UserRole } from "@/models/profileI-interfaces";

const ProfileForm = () => {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const userId = session?.user?.id as string;
  const fullName = session?.user?.name;
  const userMail = session?.user?.email;

  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileFormSchema),
    defaultValues: {
      email: fullName || "",
      fullName: userMail || "",
      username: "",
      profilePicture: {
        url: "",
        fileName: "",
      },
      bio: "",
      gender: undefined,
      phoneNumber: "",
      country: "",
      socialMediaLinks: {
        twitter: null,
        facebook: null,
        instagram: null,
        linkedIn: null,
      },
      identityCardType: undefined,
      identityCardNumber: "",
      role: "Farmer",
    },
  });

  const onSubmit = async (data: UserProfileFormData) => {
    try {
      setSubmitError(null);
      const sanitizedData = {
        userId: userId,
        ...data,
        profilePicture: data.profilePicture.url,
        identityCardNumber: data.identityCardNumber || undefined,
        socialMediaLinks: {
          twitter: data.socialMediaLinks?.twitter || null,
          facebook: data.socialMediaLinks?.facebook || null,
          instagram: data.socialMediaLinks?.instagram || null,
          linkedIn: data.socialMediaLinks?.linkedIn || null,
        },
      };
      await dispatch(createUserProfile(sanitizedData));
      toast({
        title: "Success",
        description: "Profile created successfully",
      });
      router.push("/profile");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "An error occurred"
      );
      toast({
        title: "Error",
        description: "Failed to created profile",
        variant: "destructive",
      });
    }
  };

  React.useEffect(() => {
    if (session?.user) {
      form.setValue("fullName", fullName || "");
      form.setValue("email", userMail || "");
    }
  }, [session, fullName, userMail, form]);

  // Update your form submission handling to convert blob to base64
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          title: "Error",
          description: "File size should not exceed 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64 = reader.result as string;

        // Update form with base64 data
        form.setValue("profilePicture", {
          url: base64,
          fileName: file.name,
        });

        // Update preview
        setImagePreview(base64);
      };

      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to read image file",
          variant: "destructive",
        });
      };

      reader.readAsDataURL(file);
    }
  };

  // Log any form errors
  React.useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.log("Form Errors:", form.formState.errors);
    }
  }, [form.formState.errors]);

  return (
    <Card className="w-full h-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Profile Information
        </CardTitle>
        <CardDescription>
          Complete your profile information below
        </CardDescription>
        {submitError && <div className="text-red-500 mt-2">{submitError}</div>}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 max-h-[520px] overflow-y-auto p-2"
          >
            <div className="relative w-full flex items-center justify-center">
              <ImageUpload
                onImageChange={(imageData) => {
                  form.setValue("profilePicture", imageData);
                  setImagePreview(imageData.url);
                }}
                initialImage={imagePreview || undefined}
                size="lg"
              />
            </div>

            {/* Rest of the form fields remain the same */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        readOnly
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="@user123"
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Tell us about yourself"
                      className="resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        {Object.entries(Gender).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        {Object.entries(UserRole).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="identityCardType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identity Card Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        {Object.values(IdentityCardType._def.values).map(
                          (type: string) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="identityCardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identity Card Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="+1234567890"
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="United States"
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Social Media Links
              </h3>
              {(["twitter", "facebook", "instagram", "linkedIn"] as const).map(
                (platform) => (
                  <FormField
                    key={platform}
                    control={form.control}
                    name={
                      `socialMediaLinks.${platform}` as keyof UserProfileFormData
                    }
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">{platform}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={
                              typeof field.value === "string" ? field.value : ""
                            }
                            onChange={(e) =>
                              field.onChange(e.target.value || null)
                            }
                            placeholder={`https://${platform}.com/username`}
                            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-500 dark:bg-blue-700 text-white"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <Toaster />
    </Card>
  );
};

export default ProfileForm;
