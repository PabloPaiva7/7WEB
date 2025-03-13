
import { GoalCard } from "./GoalCard";
import { CheckCircle, ThumbsUp, Trophy, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

export const GoalsSection = () => {
  // In a real application, these values would come from an API or context
  const [dailyGoals, setDailyGoals] = useState({
    resolvidos: { current: 0, target: 30 },
    aprovados: { current: 0, target: 15 },
    quitados: { current: 0, target: 3 }
  });

  const [monthlyGoals, setMonthlyGoals] = useState({
    resolvidos: { current: 0, target: 660 },
    aprovados: { current: 0, target: 330 },
    quitados: { current: 0, target: 32 }
  });

  // This is just for demo purposes - in a real app you'd update these values based on user actions
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate some progress for demonstration
      setDailyGoals({
        resolvidos: { current: 18, target: 30 },
        aprovados: { current: 9, target: 15 },
        quitados: { current: 2, target: 3 }
      });
      
      setMonthlyGoals({
        resolvidos: { current: 320, target: 660 },
        aprovados: { current: 145, target: 330 },
        quitados: { current: 12, target: 32 }
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      {/* Daily Goals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Metas Diárias</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GoalCard
            title="Resolvidos"
            current={dailyGoals.resolvidos.current}
            target={dailyGoals.resolvidos.target}
            icon={CheckCircle}
            color="text-emerald-500"
            bgColor="bg-emerald-50"
          />
          
          <GoalCard
            title="Aprovados"
            current={dailyGoals.aprovados.current}
            target={dailyGoals.aprovados.target}
            icon={ThumbsUp}
            color="text-blue-500"
            bgColor="bg-blue-50"
          />
          
          <GoalCard
            title="Quitados"
            current={dailyGoals.quitados.current}
            target={dailyGoals.quitados.target}
            icon={Trophy}
            color="text-amber-500"
            bgColor="bg-amber-50"
          />
        </div>
      </div>
      
      {/* Monthly Goals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Metas Mensais</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GoalCard
            title="Resolvidos"
            current={monthlyGoals.resolvidos.current}
            target={monthlyGoals.resolvidos.target}
            icon={CheckCircle}
            color="text-emerald-500"
            bgColor="bg-emerald-50"
          />
          
          <GoalCard
            title="Aprovados"
            current={monthlyGoals.aprovados.current}
            target={monthlyGoals.aprovados.target}
            icon={ThumbsUp}
            color="text-blue-500"
            bgColor="bg-blue-50"
          />
          
          <GoalCard
            title="Quitados"
            current={monthlyGoals.quitados.current}
            target={monthlyGoals.quitados.target}
            icon={Trophy}
            color="text-amber-500"
            bgColor="bg-amber-50"
          />
        </div>
      </div>
    </div>
  );
};
