
import { StatisticCard } from "@/components/Painel/StatisticCard";
import { Users, Wallet, FileText, CreditCard } from "lucide-react";

interface KpiCardsProps {
  totalClientes: number;
  valorTotal: number;
  mediaPrazo: number;
}

export const KpiCards = ({
  totalClientes,
  valorTotal,
  mediaPrazo
}: KpiCardsProps) => {
  const kpis = [
    { 
      title: 'Clientes Ativos',
      value: totalClientes.toString(),
      icon: Users,
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      iconColor: 'text-indigo-500'
    },
    { 
      title: 'Carteira Total',
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(valorTotal),
      icon: Wallet,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      iconColor: 'text-emerald-500'
    },
    { 
      title: 'Contratos Pendentes',
      value: '27',
      icon: FileText,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconColor: 'text-amber-500'
    },
    { 
      title: `${Math.round(mediaPrazo)} dias`,
      value: 'Prazo Médio',
      icon: CreditCard,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <StatisticCard
          key={index}
          title={kpi.title}
          value={kpi.value}
          icon={kpi.icon}
          bgColor={kpi.bgColor}
          borderColor={kpi.borderColor}
          iconColor={kpi.iconColor}
        />
      ))}
    </div>
  );
};
