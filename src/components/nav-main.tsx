"use client";

import { ChevronDown, type LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

export function NavMain({
  items,
  managementItems,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  }[];
  managementItems?: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  }[];
}) {
  const navigate = useNavigate();

  return (
    <>
      {/* Main Navigation */}
      <SidebarGroup>
        <SidebarGroupLabel>MAIN</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem
              key={`main-${item.title}`}
              className="cursor-pointer"
            >
              {item.items ? (
                <Collapsible
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className="cursor-pointer"
                      >
                        {item.icon && <item.icon className="w-4 h-4" />}
                        <span>{item.title}</span>
                        <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 cursor-pointer" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem
                            key={`main-sub-${subItem.title}`}
                            className="cursor-pointer"
                          >
                            <SidebarMenuSubButton
                              asChild
                              onClick={() => navigate(subItem.url)}
                              className="cursor-pointer"
                            >
                              <div className="flex items-center gap-2 cursor-pointer">
                                {subItem.icon && (
                                  <subItem.icon className="w-4 h-4" />
                                )}
                                <span>{subItem.title}</span>
                              </div>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
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
          ))}
        </SidebarMenu>
      </SidebarGroup>

      {/* Management Navigation */}
      {managementItems && managementItems.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel>MANAGEMENT</SidebarGroupLabel>
          <SidebarMenu>
            {managementItems.map((item) => (
              <SidebarMenuItem
                key={`mgmt-${item.title}`}
                className="cursor-pointer"
              >
                {item.items ? (
                  <Collapsible
                    asChild
                    defaultOpen={item.isActive}
                    className="group/collapsible"
                  >
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          className="cursor-pointer"
                        >
                          {item.icon && <item.icon className="w-4 h-4" />}
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 cursor-pointer" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem
                              key={`mgmt-sub-${subItem.title}`}
                              className="cursor-pointer"
                            >
                              <SidebarMenuSubButton
                                asChild
                                onClick={() => navigate(subItem.url)}
                                className="cursor-pointer"
                              >
                                <div className="flex items-center gap-2 cursor-pointer">
                                  {subItem.icon && (
                                    <subItem.icon className="w-4 h-4" />
                                  )}
                                  <span>{subItem.title}</span>
                                </div>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
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
            ))}
          </SidebarMenu>
        </SidebarGroup>
      )}
    </>
  );
}
