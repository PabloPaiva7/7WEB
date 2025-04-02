
import { GoalCard } from "./GoalCard";
import { CheckCircle, ThumbsUp, Trophy, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card className="p-4 border-t-4 border-t-amber-400/50">
      <CardHeader className="px-2">
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-[#D9B300] flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Metas e Objetivos
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-8">
          {/* Daily Goals Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                Metas Diárias
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <GoalCard
                title="Processos Resolvidos"
                current={dailyGoals.resolvidos.current}
                target={dailyGoals.resolvidos.target}
                icon={CheckCircle}
                color="text-emerald-500"
                bgColor="bg-emerald-100"
              />
              
              <GoalCard
                title="Contratos Aprovados"
                current={dailyGoals.aprovados.current}
                target={dailyGoals.aprovados.target}
                icon={ThumbsUp}
                color="text-blue-500"
                bgColor="bg-blue-100"
              />
              
              <GoalCard
                title="Financiamentos Quitados"
                current={dailyGoals.quitados.current}
                target={dailyGoals.quitados.target}
                icon={Trophy}
                color="text-amber-500"
                bgColor="bg-amber-100"
              />
            </div>
          </div>
          
          {/* Monthly Goals Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-500" />
                Metas Mensais
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <GoalCard
                title="Processos Resolvidos"
                current={monthlyGoals.resolvidos.current}
                target={monthlyGoals.resolvidos.target}
                icon={CheckCircle}
                color="text-emerald-500"
                bgColor="bg-emerald-100"
              />
              
              <GoalCard
                title="Contratos Aprovados"
                current={monthlyGoals.aprovados.current}
                target={monthlyGoals.aprovados.target}
                icon={ThumbsUp}
                color="text-blue-500"
                bgColor="bg-blue-100"
              />
              
              <GoalCard
                title="Financiamentos Quitados"
                current={monthlyGoals.quitados.current}
                target={monthlyGoals.quitados.target}
                icon={Trophy}
                color="text-amber-500"
                bgColor="bg-amber-100"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
