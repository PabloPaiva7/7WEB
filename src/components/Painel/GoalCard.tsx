
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalCardProps {
  title: string;
  current: number;
  target: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const GoalCard = ({ 
  title, 
  current, 
  target, 
  icon: Icon,
  color,
  bgColor,
}: GoalCardProps) => {
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  
  return (
    <Card className={cn("border", bgColor)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-sm dark:text-[#D9B300]/90">{title}</h3>
          <div className={cn("p-2 rounded-full", color, "bg-white/80 dark:bg-gray-800/80")}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-2xl font-bold text-foreground dark:text-[#D9B300]">{current}</span>
          <span className="text-sm text-muted-foreground dark:text-[#D9B300]/80">de {target}</span>
        </div>
        
        <Progress 
          value={percentage} 
          className="h-2 mt-2"
          indicatorClassName={color.replace("text-", "bg-")}
        />
        
        <p className="text-xs text-right mt-1 text-muted-foreground dark:text-[#D9B300]/80">
          {percentage}% concluído
        </p>
      </CardContent>
    </Card>
  );
};
