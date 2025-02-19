"use client";
import React, { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  UserIcon,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Toaster } from "@/components/ui/toaster";
import { doSocialLogin } from "@/app/actions";
import { LandingPage } from "../LandingPage";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const generatePasswordSuggestion = async () => {
    setIsGeneratingPassword(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const password = Math.random().toString(36).slice(-10) + "A1!";
      form.setValue("password", password);
      form.setValue("confirmPassword", password);
      setShowPassword(true);
      setShowConfirmPassword(true);
    } catch (error) {
      console.error("Password generation failed:", error);
      toast({
        title: "Password Generation Failed",
        description:
          "Failed to generate a password suggestion. Please try again.",
        duration: 5000,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPassword(false);
    }
  };

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Account created successfully!",
        });
        router.push("/authclient/Login");
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Error",
          description:
            errorData.message || "Registration failed. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Reusable password input component
  const PasswordInput = ({
    name,
    label,
    show,
    setShow,
  }: {
    name: "password" | "confirmPassword";
    label: string;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
  }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2 text-sm lg:text-base text-white">
            <Lock size={16} className="text-white" /> {label}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={show ? "text" : "password"}
                {...field}
                disabled={isLoading}
                className="h-10 lg:h-11 w-full 
                  bg-white/10 
                  text-white 
                  border-white/20 
                  focus:border-white/50 
                  focus:ring-white/20 
                  placeholder-white/50"
                placeholder={`Enter your ${label.toLowerCase()}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-10 lg:h-11 
                  text-white/50 hover:text-white/80 
                  focus:text-white/80"
                onClick={() => setShow(!show)}
                disabled={isLoading}
              >
                {show ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </FormControl>
          <FormMessage className="text-red-300" />
        </FormItem>
      )}
    />
  );

  return (
    <main className="w-full min-h-full flex flex-col lg:flex-row bg-white dark:bg-black">
      <Card className="w-full lg:w-1/4 rounded-lg bg-teal-950 text-white">
        <CardHeader className="text-center space-y-4 p-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-white">
              Create Account
            </h1>
            <p className="text-sm lg:text-base opacity-90 text-white/90">
              Sign up to access our platform and start your journey.
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 lg:space-y-6"
            >
              {/* Name Input */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm lg:text-base text-white">
                      <UserIcon size={16} className="text-white" /> Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        className="h-10 lg:h-11 w-full 
                        bg-white/10 
                        text-white 
                        border-white/20 
                        focus:border-white/50 
                        focus:ring-white/20 
                        placeholder-white/50"
                        placeholder="Enter your full name"
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              {/* Email Input */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm lg:text-base text-white">
                      <Mail size={16} className="text-white" /> Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        disabled={isLoading}
                        className="h-10 lg:h-11 w-full 
                    bg-white/10 
                    text-white 
                    border-white/20 
                    focus:border-white/50 
                    focus:ring-white/20 
                    placeholder-white/50"
                        placeholder="Enter your email"
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              {/* Password Input */}
              <PasswordInput
                name="password"
                label="Password"
                show={showPassword}
                setShow={setShowPassword}
              />

              {/* Confirm Password Input */}
              <PasswordInput
                name="confirmPassword"
                label="Confirm Password"
                show={showConfirmPassword}
                setShow={setShowConfirmPassword}
              />

              <div className="space-y-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={generatePasswordSuggestion}
                  disabled={isGeneratingPassword || isLoading}
                  className="w-full h-10 lg:h-11 bg-teal-900 hover:bg-teal-800 text-white"
                >
                  {isGeneratingPassword ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2 text-white" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2 text-white" />
                  )}
                  Generate Secure Password
                </Button>

                <Button
                  type="submit"
                  className="w-full h-11 lg:h-12 bg-white text-teal-950 hover:bg-gray-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2 text-teal-950">
                      <Loader2 className="h-4 w-4 animate-spin text-teal-950" />
                      Creating account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>

        <div className="p-6 pt-0 space-y-4">
          <form action={doSocialLogin}>
            <Button
              type="submit"
              name="action"
              value="google"
              variant="secondary"
              className="w-full bg-white text-black hover:bg-gray-100"
            >
              <FcGoogle className="mr-2 h-4 lg:h-5 w-4 lg:w-5" />
              Sign up with Google
            </Button>
          </form>

          <div className="text-center text-sm lg:text-base">
            <p className="text-white/80">
              Already have an account?{" "}
              <Link
                href="/authclient/Login"
                className="text-white hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="text-xs text-white/70 text-center">
            By creating an account, you agree to our{" "}
            <Button
              variant="link"
              className="px-1 h-auto text-xs text-white hover:text-white/80"
            >
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button
              variant="link"
              className="px-1 h-auto text-xs text-white hover:text-white/80"
            >
              Privacy Policy
            </Button>
          </div>
        </div>
      </Card>
      <div className="w-full lg:flex-1">
        <LandingPage />
      </div>
      <Toaster />
    </main>
  );
}
