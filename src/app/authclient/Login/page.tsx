"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff, Mail, Lock } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Toaster } from "@/components/ui/toaster";
import { doSocialLogin } from "@/app/actions";
import { LandingPage } from "../LandingPage";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (values.rememberMe) {
        localStorage.setItem("rememberedEmail", values.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid credentials. Please try again.",
        });
      } else {
        router.push("/profile");
        toast({
          title: "Success",
          description: "Successfully logged in!",
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

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      form.setValue("email", rememberedEmail);
      form.setValue("rememberMe", true);
    }
  }, [form]);

  return (
    <main className="w-full min-h-full flex flex-col lg:flex-row bg-white dark:bg-black">
      <Card className="w-full lg:w-1/4 rounded-lg bg-teal-950 text-white">
        <CardHeader className="space-y-6">
          <h1 className="text-2xl lg:text-2xl font-bold text-white">
            Welcome back
          </h1>
          <p className="text-base lg:text-lg mt-2 text-white/80">
            Sign in to access your account and continue your journey.
          </p>
        </CardHeader>
        <CardContent className="p-4 lg:p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 lg:space-y-6"
            >
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm lg:text-base text-white">
                      <Lock size={16} className="text-white" /> Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...field}
                          disabled={isLoading}
                          className="h-10 lg:h-11 w-full 
                      bg-white/10 
                      text-white 
                      border-white/20 
                      focus:border-white/50 
                      focus:ring-white/20 
                      placeholder-white/50"
                          placeholder="Enter your password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-10 lg:h-11 
                      text-white/50 hover:text-white/80 
                      focus:text-white/80"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
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

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-white/30 bg-white/10"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal text-white/80">
                        Remember me
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Link
                  href="/forgot-password"
                  className="text-sm text-white hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-11 lg:h-12 bg-white text-teal-950 hover:bg-gray-100"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2 text-teal-950">
                    <Loader2 className="h-4 w-4 animate-spin text-teal-950" />
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <div className="space-y-4 p-4 lg:p-6">
          <form action={doSocialLogin}>
            <Button
              type="submit"
              name="action"
              value="google"
              variant="secondary"
              className="w-full bg-white text-black hover:bg-gray-100"
            >
              <FcGoogle className="mr-2 h-4 lg:h-5 w-4 lg:w-5" />
              Sign in with Google
            </Button>
          </form>

          <div className="text-center text-sm lg:text-base">
            <p className="text-white/80">
              {"Don't have an account? "}
              <Link
                href="/authclient/Register"
                className="text-white hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="text-xs text-white/70 text-center">
            By signing in, you agree to our{" "}
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
