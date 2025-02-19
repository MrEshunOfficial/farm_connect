"use client";
import React, { useEffect, useState } from "react";
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
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  IdentityCardType,
  UserProfileFormData,
  userProfileFormSchema,
} from "@/store/type/userProfileTypesSchema";
import {
  fetchMyProfile,
  updateUserProfile,
  selectUserProfile,
} from "@/store/profile.slice";
import ImageUploadWithParams from "./ImageUploadWithParams";
import { Gender, UserRole } from "@/models/profileI-interfaces";

const ProfileUpdateForms: React.FC = () => {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const existingProfile = useSelector(selectUserProfile);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileFormSchema),
    defaultValues: {
      email: "",
      fullName: "",
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
      role: "Seller",
    },
  });

  const { data: session } = useSession();
  const userId =
    (params?.profileUpdate as string) || (session?.user?.id as string);
  const fullName = session?.user?.name;
  const userMail = session?.user?.email;
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchMyProfile);
  }, [dispatch]);

  useEffect(() => {
    if (existingProfile) {
      form.reset({
        email: existingProfile.email || userMail || "",
        fullName: existingProfile.fullName || fullName || "",
        username: existingProfile.username || "",
        profilePicture: existingProfile.profilePicture || {
          url: "",
          fileName: "",
        },
        bio: existingProfile.bio || "",
        gender: existingProfile.gender
          ? Gender[existingProfile.gender as keyof typeof Gender]
          : undefined,
        phoneNumber: existingProfile.phoneNumber || "",
        country: existingProfile.country || "",
        socialMediaLinks: existingProfile.socialMediaLinks || {
          twitter: null,
          facebook: null,
          instagram: null,
          linkedIn: null,
        },
        identityCardNumber: existingProfile.identityCardNumber || "",
        role: existingProfile.role || "Customer",
      });
    }
  }, [existingProfile, form, fullName, userMail]);

  const handleImageChange = (imageData: { url: string; fileName: string }) => {
    form.setValue("profilePicture", imageData);
  };

  const onSubmit = async (data: UserProfileFormData) => {
    try {
      setSubmitError(null);

      const sanitizedData = {
        userId,
        ...data,
        profilePicture: {
          url: data.profilePicture.url,
          fileName: data.profilePicture.fileName,
        },
        identityCardNumber: data.identityCardNumber || undefined,
        socialMediaLinks: {
          twitter: data.socialMediaLinks?.twitter || null,
          facebook: data.socialMediaLinks?.facebook || null,
          instagram: data.socialMediaLinks?.instagram || null,
          linkedIn: data.socialMediaLinks?.linkedIn || null,
        },
      };

      if (existingProfile) {
        await dispatch(
          updateUserProfile({
            userId,
            updateData: sanitizedData,
          })
        );
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      }
      router.push("/profile");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "An error occurred"
      );
      toast({
        title: "Error",
        description: `Failed to update profile`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="container h-full mx-auto">
      <CardHeader>
        <CardTitle>Update Profile Information</CardTitle>
        <CardDescription>
          Complete your profile information below
        </CardDescription>
        {submitError && <div className="text-red-500 mt-2">{submitError}</div>}
      </CardHeader>
      <CardContent className="w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="h-full w-full flex flex-col items-center gap-2"
          >
            <div className="w-full flex items-center justify-between gap-4 border rounded-md p-2">
              <div className="w-96 h-full flex items-center justify-center rounded-md">
                <ImageUploadWithParams
                  onImageChange={handleImageChange}
                  initialImage={existingProfile?.profilePicture?.url}
                  size="lg"
                  shape="circle"
                  maxSize={5}
                  acceptedTypes={["image/jpeg", "image/png"]}
                  placeholder="Drop your profile picture here"
                  showHelper={true}
                  showProgress={true}
                  progressColor="blue"
                  customStyles={{
                    container: "flex justify-center",
                    dropzone:
                      "border-2 border-dashed border-gray-300 dark:border-gray-600",
                  }}
                />
              </div>
              <div className="flex-1 flex flex-col gap-2 h-[500px] overflow-auto p-2">
                {/* Rest of the form fields remain the same */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                          <Input {...field} type="email" disabled />
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
                          <Input {...field} placeholder="@user123" />
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
                          className="resize-none"
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
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
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
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
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
                            <SelectTrigger>
                              <SelectValue placeholder="Select ID type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
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
                          <Input {...field} />
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
                          <Input {...field} placeholder="+1234567890" />
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
                          <Input {...field} placeholder="United States" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Social Media Links</h3>
                  {(
                    ["twitter", "facebook", "instagram", "linkedIn"] as const
                  ).map((platform) => (
                    <FormField
                      key={platform}
                      control={form.control}
                      name={
                        `socialMediaLinks.${platform}` as keyof UserProfileFormData
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="capitalize">
                            {platform}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={
                                typeof field.value === "string"
                                  ? field.value
                                  : ""
                              }
                              onChange={(e) =>
                                field.onChange(e.target.value || null)
                              }
                              placeholder={`https://${platform}.com/username`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full p-2 flex items-center justify-center">
              <Button
                type="submit"
                className="w-1/4"
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
            </div>
          </form>
        </Form>
      </CardContent>
      <Toaster />
    </Card>
  );
};

export default ProfileUpdateForms;
