
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface ClienteCardProps {
  cliente: {
    id: string;
    contrato: string;
    banco: string | null;
    escritorio: string | null;
    data: string | null;
    valor_cliente: number | null;
    situacao: string | null;
  };
}

export const ClienteCard = ({ cliente }: ClienteCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("Navegando para o cliente:", cliente.id);
    navigate(`/cliente/${cliente.id}`);
  };

  return (
    <Card 
      className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Contrato</p>
          <h3 className="text-lg font-medium">{cliente.contrato}</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Banco</p>
            <p className="font-medium">{cliente.banco}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Escritório</p>
            <p className="font-medium">{cliente.escritorio}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Data</p>
            <p className="font-medium">
              {cliente.data ? new Date(cliente.data).toLocaleDateString('pt-BR') : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Valor</p>
            <p className="font-medium">
              {cliente.valor_cliente 
                ? new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(cliente.valor_cliente)
                : 'R$ 0,00'
              }
            </p>
          </div>
        </div>

        <div className="pt-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            cliente.situacao === "Pendente" 
              ? "bg-yellow-100 text-yellow-800" 
              : cliente.situacao === "Prioridade Total"
              ? "bg-red-100 text-red-800"
              : cliente.situacao === "Prioridade"
              ? "bg-orange-100 text-orange-800"
              : cliente.situacao === "Verificado"
              ? "bg-green-100 text-green-800"
              : cliente.situacao === "Análise"
              ? "bg-blue-100 text-blue-800"
              : cliente.situacao === "Aprovado"
              ? "bg-emerald-100 text-emerald-800"
              : cliente.situacao === "Quitado"
              ? "bg-teal-100 text-teal-800"
              : cliente.situacao === "Apreendido"
              ? "bg-purple-100 text-purple-800"
              : cliente.situacao === "Cancelado"
              ? "bg-slate-100 text-slate-800"
              : "bg-gray-100 text-gray-800"
          }`}>
            {cliente.situacao || 'Pendente'}
          </span>
        </div>
      </div>
    </Card>
  );
};
