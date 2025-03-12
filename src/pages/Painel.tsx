
import { DemandaAlert } from "@/components/Documentos/DemandaAlert";
import { useState } from "react";
import { Demanda } from "@/types/demanda";
import { StatisticsSection } from "@/components/Painel/StatisticsSection";
import { ChartSection } from "@/components/Painel/ChartSection";
import { DemandasBoard } from "@/components/Painel/DemandasBoard";
import { useToast } from "@/hooks/use-toast";
import { DemandaDialog } from "@/components/Painel/DemandaDialog";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";

export default function Painel() {
  const [demandas, setDemandas] = useState<Demanda[]>([
    {
      id: '1',
      titulo: 'Contrato 12345 - Documentação adicional',
      descricao: 'Necessário envio de documentação adicional para o contrato 12345',
      status: 'pendente',
      prioridade: 'alta',
      criacao: new Date(2023, 5, 15),
      categoria: 'Contratos',
      responsavel: 'Ana Silva'
    },
    {
      id: '2',
      titulo: 'Cliente João Silva - Assinatura',
      descricao: 'Pendência de assinatura em contrato do cliente João Silva',
      status: 'em_andamento',
      prioridade: 'media',
      criacao: new Date(2023, 6, 20),
      inicioProcessamento: new Date(2023, 6, 21),
      categoria: 'Assinaturas',
      responsavel: 'Carlos Oliveira'
    },
    {
      id: '3',
      titulo: 'Processo 789/2023 - Recurso',
      descricao: 'Prazo de 5 dias para recurso no processo 789/2023',
      status: 'pendente',
      prioridade: 'alta',
      criacao: new Date(2023, 7, 1),
      categoria: 'Processos',
      responsavel: 'Pedro Santos'
    },
    {
      id: '4',
      titulo: 'Notificação extrajudicial - Maria Oliveira',
      descricao: 'Notificação extrajudicial para cliente Maria Oliveira',
      status: 'finalizado',
      prioridade: 'baixa',
      criacao: new Date(2023, 4, 10),
      inicioProcessamento: new Date(2023, 4, 11),
      conclusao: new Date(2023, 4, 15),
      tempoProcessamento: 4 * 24 * 60 * 60 * 1000, // 4 dias em ms
      categoria: 'Notificações',
      responsavel: 'Juliana Pereira'
    },
    {
      id: '5',
      titulo: 'Contrato 56789 - Reconhecimento de firma',
      descricao: 'Necessário reconhecimento de firma no contrato 56789',
      status: 'encaminhado',
      prioridade: 'media',
      criacao: new Date(2023, 7, 5),
      inicioProcessamento: new Date(2023, 7, 6),
      categoria: 'Cartório',
      responsavel: 'Rafael Costa'
    },
    {
      id: '6',
      titulo: 'Ação judicial 2022/456 - Audiência',
      descricao: 'Audiência marcada para ação judicial 2022/456',
      status: 'confirmado',
      prioridade: 'alta',
      criacao: new Date(2023, 8, 15),
      inicioProcessamento: new Date(2023, 8, 16),
      categoria: 'Audiências',
      responsavel: 'Mariana Lima'
    },
  ]);

  const [selectedDemanda, setSelectedDemanda] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDemanda, setCurrentDemanda] = useState<Partial<Demanda>>({});
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const filteredDemandas = demandas.filter(demanda => 
    demanda.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demanda.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (demanda.categoria && demanda.categoria.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (demanda.responsavel && demanda.responsavel.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  const handleChangeDemandaStatus = (id: string, status: Demanda['status']) => {
    setDemandas(prevDemandas => 
      prevDemandas.map(d => {
        if (d.id === id) {
          let updates: Partial<Demanda> = { status };
          
          // Se estamos iniciando o processamento
          if ((status === 'em_andamento' || status === 'encaminhado') && !d.inicioProcessamento) {
            updates.inicioProcessamento = new Date();
          }
          
          // Se estamos finalizando
          if ((status === 'finalizado' || status === 'concluida') && d.inicioProcessamento && !d.conclusao) {
            const conclusao = new Date();
            updates.conclusao = conclusao;
            updates.tempoProcessamento = conclusao.getTime() - d.inicioProcessamento.getTime();
          }
          
          return { ...d, ...updates };
        }
        return d;
      })
    );
    toast({
      title: "Status atualizado",
      description: `O status da demanda foi atualizado para ${status}.`,
    });
  };

  const handleAddDemanda = () => {
    setCurrentDemanda({
      prioridade: 'media',
      status: 'pendente',
      criacao: new Date()
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditDemanda = (demanda: Demanda) => {
    setCurrentDemanda(demanda);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteDemanda = (id: string) => {
    setDemandas(prevDemandas => prevDemandas.filter(d => d.id !== id));
    toast({
      title: "Demanda removida",
      description: `A demanda foi removida com sucesso.`,
      variant: "default",
    });
  };

  const handleSaveDemanda = () => {
    if (!currentDemanda.titulo || !currentDemanda.descricao) {
      toast({
        title: "Erro ao salvar",
        description: "Título e descrição são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (isEditing) {
      // Editing existing demanda
      setDemandas(prevDemandas => 
        prevDemandas.map(d => 
          d.id === currentDemanda.id ? { ...d, ...currentDemanda as Demanda } : d
        )
      );
      toast({
        title: "Demanda atualizada",
        description: `A demanda "${currentDemanda.titulo}" foi atualizada com sucesso.`,
      });
    } else {
      // Adding new demanda
      const newDemanda: Demanda = {
        ...currentDemanda as Demanda,
        id: uuidv4(),
        criacao: new Date()
      };
      setDemandas(prevDemandas => [...prevDemandas, newDemanda]);
      toast({
        title: "Demanda criada",
        description: `A demanda "${newDemanda.titulo}" foi criada com sucesso.`,
      });
    }
    
    setIsDialogOpen(false);
    setCurrentDemanda({});
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
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Demandas</h2>
          <div className="flex gap-2 items-center">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar demandas..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleAddDemanda}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Demanda
            </Button>
          </div>
        </div>
        
        <DemandasBoard 
          demandas={filteredDemandas} 
          setDemandas={setDemandas}
          onSelectDemanda={handleDemandaSelect}
          onChangeDemandaStatus={handleChangeDemandaStatus}
          onEditDemanda={handleEditDemanda}
          onDeleteDemanda={handleDeleteDemanda}
          onAddDemanda={handleAddDemanda}
        />
      </div>

      <DemandaDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        demanda={currentDemanda}
        setDemanda={setCurrentDemanda}
        onSave={handleSaveDemanda}
        title={isEditing ? "Editar Demanda" : "Nova Demanda"}
        actionText={isEditing ? "Atualizar" : "Criar"}
      />
    </div>
  );
}
