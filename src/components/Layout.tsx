
import { Link, useLocation } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Users, BarChart2, Calendar, Settings, FolderOpen, LayoutPanelLeft, CalendarClock } from "lucide-react";
import { Calculadora } from "./Calculadora";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar>
          <SidebarContent>
            <div className="px-6 py-5">
              <h2 className="text-lg font-semibold text-foreground">Carteira Digital</h2>
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild active={location.pathname === "/"}>
                  <Link to="/" className="flex items-center gap-3">
                    <Users className="h-5 w-5" />
                    <span>Clientes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild active={location.pathname === "/carteira"}>
                  <Link to="/carteira" className="flex items-center gap-3">
                    <BarChart2 className="h-5 w-5" />
                    <span>Carteira</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild active={location.pathname === "/calendario"}>
                  <Link to="/calendario" className="flex items-center gap-3">
                    <Calendar className="h-5 w-5" />
                    <span>Calendário</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild active={location.pathname === "/agenda"}>
                  <Link to="/agenda" className="flex items-center gap-3">
                    <CalendarClock className="h-5 w-5" />
                    <span>Agenda</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild active={location.pathname === "/documentos"}>
                  <Link to="/documentos" className="flex items-center gap-3">
                    <FolderOpen className="h-5 w-5" />
                    <span>Documentos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild active={location.pathname === "/painel"}>
                  <Link to="/painel" className="flex items-center gap-3">
                    <LayoutPanelLeft className="h-5 w-5" />
                    <span>Painel</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild active={location.pathname === "/configuracoes"}>
                  <Link to="/configuracoes" className="flex items-center gap-3">
                    <Settings className="h-5 w-5" />
                    <span>Configurações</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <div className="px-3 mt-6">
              <Calculadora />
            </div>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-y-auto">
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
