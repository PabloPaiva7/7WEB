
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
      className="p-4 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer border-l-4 border-l-primary"
      onClick={handleClick}
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground dark:text-[#D9B300]/80">Contrato</p>
          <h3 className="text-lg font-medium dark:text-[#D9B300]">{cliente.contrato}</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground dark:text-[#D9B300]/80">Banco</p>
            <p className="font-medium dark:text-[#D9B300]">{cliente.banco}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground dark:text-[#D9B300]/80">Escritório</p>
            <p className="font-medium dark:text-[#D9B300]">{cliente.escritorio}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground dark:text-[#D9B300]/80">Data</p>
            <p className="font-medium dark:text-[#D9B300]">
              {cliente.data ? new Date(cliente.data).toLocaleDateString('pt-BR') : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground dark:text-[#D9B300]/80">Valor</p>
            <p className="font-medium dark:text-[#D9B300]">
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
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" 
              : cliente.situacao === "Prioridade Total"
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
              : cliente.situacao === "Prioridade"
              ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
              : cliente.situacao === "Verificado"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              : cliente.situacao === "Análise"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              : cliente.situacao === "Aprovado"
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
              : cliente.situacao === "Quitado"
              ? "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300"
              : cliente.situacao === "Apreendido"
              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
              : cliente.situacao === "Cancelado"
              ? "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300"
              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
          }`}>
            {cliente.situacao || 'Pendente'}
          </span>
        </div>
      </div>
    </Card>
  );
};
