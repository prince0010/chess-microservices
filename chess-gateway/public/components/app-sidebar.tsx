"use client";
import {
  Clock,
  Home,
  User,
  ChevronDown,
  ChevronRight,
  Bot,
  BookOpen,
  Briefcase,
  FileCheck,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { IUser } from "@/modules/user/interfaces";
import { Fragment, useState } from "react";
import { FaChess } from "react-icons/fa";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

// Menu items.
const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    allowedRoles: ["admin"],
  },
  {
    title: "Coach Dashboard",
    url: "/coach-dashboard",
    icon: Home,
    allowedRoles: ["coach"],
  },
  {
    title: "User Dashboard",
    url: "/users-dashboard",
    icon: Home,
    allowedRoles: ["user"],
  },
  {
    title: "Log",
    url: "/log",
    icon: Clock,
    allowedRoles: ["admin"],
  },
];

const weChessItems = [
  {
    title: "Students",
    url: "/users",
    icon: User,
    allowedRoles: ["admin"],
  },

  {
    title: "Bots",
    url: "/supplier",
    icon: Bot,
    allowedRoles: ["admin"],
  },
  {
    title: "Advanced Materials",
    url: "/products",
    icon: BookOpen,
    allowedRoles: ["admin"],
  },
];

// Administrator section items
const administratorItems = [
  {
    title: "Applicants",
    url: "/applicants",
    icon: FileCheck,
    allowedRoles: ["admin"],
  },
  {
    title: "Coaches",
    url: "/coaches",
    icon: Briefcase,
    allowedRoles: ["admin"],
  },
];

function ProfileCard() {
  const session: any = useSession();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className="flex items-center gap-2 p-2 border-t border-muted">
      <Avatar>
        <AvatarFallback className="text-white bg-primary/60">
          {session?.data?.user?.firstName?.[0] || "U"}
          {session?.data?.user?.lastName?.[0] || "S"}
        </AvatarFallback>
      </Avatar>
      {!isCollapsed && (
        <div className="flex flex-col -space-y-1">
          <span className="font-semibold text-[15px]">
            {session?.data?.user?.firstName} {session?.data?.user?.lastName}
          </span>
          <span className="text-xs text-muted-foreground capitalize">
            {session?.data?.user?.role}
          </span>
        </div>
      )}
    </div>
  );
}

