
import { StatisticCard } from "./StatisticCard";
import { Users, Clock, CheckCircle, BellRing } from "lucide-react";

export const StatisticsSection = () => {
  const statistics = [
    {
      title: "Clientes Ativos",
      value: "253", // Convertido para string
      icon: Users,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-500",
    },
    {
      title: "Pendências",
      value: "45", // Convertido para string
      icon: Clock,
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      iconColor: "text-amber-500",
    },
    {
      title: "Concluídos",
      value: "128", // Convertido para string
      icon: CheckCircle,
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      iconColor: "text-emerald-500",
    },
    {
      title: "Notificações",
      value: "9", // Convertido para string
      icon: BellRing,
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      iconColor: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statistics.map((stat, index) => (
        <StatisticCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          bgColor={stat.bgColor}
          borderColor={stat.borderColor}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  );
};
