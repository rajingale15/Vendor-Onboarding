import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Building2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileDropdownProps {
  userType: "buyer" | "vendor" | null;
  isVerified?: boolean;
  onSignOut?: () => void;
}

export const ProfileDropdown = ({ userType, isVerified, onSignOut }: ProfileDropdownProps) => {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    if (userType === "vendor") {
      navigate("/vendor-dashboard");
    }
  };

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          {userType === "vendor" && (
            <Badge 
              className={`absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs ${
                isVerified ? 'bg-green-500' : 'bg-yellow-500'
              }`}
            >
              {isVerified ? '✓' : '?'}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <div className="flex items-center gap-2 p-2">
          <Building2 className="h-4 w-4" />
          <span className="font-medium">
            {userType === "vendor" ? "Vendor Account" : "Buyer Account"}
          </span>
        </div>
        <DropdownMenuSeparator />
        {userType === "vendor" && (
          <>
            <DropdownMenuItem onClick={handleDashboardClick}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>Seller Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};