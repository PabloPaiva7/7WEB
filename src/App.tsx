
import React, { Suspense, lazy, Component, ReactNode, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Carteira from "./pages/Carteira";
import Calendario from "./pages/Calendario";
import { Configuracoes } from "./pages/Configuracoes";
import DetalhesCliente from "./pages/DetalhesCliente";
import Documentos from "./pages/Documentos";
import Painel from "./pages/Painel";
import Agenda from "./pages/Agenda";
import NotFound from "./pages/NotFound";
import TarefasTickets from "./pages/TarefasTickets";
import Mural from "./pages/Mural";
import Relatorios from "./pages/Relatorios";
import Dashboard from "./pages/Dashboard";
import Feedback from "./pages/Feedback";
import Operacional from "./pages/Operacional";
import Historico from "./pages/Historico";
import Demandas from "./pages/Demandas"; // Importar nova página
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import Auth from "./pages/Auth";

import "./App.css";

const basename = import.meta.env.BASE_URL || "/";

const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
  </div>
);

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Erro na renderização:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full items-center justify-center flex-col gap-4">
          <h2 className="text-xl font-semibold">Algo deu errado.</h2>
          <p>Tente recarregar a página.</p>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md"
            onClick={() => window.location.reload()}
          >
            Recarregar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  useEffect(() => {
    const modoSalvo = localStorage.getItem('tema-modo');
    if (modoSalvo === 'escuro') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    const corSalva = localStorage.getItem('tema-cor');
    if (corSalva) {
      const hexToHsl = (hex: string) => {
        hex = hex.replace(/^#/, '');
        let r = parseInt(hex.substring(0, 2), 16) / 255;
        let g = parseInt(hex.substring(2, 4), 16) / 255;
        let b = parseInt(hex.substring(4, 6), 16) / 255;
        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let h = 0;
        let s = 0;
        let l = (max + min) / 2;
        if (max !== min) {
          let d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            case b:
              h = (r - g) / d + 4;
              break;
          }
          h /= 6;
        }
        h = Math.round(h * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);
        return `${h} ${s}% ${l}%`;
      };
      
      document.documentElement.style.setProperty('--primary', hexToHsl(corSalva));
    }
  }, []);

  return (
    <Router basename={basename}>
      <AuthProvider>
        <Layout>
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<Index />} />
                <Route path="/carteira" element={<Carteira />} />
                <Route path="/calendario" element={<Calendario />} />
                <Route path="/documentos" element={<Documentos />} />
                <Route path="/painel" element={<Painel />} />
                <Route path="/agenda" element={<Agenda />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
                <Route path="/cliente/:id" element={<DetalhesCliente />} />
                <Route path="/tarefas" element={<TarefasTickets />} />
                <Route path="/tickets" element={<Navigate to="/tarefas" replace />} />
                <Route path="/mural" element={<Mural />} />
                <Route path="/historico" element={<Historico />} />
                <Route path="/calculadora" element={<Navigate to="/carteira" replace />} />
                <Route path="/relatorios" element={<Relatorios />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/operacional" element={<Operacional />} />
                <Route path="/demandas" element={<Demandas />} /> {/* Nova rota */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </Layout>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
