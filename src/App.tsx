
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Calendario from "./pages/Calendario";
import Carteira from "./pages/Carteira";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./components/AuthProvider";
import Login from "./pages/Login";
import { useAuth } from "./components/AuthProvider";

const queryClient = new QueryClient();

// Componente para proteger rotas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route path="/index" element={<Navigate to="/" replace />} />
              <Route
                path="/calendario"
                element={
                  <ProtectedRoute>
                    <Calendario />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/carteira"
                element={
                  <ProtectedRoute>
                    <Carteira />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </HashRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
