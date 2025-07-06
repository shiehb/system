"use client";

import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { memo } from "react";
import { type NavItem } from "@/types/sidebar-types";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

interface NavMainProps {
  items: NavItem[];
  managementItems?: NavItem[];
}

const NavItemComponent = memo(
  ({ item, navigate }: { item: NavItem; navigate: (url: string) => void }) => (
    <SidebarMenuItem key={item.title} className="cursor-pointer">
      {item.items ? (
        <Collapsible
          defaultOpen={item.isActive}
          className="group/collapsible w-full"
        >
          <div className="w-full">
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip={item.title}
                className="cursor-pointer w-full"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span className="flex-1 text-left">{item.title}</span>
                <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent asChild>
              <div>
                <SidebarMenuSub>
                  {item.items.map((subItem) => (
                    <SidebarMenuSubItem
                      key={subItem.title}
                      className="cursor-pointer"
                    >
                      <SidebarMenuSubButton
                        asChild
                        onClick={() => navigate(subItem.url)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          {subItem.icon && <subItem.icon className="w-4 h-4" />}
                          <span>{subItem.title}</span>
                        </div>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      ) : (
        <SidebarMenuButton
          tooltip={item.title}
          onClick={() => navigate(item.url)}
          className="cursor-pointer"
        >
          {item.icon && <item.icon className="w-4 h-4" />}
          <span>{item.title}</span>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  )
);

NavItemComponent.displayName = "NavItemComponent";

export function NavMain({ items, managementItems }: NavMainProps) {
  const navigate = useNavigate();

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>MAIN</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <NavItemComponent
              key={`main-${item.title}`}
              item={item}
              navigate={navigate}
            />
          ))}
        </SidebarMenu>
      </SidebarGroup>

      {managementItems && managementItems.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel>MANAGEMENT</SidebarGroupLabel>
          <SidebarMenu>
            {managementItems.map((item) => (
              <NavItemComponent
                key={`mgmt-${item.title}`}
                item={item}
                navigate={navigate}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      )}
    </>
  );
}
