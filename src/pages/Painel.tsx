
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { AlertTriangle, CheckCircle2, Clock, DollarSign, FileText, Flag, Inbox, List, Pencil, Plus, Trash, Users } from "lucide-react";
import { DemandaAlert } from "@/components/Documentos/DemandaAlert";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PermissionAlert } from "@/components/Documentos/PermissionAlert";

// Dados de exemplo
const data = [
  { name: 'Jan', valor: 4000 },
  { name: 'Fev', valor: 3000 },
  { name: 'Mar', valor: 2000 },
  { name: 'Abr', valor: 2780 },
  { name: 'Mai', valor: 1890 },
  { name: 'Jun', valor: 2390 },
];

const pieData = [
  { name: 'Contrato', value: 400 },
  { name: 'Processo', value: 300 },
  { name: 'Audiência', value: 300 },
  { name: 'Documento', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

type Demanda = {
  id: string;
  titulo: string;
  descricao: string;
  status: 'pendente' | 'em_andamento' | 'concluida';
  prioridade: 'baixa' | 'media' | 'alta';
  criacao: Date;
};

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
  const [demandaAtual, setDemandaAtual] = useState<Demanda | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [novaDemanda, setNovaDemanda] = useState<Partial<Demanda>>({
    titulo: '',
    descricao: '',
    status: 'pendente',
    prioridade: 'media',
  });
  const { toast } = useToast();

  const demandasPendentes = demandas.filter(d => d.status === 'pendente');
  const demandasEmAndamento = demandas.filter(d => d.status === 'em_andamento');
  const demandasConcluidas = demandas.filter(d => d.status === 'concluida');

  const estatisticas = {
    total: demandas.length,
    pendentes: demandasPendentes.length,
    emAndamento: demandasEmAndamento.length,
    concluidas: demandasConcluidas.length,
    prioridadeAlta: demandas.filter(d => d.prioridade === 'alta').length,
  };

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

  const handleStatusChange = (demandaId: string, novoStatus: 'pendente' | 'em_andamento' | 'concluida') => {
    setDemandas(demandas.map(d => 
      d.id === demandaId ? { ...d, status: novoStatus } : d
    ));
    
    toast({
      title: "Status atualizado",
      description: `Status da demanda atualizado para ${novoStatus.replace('_', ' ')}`,
    });
  };

  const handleAddDemanda = () => {
    if (novaDemanda.titulo && novaDemanda.descricao) {
      const newDemanda: Demanda = {
        id: Math.random().toString(36).substring(2, 9),
        titulo: novaDemanda.titulo,
        descricao: novaDemanda.descricao,
        status: novaDemanda.status as 'pendente' | 'em_andamento' | 'concluida',
        prioridade: novaDemanda.prioridade as 'baixa' | 'media' | 'alta',
        criacao: new Date(),
      };
      
      setDemandas([...demandas, newDemanda]);
      setIsAddDialogOpen(false);
      setNovaDemanda({
        titulo: '',
        descricao: '',
        status: 'pendente',
        prioridade: 'media',
      });
      
      toast({
        title: "Demanda adicionada",
        description: "Nova demanda adicionada com sucesso.",
      });
    }
  };

  const handleEditDemanda = () => {
    if (demandaAtual && demandaAtual.titulo && demandaAtual.descricao) {
      setDemandas(demandas.map(d => 
        d.id === demandaAtual.id ? demandaAtual : d
      ));
      
      setIsEditDialogOpen(false);
      setDemandaAtual(null);
      
      toast({
        title: "Demanda atualizada",
        description: "Demanda atualizada com sucesso.",
      });
    }
  };

  const handleDeleteDemanda = (demandaId: string) => {
    setDemandas(demandas.filter(d => d.id !== demandaId));
    
    toast({
      title: "Demanda removida",
      description: "Demanda removida com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      {selectedDemanda && (
        <DemandaAlert 
          demanda={selectedDemanda} 
          onResolve={handleResolveDemanda} 
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total de Demandas</p>
              <p className="text-2xl font-bold">{estatisticas.total}</p>
            </div>
            <div className="p-3 rounded-full bg-white">
              <List className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pendentes</p>
              <p className="text-2xl font-bold">{estatisticas.pendentes}</p>
            </div>
            <div className="p-3 rounded-full bg-white">
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Em Andamento</p>
              <p className="text-2xl font-bold">{estatisticas.emAndamento}</p>
            </div>
            <div className="p-3 rounded-full bg-white">
              <Inbox className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Concluídas</p>
              <p className="text-2xl font-bold">{estatisticas.concluidas}</p>
            </div>
            <div className="p-3 rounded-full bg-white">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Demandas</CardTitle>
            <CardDescription>Número de demandas nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="valor" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tipos de Demandas</CardTitle>
            <CardDescription>Distribuição por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Fluxo de Demandas</CardTitle>
            <CardDescription>Gerencie e acompanhe as demandas pendentes</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Nova Demanda
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Demanda</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    value={novaDemanda.titulo || ""}
                    onChange={(e) => setNovaDemanda({...novaDemanda, titulo: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    value={novaDemanda.descricao || ""}
                    onChange={(e) => setNovaDemanda({...novaDemanda, descricao: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Select
                    value={novaDemanda.prioridade}
                    onValueChange={(value) => setNovaDemanda({...novaDemanda, prioridade: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={novaDemanda.status}
                    onValueChange={(value) => setNovaDemanda({...novaDemanda, status: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="em_andamento">Em andamento</SelectItem>
                      <SelectItem value="concluida">Concluída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddDemanda}>Adicionar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-amber-50 border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                  Pendentes ({demandasPendentes.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {demandasPendentes.map((demanda) => (
                  <Card key={demanda.id} className="p-3 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        {demanda.prioridade === 'alta' && (
                          <Flag className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                        )}
                        <div>
                          <h3 className="text-sm font-medium line-clamp-1">{demanda.titulo}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{demanda.descricao}</p>
                        </div>
                      </div>
                      <div className="flex flex-shrink-0 gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={() => handleDemandaSelect(demanda.id)}
                        >
                          <AlertTriangle className="h-3 w-3 text-amber-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={() => handleStatusChange(demanda.id, 'em_andamento')}
                        >
                          <Inbox className="h-3 w-3 text-purple-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={() => {
                            setDemandaAtual(demanda);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={() => handleDeleteDemanda(demanda.id)}
                        >
                          <Trash className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                {demandasPendentes.length === 0 && (
                  <p className="text-sm text-center py-4 text-muted-foreground">
                    Nenhuma demanda pendente
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Inbox className="h-5 w-5 text-purple-500" />
                  Em Andamento ({demandasEmAndamento.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {demandasEmAndamento.map((demanda) => (
                  <Card key={demanda.id} className="p-3 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        {demanda.prioridade === 'alta' && (
                          <Flag className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                        )}
                        <div>
                          <h3 className="text-sm font-medium line-clamp-1">{demanda.titulo}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{demanda.descricao}</p>
                        </div>
                      </div>
                      <div className="flex flex-shrink-0 gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={() => handleStatusChange(demanda.id, 'pendente')}
                        >
                          <Clock className="h-3 w-3 text-amber-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={() => handleStatusChange(demanda.id, 'concluida')}
                        >
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={() => {
                            setDemandaAtual(demanda);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={() => handleDeleteDemanda(demanda.id)}
                        >
                          <Trash className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                {demandasEmAndamento.length === 0 && (
                  <p className="text-sm text-center py-4 text-muted-foreground">
                    Nenhuma demanda em andamento
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Concluídas ({demandasConcluidas.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {demandasConcluidas.map((demanda) => (
                  <Card key={demanda.id} className="p-3 bg-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-medium line-clamp-1">{demanda.titulo}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{demanda.descricao}</p>
                      </div>
                      <div className="flex flex-shrink-0 gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={() => handleStatusChange(demanda.id, 'em_andamento')}
                        >
                          <Inbox className="h-3 w-3 text-purple-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={() => handleDeleteDemanda(demanda.id)}
                        >
                          <Trash className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                {demandasConcluidas.length === 0 && (
                  <p className="text-sm text-center py-4 text-muted-foreground">
                    Nenhuma demanda concluída
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Demanda</DialogTitle>
          </DialogHeader>
          {demandaAtual && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-titulo">Título</Label>
                <Input
                  id="edit-titulo"
                  value={demandaAtual.titulo}
                  onChange={(e) => setDemandaAtual({...demandaAtual, titulo: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-descricao">Descrição</Label>
                <Input
                  id="edit-descricao"
                  value={demandaAtual.descricao}
                  onChange={(e) => setDemandaAtual({...demandaAtual, descricao: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-prioridade">Prioridade</Label>
                <Select
                  value={demandaAtual.prioridade}
                  onValueChange={(value) => setDemandaAtual({...demandaAtual, prioridade: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={demandaAtual.status}
                  onValueChange={(value) => setDemandaAtual({...demandaAtual, status: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_andamento">Em andamento</SelectItem>
                    <SelectItem value="concluida">Concluída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditDemanda}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
