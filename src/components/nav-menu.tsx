"use client"

import * as React from "react"
import { Link } from "react-router-dom"
import { UsersRound, UserRoundPlus, CircleUserRound, Home, Map, Building, Inspect, FileText } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  // ... other component items
]

export function NavigationMenuDemo({ userLevel }: { userLevel?: string }) {
  const isMobile = useIsMobile()

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          {isMobile ? (
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to="/dashboard" title="Dashboard">
                <Home className="h-5 w-5" />
              </Link>
            </NavigationMenuLink>
          ) : (
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to="/dashboard">Dashboard</Link>
            </NavigationMenuLink>
          )}
        </NavigationMenuItem>

        <NavigationMenuItem>
          {isMobile ? (
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to="/maps" title="Maps">
                <Map className="h-5 w-5" />
              </Link>
            </NavigationMenuLink>
          ) : (
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to="/maps">Maps</Link>
            </NavigationMenuLink>
          )}
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            {isMobile ? <Building className="h-5 w-5" /> : "Establishments"}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            {isMobile ? <Inspect className="h-5 w-5" /> : "Inspection"}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/schedule">
                    <div className="font-medium">Set Schedule</div>
                    <div className="text-muted-foreground">
                      Set inspection schedule
                    </div>
                  </Link>
                </NavigationMenuLink>
                {/* ... other inspection links */}
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            {isMobile ? <FileText className="h-5 w-5" /> : "Report"}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link to="#">
                    <div className="font-medium">Components</div>
                    <div className="text-muted-foreground">
                      Browse all components in the library.
                    </div>
                  </Link>
                </NavigationMenuLink>
                {/* ... other report links */}
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {userLevel === 'admin' && (
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              {isMobile ? <UsersRound className="h-5 w-5" /> : "Users"}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[150px] gap-4">
                <li>
                  <NavigationMenuLink asChild>
                    <Link to="/user-management" className="flex-row items-center gap-2">
                      <UsersRound />
                      All Users
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link to="/user-management" className="flex-row items-center gap-2">
                      <UserRoundPlus />
                      Add New User
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link to="/profile" className="flex-row items-center gap-2">
                      <CircleUserRound />
                      Profile
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>


        )}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

