import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoadingSpinner from "./ui/loading-spinner";
import { User } from "firebase/auth";
import { UserRound } from "lucide-react";

interface UserAvatarProps {
  user: User | null;
  loading: boolean;
  signOut: () => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, loading, signOut }) => {
  const initials = user?.displayName
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  if (loading) {
    return (
      <div className="flex h-[40px] w-[40px] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user.photoURL || ""} />
          <AvatarFallback>{initials || <UserRound />}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {user.displayName && (
          <>
            <DropdownMenuLabel>{user.displayName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
