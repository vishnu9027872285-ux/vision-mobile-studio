import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Map, 
  BarChart3, 
  Users, 
  Settings, 
  Bell,
  Search,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const adminMenuItems = [
  { 
    title: "Dashboard", 
    url: "/admin/dashboard", 
    icon: LayoutDashboard,
    description: "Overview and metrics"
  },
  { 
    title: "Reports", 
    url: "/admin/reports", 
    icon: FileText,
    description: "Manage citizen reports",
    badge: "12"
  },
  { 
    title: "Map View", 
    url: "/admin/map", 
    icon: Map,
    description: "Geographic issue view"
  },
  { 
    title: "Analytics", 
    url: "/admin/analytics", 
    icon: BarChart3,
    description: "Performance insights"
  },
  { 
    title: "Users", 
    url: "/admin/users", 
    icon: Users,
    description: "User management"
  },
  { 
    title: "Settings", 
    url: "/admin/settings", 
    icon: Settings,
    description: "System configuration"
  },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;
  const isExpanded = adminMenuItems.some((item) => isActive(item.url));

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" : "hover:bg-muted/50";

  return (
    <Sidebar
      className={isCollapsed ? "w-16" : "w-64"}
      variant="sidebar"
    >
      <SidebarHeader className="border-b p-4">
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-lg p-2">
              <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Nagrik Admin</h2>
              <p className="text-xs text-muted-foreground">Government Portal</p>
            </div>
          </div>
        ) : (
          <div className="bg-primary rounded-lg p-2 mx-auto">
            <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!isCollapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="truncate">{item.title}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {item.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        {!isCollapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2">
                <div className="flex items-center gap-3 w-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-muted-foreground">admin@city.gov</p>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Avatar className="h-8 w-8 mx-auto">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}