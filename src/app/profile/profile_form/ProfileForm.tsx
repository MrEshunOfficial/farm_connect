"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  UserProfileFormData,
  userProfileFormSchema,
  IdentityCardType,
} from "@/store/type/userProfileTypesSchema";
import {
  createUserProfile,
  updateUserProfile,
  fetchMyProfile,
  selectUserProfile,
} from "@/store/profile.slice";
import { Gender, UserRole } from "@/models/profileI-interfaces";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  User,
  AtSign,
  Phone,
  Globe,
  FileText,
  CreditCard,
} from "lucide-react";
import ImageUpload from "./ImageUpload";

interface ProfileFormProps {
  mode: "create" | "update";
}

const ProfileForm: React.FC<ProfileFormProps> = ({ mode = "create" }) => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const existingProfile = useSelector(selectUserProfile);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { data: session } = useSession();

  // Handle both create and update scenarios
  const userId =
    mode === "update"
      ? (params?.profileUpdate as string) || (session?.user?.id as string)
      : (session?.user?.id as string);
  const fullName = session?.user?.name;
  const userMail = session?.user?.email;

  // Initialize form with default values
  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileFormSchema),
    defaultValues: {
      email: userMail || "",
      fullName: fullName || "",
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
      role: mode === "create" ? "Farmer" : "Seller",
    },
  });

  // Load existing profile data if in update mode
  useEffect(() => {
    if (mode === "update") {
      dispatch(fetchMyProfile);
    }
  }, [dispatch, mode]);

  // Set form values based on session or existing profile
  useEffect(() => {
    if (mode === "create" && session?.user) {
      form.setValue("fullName", fullName || "");
      form.setValue("email", userMail || "");
    } else if (mode === "update" && existingProfile) {
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

      if (existingProfile.profilePicture?.url) {
        setImagePreview(existingProfile.profilePicture.url);
      }
    }
  }, [session, fullName, userMail, form, mode, existingProfile]);

  // Log form errors for debugging
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.log("Form Errors:", form.formState.errors);
    }
  }, [form.formState.errors]);

  const handleImageUpdate = (imageData: { url: string; fileName: string }) => {
    form.setValue("profilePicture", imageData);
    setImagePreview(imageData.url);
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

      if (mode === "create") {
        await dispatch(createUserProfile(sanitizedData));
        toast({
          title: "Success",
          description: "Profile created successfully",
        });
      } else {
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
        description: `Failed to ${
          mode === "create" ? "create" : "update"
        } profile`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <Card className="border-0 shadow-none">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8">
          <CardTitle className="text-3xl font-bold">
            {mode === "create"
              ? "Complete Your Profile"
              : "Update Profile Information"}
          </CardTitle>
          <CardDescription className="text-blue-100 mt-2 text-lg">
            {mode === "create"
              ? "Please provide your information to enhance your experience"
              : "Update your profile information below"}
          </CardDescription>
          {submitError && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {submitError}
            </div>
          )}
        </CardHeader>
      </Card>

      <Card className="border-0 shadow-none">
        <CardContent className="p-6">
          <div className="relative w-full flex items-center justify-center mb-8">
            <ImageUpload
              onImageChange={handleImageUpdate}
              initialImage={imagePreview || undefined}
              size="lg"
              shape="circle"
              isUpdating={mode === "update"}
            />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="identity">Identity</TabsTrigger>
                  <TabsTrigger value="social">Social Media</TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="personal" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="flex-1" />
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
                          <FormLabel className="flex items-center">
                            <AtSign className="h-4 w-4 mr-2" />
                            Username
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="@username"
                              className="flex-1"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <AtSign className="h-4 w-4 mr-2" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input {...field} type="email" readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type="tel" />
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
                          <FormLabel className="flex items-center">
                            <Globe className="h-4 w-4 mr-2" />
                            Country
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
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

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Bio
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Tell us about yourself"
                            className="min-h-32 resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Identity Tab */}
                <TabsContent value="identity" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="identityCardType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2" />
                            ID Card Type
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={
                              typeof field.value === "string" ? field.value : ""
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select ID type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(IdentityCardType).map(
                                ([key, value]) => (
                                  <SelectItem
                                    key={key}
                                    value={
                                      typeof value === "string" ? value : key
                                    }
                                  >
                                    {typeof value === "string" ? value : key}
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
                          <FormLabel className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2" />
                            ID Card Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter ID card number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Social Media Tab */}
                <TabsContent value="social" className="space-y-6">
                  <FormField
                    control={form.control}
                    name="socialMediaLinks.twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <AtSign className="h-4 w-4 mr-2" />
                          Twitter
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ""}
                            placeholder="https://twitter.com/username"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialMediaLinks.facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <AtSign className="h-4 w-4 mr-2" />
                          Facebook
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ""}
                            placeholder="https://facebook.com/username"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialMediaLinks.instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <AtSign className="h-4 w-4 mr-2" />
                          Instagram
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ""}
                            placeholder="https://instagram.com/username"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialMediaLinks.linkedIn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <AtSign className="h-4 w-4 mr-2" />
                          LinkedIn
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ""}
                            placeholder="https://linkedin.com/in/username"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="flex items-center"
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {mode === "create" ? "Create Profile" : "Update Profile"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
};

export default ProfileForm;
