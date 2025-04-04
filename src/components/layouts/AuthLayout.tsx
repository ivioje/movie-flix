
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40 dark:bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-primary">MovieFlix</span>
        </Link>
        <ThemeToggle />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-10">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
