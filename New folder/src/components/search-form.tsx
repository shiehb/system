"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  Users,
  FileText,
  Settings,
  BarChart3,
  Building,
  Loader2,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { SidebarInput } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

interface RouteItem {
  id: string;
  title: string;
  path: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  keywords: string[];
}

const routes: RouteItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    path: "/dashboard",
    description: "Overview and analytics",
    icon: <BarChart3 className="h-4 w-4" />,
    category: "Main",
    keywords: ["dashboard", "overview", "analytics", "stats", "home"],
  },
  {
    id: "establishments",
    title: "Establishments",
    path: "/establishments",
    description: "Manage establishments and locations",
    icon: <Building className="h-4 w-4" />,
    category: "Management",
    keywords: [
      "establishments",
      "buildings",
      "locations",
      "manage",
      "facilities",
    ],
  },
  {
    id: "inspections",
    title: "Inspections",
    path: "/inspections",
    description: "View and manage inspections",
    icon: <FileText className="h-4 w-4" />,
    category: "Operations",
    keywords: ["inspections", "reports", "compliance", "audit", "check"],
  },
  {
    id: "create-inspection",
    title: "Create Inspection",
    path: "/create-inspection",
    description: "Start a new inspection process",
    icon: <FileText className="h-4 w-4" />,
    category: "Operations",
    keywords: ["create", "new", "inspection", "start", "begin"],
  },
  {
    id: "map",
    title: "Map View",
    path: "/maps",
    description: "Geographic view of establishments",
    icon: <MapPin className="h-4 w-4" />,
    category: "Navigation",
    keywords: ["map", "location", "geographic", "gis", "coordinates"],
  },
  {
    id: "users",
    title: "User Management",
    path: "/users-management",
    description: "Manage system users and permissions",
    icon: <Users className="h-4 w-4" />,
    category: "Administration",
    keywords: ["users", "accounts", "permissions", "roles", "admin"],
  },
  {
    id: "reports",
    title: "Reports",
    path: "/reports",
    description: "Generate and view reports",
    icon: <FileText className="h-4 w-4" />,
    category: "Analytics",
    keywords: ["reports", "analytics", "data", "export", "statistics"],
  },
  {
    id: "profile",
    title: "Profile Settings",
    path: "/profile",
    description: "Manage your account settings",
    icon: <Settings className="h-4 w-4" />,
    category: "Account",
    keywords: ["profile", "settings", "account", "preferences", "personal"],
  },
];

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<RouteItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Simulate search delay
    const timer = setTimeout(() => {
      const filtered = routes.filter((route) => {
        const searchTerm = query.toLowerCase();
        return (
          route.title.toLowerCase().includes(searchTerm) ||
          route.description.toLowerCase().includes(searchTerm) ||
          route.keywords.some((keyword) =>
            keyword.toLowerCase().includes(searchTerm)
          )
        );
      });

      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedIndex(-1);
      setIsSearching(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleNavigate(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleNavigate = (route: RouteItem) => {
    navigate(route.path);
    setQuery("");
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      suggestionsRef.current &&
      !suggestionsRef.current.contains(e.target as Node) &&
      !inputRef.current?.contains(e.target as Node)
    ) {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const groupedSuggestions = suggestions.reduce((acc, route) => {
    if (!acc[route.category]) {
      acc[route.category] = [];
    }
    acc[route.category].push(route);
    return acc;
  }, {} as Record<string, RouteItem[]>);

  return (
    <div className="relative" {...props}>
      <div className="relative">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <SidebarInput
          ref={inputRef}
          id="search"
          placeholder="Search pages, features..."
          className="h-10 pl-7 pr-8 rounded-full  bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setShowSuggestions(suggestions.length > 0)}
        />
        <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
        {isSearching && (
          <Loader2 className="absolute top-1/2 right-2 size-4 -translate-y-1/2 animate-spin opacity-50" />
        )}
      </div>

      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-y-auto rounded-md border bg-popover shadow-lg"
        >
          <Card className="border-0 shadow-none">
            <CardContent className="p-2">
              {Object.entries(groupedSuggestions).map(
                ([category, items], categoryIndex) => (
                  <div key={category}>
                    {categoryIndex > 0 && <Separator className="my-2" />}
                    <div className="px-2 py-1">
                      <Badge variant="outline" className="text-xs">
                        {category}
                      </Badge>
                    </div>
                    {items.map((route, index) => {
                      const globalIndex =
                        Object.entries(groupedSuggestions)
                          .slice(0, categoryIndex)
                          .reduce((acc, [, items]) => acc + items.length, 0) +
                        index;

                      return (
                        <div
                          key={route.id}
                          className={`flex items-center gap-3 rounded-sm px-2 py-2 cursor-pointer transition-colors ${
                            selectedIndex === globalIndex
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent/50"
                          }`}
                          onClick={() => handleNavigate(route)}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                        >
                          <div className="flex-shrink-0 text-muted-foreground">
                            {route.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {route.title}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {route.description}
                            </div>
                          </div>
                          <div className="flex-shrink-0 text-xs text-muted-foreground">
                            {route.path}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              )}

              {suggestions.length === 0 && query && !isSearching && (
                <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                  No results found for "{query}"
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
