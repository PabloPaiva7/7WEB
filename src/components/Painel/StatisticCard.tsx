
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatisticCardProps {
  title: string;
  value: string; // Changed from number to string
  icon: LucideIcon;
  bgColor: string;
  borderColor: string;
  iconColor: string;
}

export const StatisticCard = ({ 
  title, 
  value, 
  icon: Icon, 
  bgColor, 
  borderColor, 
  iconColor 
}: StatisticCardProps) => {
  return (
    <Card className={`${bgColor} ${borderColor}`}>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground dark:text-[#D9B300]">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-white dark:bg-gray-800">
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </CardContent>
    </Card>
  );
};
