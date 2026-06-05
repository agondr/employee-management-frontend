import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/store/authSlice";
import AccountDialog from "./AccountDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";

function DropDownAvatar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);

  const getInitials = (username) => {
    if (!username) return "AA";

    return username
      .split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const displayName = user?.username || user?.user_name || user?.name;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarFallback className="bg-red-700 text-white">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setAccountDialogOpen(true)}>
            My Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setChangePasswordDialogOpen(true)}>
            Change Password
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AccountDialog
        open={accountDialogOpen}
        onOpenChange={setAccountDialogOpen}
      />
      <ChangePasswordDialog
        open={changePasswordDialogOpen}
        onOpenChange={setChangePasswordDialogOpen}
      />
    </>
  );
}

export default DropDownAvatar;
