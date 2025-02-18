
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

// Dados de exemplo
const clientesExemplo = [
  {
    id: 1,
    nome: "João Silva",
    banco: "Banco A",
    mesesAtraso: 3,
    codigoAssessoria: "ASS001",
    regiao: "Sul",
    status: "Em andamento",
  },
  {
    id: 2,
    nome: "Maria Santos",
    banco: "Banco B",
    mesesAtraso: 2,
    codigoAssessoria: "ASS002",
    regiao: "Sudeste",
    status: "Pendente",
  },
  // Adicione mais clientes de exemplo conforme necessário
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Carteira de Clientes</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar cliente..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientesExemplo.map((cliente) => (
          <Card key={cliente.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <h3 className="text-lg font-medium">{cliente.nome}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Banco</p>
                  <p className="font-medium">{cliente.banco}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Meses em Atraso</p>
                  <p className="font-medium">{cliente.mesesAtraso}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Região</p>
                  <p className="font-medium">{cliente.regiao}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Código</p>
                  <p className="font-medium">{cliente.codigoAssessoria}</p>
                </div>
              </div>

              <div className="pt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  cliente.status === "Em andamento" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {cliente.status}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;
