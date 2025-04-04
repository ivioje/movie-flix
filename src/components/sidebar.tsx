
import { Link, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { cn } from "@/lib/utils";
import { Bookmark, Clock, Home, Settings, User } from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user } = useUser();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Dashboard
          </h2>
          <div className="space-y-1">
            <Link
              to="/dashboard"
              className={cn(
                "sidebar-item",
                isActive("/dashboard") && "active"
              )}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
            <Link
              to="/bookmarks"
              className={cn(
                "sidebar-item",
                isActive("/bookmarks") && "active"
              )}
            >
              <Bookmark className="h-4 w-4" />
              <span>Bookmarks</span>
            </Link>
            <Link
              to="/history"
              className={cn(
                "sidebar-item",
                isActive("/history") && "active"
              )}
            >
              <Clock className="h-4 w-4" />
              <span>Watch History</span>
            </Link>
            <Link
              to="/settings"
              className={cn(
                "sidebar-item",
                isActive("/settings") && "active"
              )}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
        
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Navigation
          </h2>
          <div className="space-y-1">
            <Link
              to="/"
              className="sidebar-item"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
          </div>
        </div>

        <div className="px-4 py-2">
          <div className="space-y-1">
            {user && (
              <div className="flex items-center gap-2 px-2">
                <div className="rounded-full bg-muted w-8 h-8 flex items-center justify-center">
                  {user.firstName?.[0] || user.username?.[0] || "U"}
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {user.fullName || user.username}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
