import { Link } from "react-router-dom";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function NavigationMenuDemo({ userLevel }: { userLevel?: string }) {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList className="flex flex-nowrap">
        {/* Dashboard */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/dashboard">Dashboard</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Maps */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/maps">Maps</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Establishments */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Establishments</NavigationMenuTrigger>
          <NavigationMenuContent></NavigationMenuContent>
        </NavigationMenuItem>

        {/* Inspection */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Inspection</NavigationMenuTrigger>
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
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Report */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Report</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/reports">
                    <div className="font-medium">Report</div>
                    <div className="text-muted-foreground">Browse all.</div>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Admin-only Users link */}
        {userLevel === "admin" && (
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link to="/user-management">Users</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
