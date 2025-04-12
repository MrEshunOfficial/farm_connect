import React, { useState } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface LogoutProps {
  formClassName?: string;
  buttonClassName?: string;
  buttonVariant?: "default" | "ghost" | "outline" | "secondary" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  buttonDisabledText?: string;
  buttonDefaultText?: string;
  iconSize?: number;
  iconClassName?: string;
}

const Logout: React.FC<LogoutProps> = ({
  formClassName = "",
  buttonClassName = "",
  buttonVariant = "ghost",
  buttonSize = "default",
  buttonDisabledText = "Logging out...",
  buttonDefaultText = "",
  iconSize = 18,
  iconClassName = "mr-2",
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await signOut({
        callbackUrl: "/authclient/Login",
        redirect: true,
      });
    } catch (error) {
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <form className={formClassName} onSubmit={handleLogout}>
      <Button
        type="submit"
        variant={buttonVariant}
        size={buttonSize}
        disabled={isLoggingOut}
        className={buttonClassName}
      >
        <LogOut size={iconSize} className={iconClassName} />
        {isLoggingOut ? buttonDisabledText : buttonDefaultText}
      </Button>
    </form>
  );
};

export default Logout;
