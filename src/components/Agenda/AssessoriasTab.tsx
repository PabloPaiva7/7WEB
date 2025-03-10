
import { useState, useEffect } from "react";
import { 
  Search, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Pencil,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { assessoriasExemplo } from "@/data/agendaData";
import { verificarDisponibilidade, formatarHorarioFuncionamento } from "@/utils/agendaUtils";
import { Assessoria } from "@/types/agenda.types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface AssessoriasTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

// Schema de validação para assessoria
const assessoriaSchema = z.object({
  nome: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
  contato: z.string().min(3, { message: "Nome do contato deve ter no mínimo 3 caracteres" }),
  telefone: z.string().min(8, { message: "Telefone deve ter no mínimo 8 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  endereco: z.string().min(5, { message: "Endereço deve ter no mínimo 5 caracteres" }),
  horarioFuncionamento: z.object({
    inicio: z.string(),
    fim: z.string()
  })
});

const AssessoriasTab = ({ searchTerm, setSearchTerm }: AssessoriasTabProps) => {
  const { toast } = useToast();
  const [assessorias, setAssessorias] = useState<Assessoria[]>(assessoriasExemplo);
  const [disponibilidadeAssessorias, setDisponibilidadeAssessorias] = useState<Record<string, boolean>>({});
  const [assessoriaParaEditar, setAssessoriaParaEditar] = useState<Assessoria | null>(null);
  const [assessoriaParaExcluir, setAssessoriaParaExcluir] = useState<Assessoria | null>(null);
  const [openNovaAssessoria, setOpenNovaAssessoria] = useState(false);
  const [openEditarAssessoria, setOpenEditarAssessoria] = useState(false);
  const [openExcluirAssessoria, setOpenExcluirAssessoria] = useState(false);

  // Efeito para verificar a disponibilidade das assessorias
  useEffect(() => {
    const checkDisponibilidade = () => {
      const disponibilidade: Record<string, boolean> = {};
      
      assessorias.forEach(assessoria => {
        disponibilidade[assessoria.id] = verificarDisponibilidade(assessoria.horarioFuncionamento);
      });
      
      setDisponibilidadeAssessorias(disponibilidade);
    };
    
    // Verifica a disponibilidade inicialmente
    checkDisponibilidade();
    
    // Configura um intervalo para verificar a disponibilidade a cada minuto
    const intervalId = setInterval(checkDisponibilidade, 60000);
    
    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  }, [assessorias]);

  // Filtrar assessorias
  const assessoriasFiltradas = assessorias.filter(assessoria => {
    return (
      assessoria.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessoria.contato.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessoria.telefone.includes(searchTerm) ||
      assessoria.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessoria.endereco.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Função para adicionar nova assessoria
  const adicionarAssessoria = (dados: z.infer<typeof assessoriaSchema>) => {
    const novaAssessoria: Assessoria = {
      id: `assessoria-${Date.now()}`,
      ...dados
    };
    
    setAssessorias([...assessorias, novaAssessoria]);
    setOpenNovaAssessoria(false);
    
    toast({
      title: "Assessoria adicionada",
      description: `A assessoria ${novaAssessoria.nome} foi adicionada com sucesso!`,
    });
  };

  // Função para atualizar assessoria existente
  const atualizarAssessoria = (dados: z.infer<typeof assessoriaSchema>) => {
    if (!assessoriaParaEditar) return;
    
    const assessoriasAtualizadas = assessorias.map(assessoria => 
      assessoria.id === assessoriaParaEditar.id ? { ...assessoria, ...dados } : assessoria
    );
    
    setAssessorias(assessoriasAtualizadas);
    setOpenEditarAssessoria(false);
    setAssessoriaParaEditar(null);
    
    toast({
      title: "Assessoria atualizada",
      description: `A assessoria ${dados.nome} foi atualizada com sucesso!`,
    });
  };

  // Função para excluir assessoria
  const excluirAssessoria = () => {
    if (!assessoriaParaExcluir) return;
    
    const assessoriasAtualizadas = assessorias.filter(
      assessoria => assessoria.id !== assessoriaParaExcluir.id
    );
    
    setAssessorias(assessoriasAtualizadas);
    setOpenExcluirAssessoria(false);
    
    toast({
      title: "Assessoria excluída",
      description: `A assessoria ${assessoriaParaExcluir.nome} foi excluída com sucesso!`,
      variant: "destructive",
    });
    
    setAssessoriaParaExcluir(null);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-medium">Assessorias</CardTitle>
            <CardDescription>Contatos de assessorias parceiras</CardDescription>
          </div>
          <Dialog open={openNovaAssessoria} onOpenChange={setOpenNovaAssessoria}>
            <DialogTrigger asChild>
              <Button size="sm" className="ml-auto">
                <Plus className="h-4 w-4 mr-2" />
                Nova Assessoria
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Assessoria</DialogTitle>
                <DialogDescription>
                  Preencha os dados da nova assessoria abaixo.
                </DialogDescription>
              </DialogHeader>
              <FormularioAssessoria onSubmit={adicionarAssessoria} onCancel={() => setOpenNovaAssessoria(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar assessoria por nome, contato..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assessoriasFiltradas.length === 0 ? (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              Nenhuma assessoria encontrada com os filtros selecionados.
            </div>
          ) : (
            assessoriasFiltradas.map((assessoria) => (
              <Card key={assessoria.id}>
                <CardHeader className="pb-2 relative">
                  {/* Ícone de disponibilidade no canto superior esquerdo */}
                  <div className="absolute top-3 left-3">
                    <StatusIcon disponivel={disponibilidadeAssessorias[assessoria.id] || false} />
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <div className="w-8"></div> {/* Espaço para o ícone de status */}
                    <StatusIndicator disponivel={disponibilidadeAssessorias[assessoria.id] || false} />
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setAssessoriaParaEditar(assessoria);
                          setOpenEditarAssessoria(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setAssessoriaParaExcluir(assessoria);
                          setOpenExcluirAssessoria(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-2">{assessoria.nome}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <User className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{assessoria.contato}</span>
                    </div>

                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{assessoria.telefone}</span>
                    </div>

                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{assessoria.email}</span>
                    </div>

                    <div className="flex items-start text-sm">
                      <MapPin className="w-4 h-4 mr-2 mt-1 text-muted-foreground" />
                      <span>{assessoria.endereco}</span>
                    </div>

                    <div className="flex items-start text-sm">
                      <Clock className="w-4 h-4 mr-2 mt-1 text-muted-foreground" />
                      <span>{formatarHorarioFuncionamento(assessoria.horarioFuncionamento)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>

      {/* Diálogo para editar assessoria */}
      <Dialog open={openEditarAssessoria} onOpenChange={setOpenEditarAssessoria}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Assessoria</DialogTitle>
            <DialogDescription>
              Atualize os dados da assessoria abaixo.
            </DialogDescription>
          </DialogHeader>
          {assessoriaParaEditar && (
            <FormularioAssessoria 
              assessoria={assessoriaParaEditar} 
              onSubmit={atualizarAssessoria} 
              onCancel={() => {
                setOpenEditarAssessoria(false);
                setAssessoriaParaEditar(null);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmar exclusão */}
      <Dialog open={openExcluirAssessoria} onOpenChange={setOpenExcluirAssessoria}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta assessoria? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setOpenExcluirAssessoria(false);
                setAssessoriaParaExcluir(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={excluirAssessoria}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// Componente para ícone de status no canto superior esquerdo
const StatusIcon = ({ disponivel }: { disponivel: boolean }) => {
  return disponivel ? (
    <CheckCircle className="w-5 h-5 text-green-600" />
  ) : (
    <XCircle className="w-5 h-5 text-red-600" />
  );
};

// Componente para indicador de status de disponibilidade
const StatusIndicator = ({ disponivel }: { disponivel: boolean }) => {
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
      disponivel ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }`}>
      {disponivel ? (
        <>
          <CheckCircle className="w-3 h-3" />
          <span>Disponível</span>
        </>
      ) : (
        <>
          <XCircle className="w-3 h-3" />
          <span>Indisponível</span>
        </>
      )}
    </div>
  );
};

// Componente de formulário para criação e edição de assessorias
const FormularioAssessoria = ({ 
  assessoria, 
  onSubmit, 
  onCancel 
}: { 
  assessoria?: Assessoria; 
  onSubmit: (dados: z.infer<typeof assessoriaSchema>) => void;
  onCancel: () => void;
}) => {
  const form = useForm<z.infer<typeof assessoriaSchema>>({
    resolver: zodResolver(assessoriaSchema),
    defaultValues: assessoria ? {
      nome: assessoria.nome,
      contato: assessoria.contato,
      telefone: assessoria.telefone,
      email: assessoria.email,
      endereco: assessoria.endereco,
      horarioFuncionamento: {
        inicio: assessoria.horarioFuncionamento.inicio,
        fim: assessoria.horarioFuncionamento.fim
      }
    } : {
      nome: "",
      contato: "",
      telefone: "",
      email: "",
      endereco: "",
      horarioFuncionamento: {
        inicio: "08:00",
        fim: "18:00"
      }
    }
  });

  function handleSubmit(valores: z.infer<typeof assessoriaSchema>) {
    onSubmit(valores);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Assessoria</FormLabel>
              <FormControl>
                <Input placeholder="Nome da assessoria" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="contato"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Contato</FormLabel>
              <FormControl>
                <Input placeholder="Nome do contato principal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="telefone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="(00) 00000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@exemplo.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="endereco"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Endereço completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="horarioFuncionamento.inicio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário de Início</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="horarioFuncionamento.fim"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário de Término</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="sm:justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {assessoria ? "Salvar alterações" : "Adicionar assessoria"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AssessoriasTab;
