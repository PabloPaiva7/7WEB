
import { useState } from "react";
import { v4 } from "@/lib/utils";
import { Demanda, Usuario } from "@/types/chat.types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ClipboardList, PlusCircle, ArrowUpDown, Calendar, CheckCircle2 } from "lucide-react";

// Dados de exemplo
const usuariosMock: Usuario[] = [
  {
    id: "user1",
    nome: "Maria Silva",
    avatar: "https://i.pravatar.cc/150?u=maria"
  },
  {
    id: "user2",
    nome: "João Oliveira",
    avatar: "https://i.pravatar.cc/150?u=joao"
  },
  {
    id: "user3",
    nome: "Ana Santos",
    avatar: "https://i.pravatar.cc/150?u=ana"
  },
  {
    id: "user4",
    nome: "Carlos Pereira",
    avatar: "https://i.pravatar.cc/150?u=carlos"
  }
];

const demandasIniciais: Demanda[] = [
  {
    id: "d1",
    titulo: "Revisar relatório mensal",
    descricao: "É necessário revisar o relatório de desempenho mensal antes da reunião de quinta-feira.",
    prioridade: "alta",
    atribuido: usuariosMock[0],
    status: "pendente",
    dataCriacao: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: "d2",
    titulo: "Contatar cliente sobre proposta",
    descricao: "Entrar em contato com o cliente XYZ para discutir detalhes da proposta enviada na semana passada.",
    prioridade: "media",
    atribuido: usuariosMock[1],
    status: "em_progresso",
    dataCriacao: new Date(Date.now() - 432000000).toISOString()
  },
  {
    id: "d3",
    titulo: "Organizar documentação",
    descricao: "Organizar e categorizar a documentação dos últimos projetos para facilitar o acesso.",
    prioridade: "baixa",
    atribuido: usuariosMock[2],
    status: "concluida",
    dataCriacao: new Date(Date.now() - 864000000).toISOString(),
    dataConclusao: new Date(Date.now() - 172800000).toISOString()
  }
];

