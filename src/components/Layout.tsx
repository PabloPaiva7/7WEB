
import { useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, Sidebar } from "@/components/ui/sidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SidebarNav } from "@/components/SidebarNav";
import Footer from "@/components/Footer";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading) {
      if (!user && location.pathname !== '/auth') {
        navigate('/auth');
      } else if (user && location.pathname === '/auth') {
        navigate('/');
      }
    }
  }, [user, loading, location.pathname, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user && location.pathname === '/auth') {
    return children;
  }

  const notificationCounts = {
    calendario: 2,
    agenda: 4,
    tarefas: 8,
    mural: 1,
    operacional: 7,
    demandas: 5 // Adicionamos notificações para a página de demandas
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-background">
        <div className="flex flex-1 w-full">
          <Sidebar>
            <SidebarNav 
              currentPath={location.pathname} 
              notificationCounts={notificationCounts} 
            />
          </Sidebar>
          <main className="flex-1 overflow-y-auto flex flex-col">
            <div className="container py-6 flex-1">
              {children}
            </div>
            <Footer />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
