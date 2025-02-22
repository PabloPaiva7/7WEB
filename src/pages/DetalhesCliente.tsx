
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Building2, Clock, MapPin } from "lucide-react";

// Dados de exemplo (você pode substituir por dados reais do seu backend)
const clientesExemplo = [
  {
    id: 1,
    nome: "João Silva",
    banco: "Banco A",
    mesesAtraso: 3,
    codigoAssessoria: "ASS001",
    regiao: "Sul",
    status: "Em andamento",
    valorDivida: 15000,
    ultimoPagamento: "2024-01-15",
    telefone: "(11) 98765-4321",
    email: "joao.silva@email.com",
    endereco: "Rua das Flores, 123 - São Paulo, SP",
  },
  {
    id: 2,
    nome: "Maria Santos",
    banco: "Banco B",
    mesesAtraso: 2,
    codigoAssessoria: "ASS002",
    regiao: "Sudeste",
    status: "Pendente",
    valorDivida: 8500,
    ultimoPagamento: "2024-02-20",
    telefone: "(21) 98765-4321",
    email: "maria.santos@email.com",
    endereco: "Av. Principal, 456 - Rio de Janeiro, RJ",
  },
];

const DetalhesCliente = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const cliente = clientesExemplo.find(c => c.id === Number(id));

  if (!cliente) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <p>Cliente não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <h1 className="text-2xl font-semibold">Detalhes do Cliente</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-medium">{cliente.nome}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p className="font-medium">{cliente.telefone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{cliente.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Endereço</p>
              <p className="font-medium">{cliente.endereco}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Informações Financeiras</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Valor da Dívida</p>
              <p className="font-medium">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(cliente.valorDivida)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Banco</p>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{cliente.banco}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Último Pagamento</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">
                  {new Date(cliente.ultimoPagamento).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Meses em Atraso</p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{cliente.mesesAtraso} meses</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Informações Adicionais</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Código da Assessoria</p>
              <p className="font-medium">{cliente.codigoAssessoria}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Região</p>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{cliente.regiao}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                cliente.status === "Em andamento" 
                  ? "bg-blue-100 text-blue-800" 
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {cliente.status}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DetalhesCliente;
