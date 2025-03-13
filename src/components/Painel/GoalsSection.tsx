
import { GoalCard } from "./GoalCard";
import { CheckCircle, ThumbsUp, Trophy } from "lucide-react";
import { useState, useEffect } from "react";

export const GoalsSection = () => {
  // In a real application, these values would come from an API or context
  const [goals, setGoals] = useState({
    resolvidos: { current: 0, target: 30 },
    aprovados: { current: 0, target: 15 },
    quitados: { current: 0, target: 3 }
  });

  // This is just for demo purposes - in a real app you'd update these values based on user actions
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate some progress for demonstration
      setGoals({
        resolvidos: { current: 18, target: 30 },
        aprovados: { current: 9, target: 15 },
        quitados: { current: 2, target: 3 }
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Metas Diárias</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GoalCard
          title="Resolvidos"
          current={goals.resolvidos.current}
          target={goals.resolvidos.target}
          icon={CheckCircle}
          color="text-emerald-500"
          bgColor="bg-emerald-50"
        />
        
        <GoalCard
          title="Aprovados"
          current={goals.aprovados.current}
          target={goals.aprovados.target}
          icon={ThumbsUp}
          color="text-blue-500"
          bgColor="bg-blue-50"
        />
        
        <GoalCard
          title="Quitados"
          current={goals.quitados.current}
          target={goals.quitados.target}
          icon={Trophy}
          color="text-amber-500"
          bgColor="bg-amber-50"
        />
      </div>
    </div>
  );
};
