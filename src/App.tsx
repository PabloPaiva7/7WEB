
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Carteira from "./pages/Carteira";
import Calendario from "./pages/Calendario";
import { Configuracoes } from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";
import { Toaster } from "./components/ui/toaster";

import "./App.css";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/carteira" element={<Carteira />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;
