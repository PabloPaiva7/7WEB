
import { DemandaAlert } from "@/components/Documentos/DemandaAlert";
import { useState } from "react";
import { Demanda } from "@/types/demanda";
import { StatisticsSection } from "@/components/Painel/StatisticsSection";
import { ChartSection } from "@/components/Painel/ChartSection";
import { DemandasBoard } from "@/components/Painel/DemandasBoard";
import { useToast } from "@/hooks/use-toast";

export default function Painel() {
  const [demandas, setDemandas] = useState<Demanda[]>([
    {
      id: '1',
      titulo: 'Contrato 12345 - Documentação adicional',
      descricao: 'Necessário envio de documentação adicional para o contrato 12345',
      status: 'pendente',
      prioridade: 'alta',
      criacao: new Date(2023, 5, 15)
    },
    {
      id: '2',
      titulo: 'Cliente João Silva - Assinatura',
      descricao: 'Pendência de assinatura em contrato do cliente João Silva',
      status: 'em_andamento',
      prioridade: 'media',
      criacao: new Date(2023, 6, 20)
    },
    {
      id: '3',
      titulo: 'Processo 789/2023 - Recurso',
      descricao: 'Prazo de 5 dias para recurso no processo 789/2023',
      status: 'pendente',
      prioridade: 'alta',
      criacao: new Date(2023, 7, 1)
    },
    {
      id: '4',
      titulo: 'Notificação extrajudicial - Maria Oliveira',
      descricao: 'Notificação extrajudicial para cliente Maria Oliveira',
      status: 'concluida',
      prioridade: 'baixa',
      criacao: new Date(2023, 4, 10)
    },
    {
      id: '5',
      titulo: 'Contrato 56789 - Reconhecimento de firma',
      descricao: 'Necessário reconhecimento de firma no contrato 56789',
      status: 'em_andamento',
      prioridade: 'media',
      criacao: new Date(2023, 7, 5)
    },
    {
      id: '6',
      titulo: 'Ação judicial 2022/456 - Audiência',
      descricao: 'Audiência marcada para ação judicial 2022/456',
      status: 'pendente',
      prioridade: 'alta',
      criacao: new Date(2023, 8, 15)
    },
  ]);

  const [selectedDemanda, setSelectedDemanda] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDemandaSelect = (demandaId: string) => {
    const demanda = demandas.find(d => d.id === demandaId);
    if (demanda) {
      setSelectedDemanda(demanda.titulo);
      toast({
        title: "Demanda Selecionada",
        description: `A demanda "${demanda.titulo}" foi selecionada e precisa de atenção.`,
        variant: "destructive",
      });
    }
  };

  const handleResolveDemanda = () => {
    setSelectedDemanda(null);
    toast({
      title: "Demanda resolvida",
      description: `A demanda foi marcada como resolvida.`,
    });
  };

  const handleChangeDemandaStatus = (id: string, status: 'pendente' | 'em_andamento' | 'concluida') => {
    setDemandas(prevDemandas => 
      prevDemandas.map(d => 
        d.id === id ? { ...d, status } : d
      )
    );
    toast({
      title: "Status atualizado",
      description: `O status da demanda foi atualizado.`,
    });
  };

  const handleEditDemanda = (demanda: Demanda) => {
    toast({
      title: "Editar demanda",
      description: `A demanda "${demanda.titulo}" será editada.`,
    });
  };

  const handleDeleteDemanda = (id: string) => {
    setDemandas(prevDemandas => prevDemandas.filter(d => d.id !== id));
    toast({
      title: "Demanda removida",
      description: `A demanda foi removida com sucesso.`,
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {selectedDemanda && (
        <DemandaAlert 
          demanda={selectedDemanda} 
          onResolve={handleResolveDemanda} 
        />
      )}
      
      <StatisticsSection />
      
      <ChartSection />
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Demandas</h2>
        <DemandasBoard 
          demandas={demandas} 
          setDemandas={setDemandas}
          onSelectDemanda={handleDemandaSelect}
        />
      </div>
    </div>
  );
}
