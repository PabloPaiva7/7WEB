
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

type Cliente = {
  id: number;
  data: string;
  resolucao: string;
  contrato: string;
  escritorio: string;
  ultimoPagamento: string;
  prazo: string;
  entrada: string;
  banco: string;
  codigo: string;
  valorCliente: string;
  contato: string;
  negociacao: string;
  situacao: string;
};

// Dados de exemplo
const clientesCarteira: Cliente[] = [
  {
    id: 1,
    data: "2024-03-15",
    resolucao: "Pendente",
    contrato: "CT001",
    escritorio: "Escritório A",
    ultimoPagamento: "2024-02-15",
    prazo: "30 dias",
    entrada: "Alta",
    banco: "Banco X",
    codigo: "COD001",
    valorCliente: "R$ 50.000,00",
    contato: "(11) 99999-9999",
    negociacao: "Em andamento",
    situacao: "Ativo",
  },
  // Adicione mais clientes conforme necessário
];

const Carteira = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Minha Carteira</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="p-4 text-left font-medium">Data</th>
              <th className="p-4 text-left font-medium">Resolução</th>
              <th className="p-4 text-left font-medium">Contrato</th>
              <th className="p-4 text-left font-medium">Escritório</th>
              <th className="p-4 text-left font-medium">Último Pagamento</th>
              <th className="p-4 text-left font-medium">Prazo</th>
              <th className="p-4 text-left font-medium">Entrada</th>
              <th className="p-4 text-left font-medium">Banco</th>
              <th className="p-4 text-left font-medium">Código</th>
              <th className="p-4 text-left font-medium">Valor</th>
              <th className="p-4 text-left font-medium">Contato</th>
              <th className="p-4 text-left font-medium">Negociação</th>
              <th className="p-4 text-left font-medium">Situação</th>
            </tr>
          </thead>
          <tbody>
            {clientesCarteira.map((cliente) => (
              <tr key={cliente.id} className="border-b hover:bg-muted/50">
                <td className="p-4">{cliente.data}</td>
                <td className="p-4">{cliente.resolucao}</td>
                <td className="p-4">{cliente.contrato}</td>
                <td className="p-4">{cliente.escritorio}</td>
                <td className="p-4">{cliente.ultimoPagamento}</td>
                <td className="p-4">{cliente.prazo}</td>
                <td className="p-4">{cliente.entrada}</td>
                <td className="p-4">{cliente.banco}</td>
                <td className="p-4">{cliente.codigo}</td>
                <td className="p-4">{cliente.valorCliente}</td>
                <td className="p-4">{cliente.contato}</td>
                <td className="p-4">{cliente.negociacao}</td>
                <td className="p-4">{cliente.situacao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Carteira;
