
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";

interface GoalCardProps {
  title: string;
  current: number;
  target: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const GoalCard = ({ title, current, target, icon: Icon, color, bgColor }: GoalCardProps) => {
  const progress = Math.min(Math.round((current / target) * 100), 100);
  
  return (
    <Card className="card-hover group animate-fade-in-up transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-full ${bgColor}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <span className={`text-sm font-semibold ${color}`}>{progress}%</span>
        </div>
        
        <h3 className="text-base font-medium mt-4 mb-2 dark:text-[#D9B300]">{title}</h3>
        
        <Progress 
          value={progress} 
          className="h-2 mb-2" 
          indicatorClassName={color === 'text-emerald-500' ? 'bg-emerald-500' : 
                             color === 'text-blue-500' ? 'bg-blue-500' : 
                             color === 'text-amber-500' ? 'bg-amber-500' : ''}
        />
        
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>Meta: {target}</span>
          <span>Atual: {current}</span>
        </div>
      </CardContent>
    </Card>
  );
};
