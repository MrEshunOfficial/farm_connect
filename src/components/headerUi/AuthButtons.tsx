import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AuthButtonVariant = "default" | "mobile" | "desktop" | "inline";

interface AuthButtonsProps extends React.HTMLAttributes<HTMLDivElement> {
  loginHref?: string;
  registerHref?: string;
  variant?: AuthButtonVariant;
  className?: string;
  labels?: {
    login?: string;
    register?: string;
  };
}

const AuthButtons: React.FC<AuthButtonsProps> = ({
  loginHref = "/authclient/Login",
  registerHref = "/authclient/Register",
  className = "",
  variant = "default",
  labels = {
    login: "Login",
    register: "Sign Up",
  },
  ...props
}) => {
  const getResponsiveClasses = () => {
    switch (variant) {
      case "mobile":
        return "md:hidden";
      case "desktop":
        return "hidden md:flex";
      case "inline":
        return "flex flex-row items-center space-x-4";
      default:
        return "flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4";
    }
  };

  return (
    <div
      {...props}
      className={cn(
        getResponsiveClasses(),
        "items-center justify-center w-full",
        className
      )}
      aria-label="Authentication Actions"
    >
      <Button
        variant="outline"
        size="sm"
        asChild
        className={cn(
          "w-full max-w-[150px]",
          "transition-all duration-300",
          "hover:scale-105 active:scale-95",
          "focus-visible:ring-2 focus-visible:ring-offset-2"
        )}
        aria-label="Go to Login page"
      >
        <Link href={loginHref} prefetch={false}>
          {labels.login}
        </Link>
      </Button>

      <Button
        size="sm"
        asChild
        className={cn(
          "w-full max-w-[150px]",
          "transition-all duration-300",
          "hover:scale-105 active:scale-95",
          "focus-visible:ring-2 focus-visible:ring-offset-2"
        )}
        aria-label="Go to Registration page"
      >
        <Link href={registerHref} prefetch={false}>
          {labels.register}
        </Link>
      </Button>
    </div>
  );
};

export default AuthButtons;
