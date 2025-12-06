"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
/* eslint-disable @next/next/no-img-element */
import { Button } from "./ui/button";
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

export default function Header() {
  return (
    <header className="flex items-center justify-between pt-2  bg-background/50 backdrop-blur-sm">
      {/* Logo */}
      <Link href="/">
        <img src="/logo.png" alt="Logo" width={100} height={50} />
      </Link>
      {/* Header nav Links area */}
      <div className="flex">
        <NavigationMenu>
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
              <NavigationMenuLink href="/">
                <Button variant="link">Home</Button>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuPositioner>
            <NavigationMenuPopup />
          </NavigationMenuPositioner>
        </NavigationMenu>
        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-1 transition rounded-full outline-none bg-linear-to-b h-fit from-red-500 to-blue-500 hover:brightness-105 focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Open user menu"
              type="button"
            >
              <Avatar className="size-10 ring-2 ring-background">
                <AvatarImage
                  src="https://www.europaforum.at/wp2019/wp-content/uploads/2022/06/edi_rama_portret.jpg"
                  alt="@evilrabbit"
                  width="40"
                  height="40"
                  className="object-cover"
                />
                <AvatarFallback>AR</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage
                    src="https://www.europaforum.at/wp2019/wp-content/uploads/2022/06/edi_rama_portret.jpg"
                    alt="@evilrabbit"
                  />
                  <AvatarFallback>AR</AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">Alex Reader</p>
                  <p className="text-xs text-muted-foreground">
                    alex.reader@example.com
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>placeholder #1</DropdownMenuItem>
            <DropdownMenuItem>placeholder #2</DropdownMenuItem>
            <DropdownMenuItem>placeholder #3</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>placeholder Settings</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              placeholder Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
