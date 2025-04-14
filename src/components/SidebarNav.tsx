
import { Link } from "react-router-dom";
import { 
  Users, 
  BarChart2, 
  Calendar, 
  Settings, 
  LayoutPanelLeft, 
  CalendarClock, 
  CheckSquare, 
  Megaphone, 
  FileText, 
  PieChart,
  MessageSquare,
  Briefcase,
  History
} from "lucide-react";
import { 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarMenuBadge 
} from "@/components/ui/sidebar";

const navigationItems = [
  { path: "/", label: "Clientes", icon: Users },
  { path: "/carteira", label: "Carteira", icon: BarChart2 },
  { path: "/calendario", label: "Calendário", icon: Calendar, notificationKey: "calendario" },
  { path: "/agenda", label: "Agenda", icon: CalendarClock, notificationKey: "agenda" },
  { path: "/tarefas", label: "Tarefas e Tickets", icon: CheckSquare, notificationKey: "tarefas" },
  { path: "/mural", label: "Mural", icon: Megaphone, notificationKey: "mural" },
  { path: "/historico", label: "Histórico", icon: History },
  { path: "/relatorios", label: "Relatórios", icon: FileText },
  { path: "/dashboard", label: "Dashboard", icon: PieChart },
  { path: "/painel", label: "Painel", icon: LayoutPanelLeft },
  { path: "/operacional", label: "Operacional", icon: Briefcase, notificationKey: "operacional" },
  { path: "/feedback", label: "Feedback", icon: MessageSquare },
  { path: "/configuracoes", label: "Configurações", icon: Settings }
];

type SidebarNavProps = {
  currentPath: string;
  notificationCounts: Record<string, number>;
};

export function SidebarNav({ currentPath, notificationCounts }: SidebarNavProps) {
  return (
    <SidebarContent>
      <div className="px-6 py-5">
        <h2 className="text-lg font-semibold text-foreground">Carteira Digital</h2>
      </div>
      <SidebarMenu>
        {navigationItems.map(({ path, label, icon: Icon, notificationKey }) => (
          <SidebarMenuItem key={path}>
            <SidebarMenuButton asChild isActive={currentPath === path}>
              <Link to={path} className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            </SidebarMenuButton>
            {notificationKey && notificationCounts[notificationKey] > 0 && (
              <SidebarMenuBadge className="bg-red-500">
                {notificationCounts[notificationKey]}
              </SidebarMenuBadge>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarContent>
  );
}
