import React, { Suspense, lazy, Component, ReactNode } from "react";
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
import Tickets from "./pages/Tickets";
import Tarefas from "./pages/Tarefas";
import Mural from "./pages/Mural";
import Calculadora from "./pages/Calculadora";
import Relatorios from "./pages/Relatorios";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "./components/ui/toaster";

import "./App.css";

// Get the basename from the public URL or default to "/"
const basename = import.meta.env.BASE_URL || "/";

// Loading fallback
const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
  </div>
);

// Error boundary component with proper TypeScript interface
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
  return (
    <Router basename={basename}>
      <Layout>
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/carteira" element={<Carteira />} />
              <Route path="/calendario" element={<Calendario />} />
              <Route path="/documentos" element={<Documentos />} />
              <Route path="/painel" element={<Painel />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="/cliente/:id" element={<DetalhesCliente />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/tarefas" element={<Tarefas />} />
              <Route path="/mural" element={<Mural />} />
              <Route path="/calculadora" element={<Calculadora />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;
