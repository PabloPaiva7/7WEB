
import { StatisticCard } from "./StatisticCard";
import { Briefcase, Clock, CheckCircle, BellRing } from "lucide-react";

export const StatisticsSection = () => {
  const statistics = [
    {
      title: "Contratos Ativos",
      value: "253", 
      icon: Briefcase,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-500",
      change: "12%",
      positive: true
    },
    {
      title: "Pendências",
      value: "45", 
      icon: Clock,
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      iconColor: "text-amber-500",
      change: "5%",
      positive: false
    },
    {
      title: "Concluídos",
      value: "128", 
      icon: CheckCircle,
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      iconColor: "text-emerald-500",
      change: "18%",
      positive: true
    },
    {
      title: "Notificações",
      value: "9", 
      icon: BellRing,
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      iconColor: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statistics.map((stat, index) => (
        <StatisticCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          bgColor={stat.bgColor}
          borderColor={stat.borderColor}
          iconColor={stat.iconColor}
          change={stat.change}
          positive={stat.positive}
        />
      ))}
    </div>
  );
};
