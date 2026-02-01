import { ReactNode } from "react";
import { AccountSidebar } from "./AccountSidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AccountSettingsLayoutProps {
  children: ReactNode;
}

function MobileMenuButton() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="md:hidden fixed top-4 left-4 z-50">
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-lg bg-background border-border shadow-md"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    </div>
  );
}

export function AccountSettingsLayout({ children }: AccountSettingsLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full">
          <Sidebar className="border-r border-border w-64">
            <SidebarContent className="flex flex-col h-full">
              <SidebarGroup className="flex-1 flex flex-col min-h-0">
                <SidebarGroupContent className="flex-1 flex flex-col min-h-0">
                  <AccountSidebar />
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex-1 overflow-y-auto bg-background relative">
            {/* Mobile Burger Menu Button */}
            <MobileMenuButton />
            <div className="container max-w-4xl mx-auto p-4 md:p-8 pt-16 md:pt-8">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