export function Demandas() {
  const [demandas, setDemandas] = useState<Demanda[]>(demandasIniciais);
  const [filtroStatus, setFiltroStatus] = useState<string>("todas");
  const [ordenacao, setOrdenacao] = useState<string>("data-desc");
  const [novaDemanda, setNovaDemanda] = useState<Partial<Demanda>>({
    titulo: "",
    descricao: "",
    prioridade: "media",
    status: "pendente"
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const demandasFiltradas = demandas
    .filter(demanda => filtroStatus === "todas" || demanda.status === filtroStatus)
    .sort((a, b) => {
      switch (ordenacao) {
        case "data-asc":
          return new Date(a.dataCriacao).getTime() - new Date(b.dataCriacao).getTime();
        case "data-desc":
          return new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime();
        case "prioridade":
          const ordemPrioridade = { alta: 0, media: 1, baixa: 2 };
          return ordemPrioridade[a.prioridade] - ordemPrioridade[b.prioridade];
        default:
          return 0;
      }
    });

  const handleAddDemanda = () => {
    if (!novaDemanda.titulo) return;
    
    const demanda: Demanda = {
      id: v4(),
      titulo: novaDemanda.titulo,
      descricao: novaDemanda.descricao || "",
      prioridade: novaDemanda.prioridade as "baixa" | "media" | "alta",
      status: novaDemanda.status as "pendente" | "em_progresso" | "concluida",
      atribuido: novaDemanda.atribuido,
      dataCriacao: new Date().toISOString()
    };
    
    setDemandas([...demandas, demanda]);
    
    // Resetar form
    setNovaDemanda({
      titulo: "",
      descricao: "",
      prioridade: "media",
      status: "pendente"
    });
    
    setDialogOpen(false);
  };

  const mudarStatusDemanda = (id: string, novoStatus: Demanda["status"]) => {
    setDemandas(demandas.map(demanda => {
      if (demanda.id === id) {
        const demandaAtualizada = { 
          ...demanda, 
          status: novoStatus 
        };
        
        if (novoStatus === "concluida") {
          demandaAtualizada.dataConclusao = new Date().toISOString();
        } else {
          delete demandaAtualizada.dataConclusao;
        }
        
        return demandaAtualizada;
      }
      return demanda;
    }));
  };

  const formatarData = (data: string) => {
    return format(new Date(data), "dd/MM/yyyy", { locale: ptBR });
  };

  const getCorPrioridade = (prioridade: Demanda["prioridade"]) => {
    switch (prioridade) {
      case "alta": return "destructive";
      case "media": return "warning";
      case "baixa": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas demandas</SelectItem>
              <SelectItem value="pendente">Pendentes</SelectItem>
              <SelectItem value="em_progresso">Em progresso</SelectItem>
              <SelectItem value="concluida">Concluídas</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={ordenacao} onValueChange={setOrdenacao}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="data-desc">Mais recentes</SelectItem>
              <SelectItem value="data-asc">Mais antigas</SelectItem>
              <SelectItem value="prioridade">Prioridade</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Demanda
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Demanda</DialogTitle>
              <DialogDescription>
                Adicione os detalhes da nova demanda que precisa ser atendida.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  value={novaDemanda.titulo}
                  onChange={(e) => setNovaDemanda({...novaDemanda, titulo: e.target.value})}
                  placeholder="Título da demanda"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={novaDemanda.descricao}
                  onChange={(e) => setNovaDemanda({...novaDemanda, descricao: e.target.value})}
                  placeholder="Descreva em detalhes o que precisa ser feito"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="prioridade">Prioridade</Label>
                <Select 
                  value={novaDemanda.prioridade} 
                  onValueChange={(value) => setNovaDemanda({...novaDemanda, prioridade: value as any})}
                >
                  <SelectTrigger id="prioridade">
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="atribuido">Atribuir para</Label>
                <Select 
                  value={novaDemanda.atribuido?.id} 
                  onValueChange={(value) => {
                    const usuario = usuariosMock.find(u => u.id === value);
                    setNovaDemanda({...novaDemanda, atribuido: usuario});
                  }}
                >
                  <SelectTrigger id="atribuido">
                    <SelectValue placeholder="Selecione uma pessoa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Não atribuído</SelectItem>
                    {usuariosMock.map(usuario => (
                      <SelectItem key={usuario.id} value={usuario.id}>
                        {usuario.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddDemanda}>Criar Demanda</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {demandasFiltradas.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {demandasFiltradas.map((demanda) => (
            <Card key={demanda.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{demanda.titulo}</CardTitle>
                  <Badge variant={getCorPrioridade(demanda.prioridade)}>
                    {demanda.prioridade === "alta" ? "Alta" : 
                     demanda.prioridade === "media" ? "Média" : "Baixa"}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Criada em {formatarData(demanda.dataCriacao)}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{demanda.descricao}</p>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-medium mb-1">Status</p>
                    <Badge variant={
                      demanda.status === "pendente" ? "outline" : 
                      demanda.status === "em_progresso" ? "secondary" : 
                      "success"
                    }>
                      {demanda.status === "pendente" ? "Pendente" : 
                       demanda.status === "em_progresso" ? "Em progresso" : 
                       "Concluída"}
                    </Badge>
                  </div>
                  
                  {demanda.atribuido && (
                    <div className="text-right">
                      <p className="text-xs font-medium mb-1">Atribuído a</p>
                      <p className="text-sm">{demanda.atribuido.nome}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="pt-1">
                <div className="w-full flex justify-end gap-2">
                  {demanda.status === "pendente" && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => mudarStatusDemanda(demanda.id, "em_progresso")}
                    >
                      Iniciar
                    </Button>
                  )}
                  
                  {demanda.status === "em_progresso" && (
                    <Button 
                      size="sm" 
                      onClick={() => mudarStatusDemanda(demanda.id, "concluida")}
                    >
                      Concluir
                    </Button>
                  )}
                  
                  {demanda.status === "concluida" && demanda.dataConclusao && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Concluída em {formatarData(demanda.dataConclusao)}
                    </div>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Nenhuma demanda encontrada</h3>
          <p className="text-muted-foreground mt-1">
            Não há demandas com os filtros selecionados.
          </p>
        </div>
      )}
    </div>
  );
}