export function AppSidebar() {
  const session: any = useSession();
  // const { eventData, clearEventData } = useSSE();
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const [openSections, setOpenSections] = useState({
    weChess: true,
    administrator: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    if (isCollapsed) return; // Don't allow toggling when collapsed
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isActive = (url: string) => {
    return pathname === url || pathname?.startsWith(url + '/');
  };

  const user = session?.data?.user as IUser;
  const isAdmin = user?.role === "admin";
  const isCoach = user?.role === "coach";
  const isUser = user?.role === "user";

  // Allow access for all authenticated users (admin, coach, user)
  const hasAccess = isAdmin || isCoach || isUser;

  // Check if there are any visible items in a section
  const hasVisibleWeChessItems = weChessItems.some(item =>
    item.allowedRoles.includes(user?.role) || item.allowedRoles.includes("*")
  );

  const hasVisibleAdministratorItems = administratorItems.some(item =>
    item.allowedRoles.includes(user?.role) || item.allowedRoles.includes("*")
  );

  if (!hasAccess) return null;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto">
            <FaChess className="ml-1 text-orange-400 text-2xl shrink-0" />
            {!isCollapsed && (
              <span className="font-bold text-orange-400 uppercase block text-2xl drop-shadow">
                We Chess
              </span>
            )}
          </div>
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 ml-auto"
          > */}
          {/* {isCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )} */}
          {/* </Button> */}
        </div>
      </SidebarHeader>

      <SidebarContent className="space-y-0">
        <SidebarGroup className="pb-1">
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs font-semibold">Menu</SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isAllowed =
                  item.allowedRoles.includes(user?.role) ||
                  item.allowedRoles.includes("*");

                if (!isAllowed) return null;

                const active = isActive(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={isCollapsed ? item.title : undefined}
                      className={`py-2.5 h-auto transition-colors ${active
                        ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        : 'hover:bg-muted'
                        } ${isCollapsed ? 'justify-center' : ''}`}
                    >
                      <Link href={item.url}>
                        <Fragment>
                          <item.icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-orange-700' : ''}`} />
                          {!isCollapsed && <span className="text-[15px]">{item.title}</span>}
                        </Fragment>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Only show We Chess section for admins */}
        {isAdmin && hasVisibleWeChessItems && (
          <SidebarGroup className="py-0.5">
            {isCollapsed ? (
              // When collapsed, show icons without expandable section
              <SidebarGroupContent>
                <SidebarMenu>
                  {weChessItems.map((item) => {
                    const isAllowed =
                      item.allowedRoles.includes(user?.role) ||
                      item.allowedRoles.includes("*");

                    if (!isAllowed) return null;

                    const active = isActive(item.url);

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          className={`py-2.5 h-auto transition-colors justify-center ${active
                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            : 'hover:bg-muted'
                            }`}
                        >
                          <Link href={item.url}>
                            <item.icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-orange-700' : ''}`} />
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            ) : (
              // When expanded, show collapsible section with labels
              <Collapsible
                open={openSections.weChess}
                onOpenChange={() => toggleSection("weChess")}
                className="w-full"
              >
                <SidebarGroupLabel asChild className="px-2 py-2 h-auto">
                  <CollapsibleTrigger className="w-full flex items-center justify-between cursor-pointer hover:bg-muted/50 px-2 py-2 rounded-md transition-colors">
                    <span className="font-semibold text-[15px]">We Chess</span>
                    {openSections.weChess ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent className="mt-0.5">
                    <SidebarMenu>
                      {weChessItems.map((item) => {
                        const isAllowed =
                          item.allowedRoles.includes(user?.role) ||
                          item.allowedRoles.includes("*");

                        if (!isAllowed) return null;

                        const active = isActive(item.url);

                        return (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                              asChild
                              className={`pl-7 text-[15px] py-2.5 h-auto transition-colors ${active
                                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                : 'hover:bg-muted'
                                }`}
                            >
                              <Link href={item.url}>
                                <Fragment>
                                  <item.icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-orange-700' : ''}`} />
                                  <span className="text-[15px]">{item.title}</span>
                                </Fragment>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            )}
          </SidebarGroup>
        )}

        {isAdmin && hasVisibleAdministratorItems && (
          <SidebarGroup className="py-0.5">
            {isCollapsed ? (
              <SidebarGroupContent>
                <SidebarMenu>
                  {administratorItems.map((item) => {
                    const isAllowed =
                      item.allowedRoles.includes(user?.role) ||
                      item.allowedRoles.includes("*");

                    if (!isAllowed) return null;

                    const active = isActive(item.url);

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          className={`py-2.5 h-auto transition-colors justify-center ${active
                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            : 'hover:bg-muted'
                            }`}
                        >
                          <Link href={item.url}>
                            <item.icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-orange-700' : ''}`} />
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            ) : (
              // When expanded, show collapsible section with labels
              <Collapsible
                open={openSections.administrator}
                onOpenChange={() => toggleSection("administrator")}
                className="w-full"
              >
                <SidebarGroupLabel asChild className="px-2 py-2 h-auto">
                  <CollapsibleTrigger className="w-full flex items-center justify-between cursor-pointer hover:bg-muted/50 px-2 py-2 rounded-md transition-colors">
                    <span className="font-semibold text-[15px]">Administrator</span>
                    {openSections.administrator ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent className="mt-0.5">
                    <SidebarMenu>
                      {administratorItems.map((item) => {
                        const isAllowed =
                          item.allowedRoles.includes(user?.role) ||
                          item.allowedRoles.includes("*");

                        if (!isAllowed) return null;

                        const active = isActive(item.url);

                        return (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                              asChild
                              className={`pl-7 text-[15px] py-2.5 h-auto transition-colors ${active
                                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                : 'hover:bg-muted'
                                }`}
                            >
                              <Link href={item.url}>
                                <Fragment>
                                  <item.icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-orange-700' : ''}`} />
                                  <span className="text-[15px]">{item.title}</span>
                                </Fragment>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            )}
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <ProfileCard />
      </SidebarFooter>
    </Sidebar>
  );
}