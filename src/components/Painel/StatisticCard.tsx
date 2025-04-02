
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatisticCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  bgColor: string;
  borderColor: string;
  iconColor: string;
  change?: string;
  positive?: boolean;
}

export const StatisticCard = ({
  title,
  value,
  icon: Icon,
  bgColor,
  borderColor,
  iconColor,
  change,
  positive = true
}: StatisticCardProps) => {
  return (
    <Card className={`${bgColor} border ${borderColor} dark:bg-gray-800 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 card-hover animate-fade-in-up`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold mb-1 text-gray-900 dark:text-[#D9B300]">{title}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-[#D9B300]">{value}</p>
            {change && (
              <p className={`text-xs mt-1 ${positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {positive ? "+" : "-"}{change} {positive ? "aumento" : "redução"}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${iconColor} ${bgColor} bg-opacity-20`}>
            <Icon className={`h-6 w-6 ${iconColor} dark:text-[#D9B300]`} />
          </div>
        </div>
      </div>
    </Card>
  );
};
