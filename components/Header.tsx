"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
/* eslint-disable @next/next/no-img-element */
import { Button } from "./ui/button";
import ThemeChangeButton from "./MultiUseComponents/ThemeChangeButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPopup,
  NavigationMenuPositioner,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { SignInButton, useUser, useClerk } from "@clerk/nextjs";

export default function Header() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const getUserInitials = () => {
    if (!user) return "??";
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return (
      user.emailAddresses[0]?.emailAddress.substring(0, 2).toUpperCase() || "??"
    );
  };

  return (
    <header className="flex items-center justify-between pt-2  backdrop-blur-sm">
      {/* Logo */}
      <Link href="/">
        <img src="/logo.png" alt="Logo" width={100} height={50} />
      </Link>

      {/* Header nav Links area */}
      <div className="flex">
        <NavigationMenu className="mr-4">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="/">
                <Button variant="link">Home</Button>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Browse</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="gap-4 ">
                  <li>
                    <NavigationMenuLink render={<Link href="/books" />}>
                      <div className="font-medium">Books</div>
                      <div className="text-muted-foreground">
                        Browse all books in the library.
                      </div>
                    </NavigationMenuLink>
                    <NavigationMenuLink render={<Link href="/clubs" />}>
                      <div className="font-medium">Clubs</div>
                      <div className="text-muted-foreground">
                        Find like minded readers and join book clubs.
                      </div>
                    </NavigationMenuLink>
                    <NavigationMenuLink render={<Link href="#" />}>
                      <div className="font-medium">Blogs</div>
                      <div className="text-muted-foreground">
                        Discover the latest posts and updates from the most
                        famous Bloggers.
                      </div>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/MyBooks">
                <Button variant="link">My Books</Button>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuPositioner>
            <NavigationMenuPopup />
          </NavigationMenuPositioner>
          {/* User Authentication */}
          {!isLoaded ? (
            // Loading state
            <div className="size-10 animate-pulse rounded-full bg-muted" />
          ) : isSignedIn ? (
            // Signed in - show user dropdown
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-1 transition rounded-full cursor-pointer outline-none bg-linear-to-br h-fit from-primary/80 to-primary hover:brightness-105 focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Open user menu"
                  type="button"
                >
                  <Avatar className="size-10 ring-2 ring-background">
                    <AvatarImage
                      src={user?.imageUrl}
                      alt={user?.username || "User"}
                      width="40"
                      height="40"
                      className="object-cover"
                    />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarImage
                        src={user?.imageUrl}
                        alt={user?.username || "User"}
                      />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold">
                        {user?.firstName && user?.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user?.username || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.emailAddresses[0]?.emailAddress}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/MyBooks">My Books</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/clubs">My Clubs</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <ThemeChangeButton asDropdownItem />
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => signOut()}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Not signed in - show sign in button
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          )}
        </NavigationMenu>
      </div>
    </header>
  );
}
