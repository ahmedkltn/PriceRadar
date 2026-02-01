import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Key, Bell, ArrowLeft, Briefcase, Settings, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/auth/authSlice";
import { useGetUserProfileQuery } from "@/store/auth/authApiSlice";
import { isAuthenticated as checkAuth } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  {
    title: "Information",
    href: "/account/profile",
    icon: Briefcase,
  },
  {
    title: "Password",
    href: "/account/change-password",
    icon: Key,
  },
  {
    title: "Notifications",
    href: "/account/notifications",
    icon: Bell,
  },
  {
    title: "Delete",
    href: "#",
    icon: AlertTriangle,
    disabled: true,
  },
];

export function AccountSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const hasTokens = checkAuth();
  const { data: userProfile } = useGetUserProfileQuery(undefined, {
    skip: !hasTokens,
  });

  const currentUser = user || userProfile;

  const getInitials = (user: { first_name?: string; last_name?: string; username: string }) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user.first_name) {
      return user.first_name[0].toUpperCase();
    }
    return user.username[0].toUpperCase();
  };

  const getUserDisplayName = (user: { first_name?: string; last_name?: string; username: string }) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user.first_name) {
      return user.first_name;
    }
    return user.username;
  };

  return (
    <div className="flex flex-col h-full bg-muted/30">
      {/* Back Button */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* USER SETTINGS Heading */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-border">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          User Settings
        </h2>
      </div>

      {/* Navigation Items - Scrollable */}
      <nav className="flex-1 overflow-y-auto space-y-1 px-2 py-4 min-h-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          const isDisabled = item.disabled;

          if (isDisabled) {
            return (
              <div
                key={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground/50 cursor-not-allowed"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.title}</span>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info at Bottom - Sticky */}
      {currentUser && (
        <div className="flex-shrink-0 px-4 py-4 border-t border-border bg-muted/30 mt-auto">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-background text-sm font-semibold">
                {getInitials(currentUser)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {getUserDisplayName(currentUser)}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                PriceRadar
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
