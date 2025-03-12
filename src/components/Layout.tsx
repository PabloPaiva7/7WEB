
import { Link, useLocation } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuBadge } from "@/components/ui/sidebar";
import { Users, BarChart2, Calendar, Settings, FolderOpen, LayoutPanelLeft, CalendarClock, Ticket, CheckSquare, Megaphone } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  // Simulação de contadores de notificações - em um cenário real, esses valores viriam de um contexto ou API
  const notificationCounts = {
    calendario: 2,
    agenda: 4,
    tickets: 3,
    tarefas: 5,
    mural: 1
  };
  
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
                <SidebarMenuButton asChild isActive={location.pathname === "/"}>
                  <Link to="/" className="flex items-center gap-3">
                    <Users className="h-5 w-5" />
                    <span>Clientes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/carteira"}>
                  <Link to="/carteira" className="flex items-center gap-3">
                    <BarChart2 className="h-5 w-5" />
                    <span>Carteira</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/calendario"}>
                  <Link to="/calendario" className="flex items-center gap-3">
                    <Calendar className="h-5 w-5" />
                    <span>Calendário</span>
                  </Link>
                </SidebarMenuButton>
                {notificationCounts.calendario > 0 && (
                  <SidebarMenuBadge className="bg-red-500">
                    {notificationCounts.calendario}
                  </SidebarMenuBadge>
                )}
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/agenda"}>
                  <Link to="/agenda" className="flex items-center gap-3">
                    <CalendarClock className="h-5 w-5" />
                    <span>Agenda</span>
                  </Link>
                </SidebarMenuButton>
                {notificationCounts.agenda > 0 && (
                  <SidebarMenuBadge className="bg-red-500">
                    {notificationCounts.agenda}
                  </SidebarMenuBadge>
                )}
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/tickets"}>
                  <Link to="/tickets" className="flex items-center gap-3">
                    <Ticket className="h-5 w-5" />
                    <span>Tickets</span>
                  </Link>
                </SidebarMenuButton>
                {notificationCounts.tickets > 0 && (
                  <SidebarMenuBadge className="bg-red-500">
                    {notificationCounts.tickets}
                  </SidebarMenuBadge>
                )}
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/tarefas"}>
                  <Link to="/tarefas" className="flex items-center gap-3">
                    <CheckSquare className="h-5 w-5" />
                    <span>Tarefas</span>
                  </Link>
                </SidebarMenuButton>
                {notificationCounts.tarefas > 0 && (
                  <SidebarMenuBadge className="bg-red-500">
                    {notificationCounts.tarefas}
                  </SidebarMenuBadge>
                )}
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/mural"}>
                  <Link to="/mural" className="flex items-center gap-3">
                    <Megaphone className="h-5 w-5" />
                    <span>Mural</span>
                  </Link>
                </SidebarMenuButton>
                {notificationCounts.mural > 0 && (
                  <SidebarMenuBadge className="bg-red-500">
                    {notificationCounts.mural}
                  </SidebarMenuBadge>
                )}
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/documentos"}>
                  <Link to="/documentos" className="flex items-center gap-3">
                    <FolderOpen className="h-5 w-5" />
                    <span>Documentos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/painel"}>
                  <Link to="/painel" className="flex items-center gap-3">
                    <LayoutPanelLeft className="h-5 w-5" />
                    <span>Painel</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/configuracoes"}>
                  <Link to="/configuracoes" className="flex items-center gap-3">
                    <Settings className="h-5 w-5" />
                    <span>Configurações</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
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
