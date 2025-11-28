"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
/* eslint-disable @next/next/no-img-element */
import { Button } from "./ui/button";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPopup,
  NavigationMenuPositioner,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function Header() {
  return (
    <header className="pl-10 flex items-center justify-between border-b border-border bg-background/50 pt-4 backdrop-blur-sm">
      <img src="/logo.png" alt="Logo" width={100} height={50} />
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
                <ul className=" gap-4">
                  <li>
                    <NavigationMenuLink render={<Link href="#" />}>
                      <div className="font-medium">Books</div>
                      <div className="text-muted-foreground">
                        Browse all books in the library.
                      </div>
                    </NavigationMenuLink>
                    <NavigationMenuLink render={<Link href="#" />}>
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
        <div className="bg-linear-to-b h-fit from-red-500 to-blue-500 rounded-full p-1">
          <Avatar className="size-10 ring-2 ring-background">
            <AvatarImage
              src="https://www.europaforum.at/wp2019/wp-content/uploads/2022/06/edi_rama_portret.jpg"
              alt="@evilrabbit"
              width="40"
              height="40"
              className="object-cover "
            />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
