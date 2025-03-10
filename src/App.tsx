
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import { Toaster } from "./components/ui/toaster";

import "./App.css";

// Get the basename from the public URL or default to "/"
const basename = import.meta.env.BASE_URL || "/";

function App() {
  return (
    <Router basename={basename}>
      <Layout>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;
