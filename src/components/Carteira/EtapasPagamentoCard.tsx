
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  CalendarCheck, 
  BarChart, 
  DollarSign, 
  UserCheck, 
  Calendar
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { EtapaPagamento } from "@/types/agenda.types";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Separator } from "@/components/ui/separator";

interface EtapasPagamentoCardProps {
  clienteId: string;
}

const tiposEtapas = [
  { id: "data_atendimento", nome: "Data de Atendimento", icon: CalendarCheck },
  { id: "campanha", nome: "Campanha", icon: BarChart },
  { id: "valor_cliente", nome: "Valor do Cliente", icon: DollarSign },
  { id: "atendimento", nome: "Atendimento", icon: UserCheck },
  { id: "dia_retorno", nome: "Dia do Retorno", icon: Calendar },
];

export const EtapasPagamentoCard = ({ clienteId }: EtapasPagamentoCardProps) => {
  const { toast } = useToast();
  const [etapas, setEtapas] = useState<EtapaPagamento[]>(() => {
    try {
      const salvo = localStorage.getItem(`etapas-pagamento-${clienteId}`);
      if (salvo) {
        return JSON.parse(salvo);
      } else {
        // Criar etapas predefinidas se não houver dados salvos
        const etapasPredefinidas = tiposEtapas.map(tipo => ({
          id: uuidv4(),
          nome: tipo.nome,
          descricao: `Etapa de ${tipo.nome.toLowerCase()}`,
          concluido: false,
          porcentagemConcluida: 0,
          clienteId: clienteId,
          dataInicio: new Date().toISOString(),
          dataConclusao: undefined
        }));
        
        // Salvar as etapas predefinidas no localStorage
        localStorage.setItem(`etapas-pagamento-${clienteId}`, JSON.stringify(etapasPredefinidas));
        return etapasPredefinidas;
      }
    } catch (error) {
      console.error("Erro ao carregar etapas:", error);
      return [];
    }
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [etapaEditando, setEtapaEditando] = useState<EtapaPagamento | null>(null);
  
  const form = useForm<EtapaPagamento>({
    defaultValues: {
      id: "",
      nome: "",
      descricao: "",
      concluido: false,
      porcentagemConcluida: 0,
      clienteId: clienteId
    }
  });
  
  const salvarEtapas = (novasEtapas: EtapaPagamento[]) => {
    try {
      localStorage.setItem(`etapas-pagamento-${clienteId}`, JSON.stringify(novasEtapas));
      setEtapas(novasEtapas);
    } catch (error) {
      console.error("Erro ao salvar etapas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as etapas.",
        variant: "destructive"
      });
    }
  };
  
  const abrirDialog = (etapa?: EtapaPagamento) => {
    if (etapa) {
      setEtapaEditando(etapa);
      form.reset(etapa);
    } else {
      setEtapaEditando(null);
      form.reset({
        id: uuidv4(),
        nome: "",
        descricao: "",
        concluido: false,
        porcentagemConcluida: 0,
        clienteId: clienteId,
      });
    }
    setIsDialogOpen(true);
  };
  
  const fecharDialog = () => {
    setIsDialogOpen(false);
    setEtapaEditando(null);
    form.reset();
  };
  
  const onSubmit = (data: EtapaPagamento) => {
    const novaEtapa = {
      ...data,
      dataInicio: data.dataInicio || new Date().toISOString(),
      dataConclusao: data.concluido ? (data.dataConclusao || new Date().toISOString()) : undefined,
    };
    
    let novasEtapas: EtapaPagamento[];
    
    if (etapaEditando) {
      novasEtapas = etapas.map(etapa => 
        etapa.id === etapaEditando.id ? novaEtapa : etapa
      );
      toast({
        title: "Etapa atualizada",
        description: "A etapa foi atualizada com sucesso."
      });
    } else {
      novasEtapas = [...etapas, novaEtapa];
      toast({
        title: "Etapa adicionada",
        description: "Nova etapa adicionada com sucesso."
      });
    }
    
    salvarEtapas(novasEtapas);
    fecharDialog();
  };
  
  const excluirEtapa = (id: string) => {
    const novasEtapas = etapas.filter(etapa => etapa.id !== id);
    salvarEtapas(novasEtapas);
    toast({
      title: "Etapa removida",
      description: "A etapa foi removida com sucesso."
    });
  };
  
  const atualizarProgresso = (id: string, progresso: number) => {
    const novasEtapas = etapas.map(etapa => {
      if (etapa.id === id) {
        const concluido = progresso === 100;
        return {
          ...etapa,
          porcentagemConcluida: progresso,
          concluido,
          dataConclusao: concluido ? new Date().toISOString() : etapa.dataConclusao
        };
      }
      return etapa;
    });
    
    salvarEtapas(novasEtapas);
    
    if (progresso === 100) {
      toast({
        title: "Etapa concluída",
        description: "A etapa foi marcada como concluída."
      });
    }
  };
  
  // Encontrar ícone para cada etapa com base no nome
  const getIconForEtapa = (nome: string) => {
    const tipoEtapa = tiposEtapas.find(tipo => 
      nome.toLowerCase().includes(tipo.id.replace("_", "")) || 
      nome.toLowerCase().includes(tipo.nome.toLowerCase())
    );
    
    return tipoEtapa?.icon || CalendarCheck;
  };
  
  const getProgressoTotal = () => {
    if (etapas.length === 0) return 0;
    const soma = etapas.reduce((acc, etapa) => acc + etapa.porcentagemConcluida, 0);
    return Math.round(soma / etapas.length);
  };
  
  const adicionarEtapasPadrao = () => {
    const etapasPredefinidas = tiposEtapas.map(tipo => ({
      id: uuidv4(),
      nome: tipo.nome,
      descricao: `Etapa de ${tipo.nome.toLowerCase()}`,
      concluido: false,
      porcentagemConcluida: 0,
      clienteId: clienteId,
      dataInicio: new Date().toISOString(),
      dataConclusao: undefined
    }));
    
    salvarEtapas(etapasPredefinidas);
    toast({
      title: "Etapas restauradas",
      description: "As etapas padrão foram restauradas com sucesso."
    });
  };
  
  return (
    <>
      <Card className="mt-4">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Etapas de Pagamento</CardTitle>
          <div className="flex gap-2">
            {etapas.length === 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={adicionarEtapasPadrao}
                className="w-auto"
              >
                <CalendarCheck className="h-4 w-4 mr-2" />
                Restaurar Etapas Padrão
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => abrirDialog()}
              className="w-auto"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Etapa
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {etapas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma etapa cadastrada</p>
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={adicionarEtapasPadrao}
                >
                  <CalendarCheck className="h-4 w-4 mr-2" />
                  Adicionar Etapas Padrão
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => abrirDialog()}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Adicionar Etapa Personalizada
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <Label>Progresso Total</Label>
                  <span className="font-medium">{getProgressoTotal()}%</span>
                </div>
                <Progress value={getProgressoTotal()} className="h-2" />
              </div>
              
              {etapas.map(etapa => {
                const EtapaIcon = getIconForEtapa(etapa.nome);
                
                return (
                  <div key={etapa.id} className="border rounded-md p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <EtapaIcon className="h-5 w-5 mr-2 text-primary" />
                        <div>
                          <h4 className="font-medium">{etapa.nome}</h4>
                          {etapa.descricao && (
                            <p className="text-sm text-muted-foreground">{etapa.descricao}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => abrirDialog(etapa)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => excluirEtapa(etapa.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-muted-foreground">
                          {etapa.concluido ? 'Concluído' : 'Em andamento'}
                        </span>
                        <span className="text-sm font-medium">{etapa.porcentagemConcluida}%</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Slider 
                            defaultValue={[etapa.porcentagemConcluida]} 
                            max={100} 
                            step={10}
                            onValueChange={(values) => atualizarProgresso(etapa.id, values[0])}
                          />
                        </div>
                      </div>
                      
                      {(etapa.dataInicio || etapa.dataConclusao) && (
                        <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                          {etapa.dataInicio && (
                            <span>
                              Início: {new Date(etapa.dataInicio).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                          {etapa.dataConclusao && (
                            <span>
                              Conclusão: {new Date(etapa.dataConclusao).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {etapas.length > 0 && (
                <div className="pt-4">
                  <Separator className="my-4" />
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={adicionarEtapasPadrao}
                      className="w-auto"
                    >
                      <CalendarCheck className="h-4 w-4 mr-2" />
                      Restaurar Etapas Padrão
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {etapaEditando ? 'Editar Etapa' : 'Nova Etapa'}
            </DialogTitle>
            <DialogDescription>
              {etapaEditando 
                ? 'Atualize os detalhes da etapa de pagamento.' 
                : 'Adicione uma nova etapa ao processo de pagamento.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Etapa</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Data de Atendimento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Descreva a etapa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="porcentagemConcluida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Porcentagem Concluída ({field.value}%)</FormLabel>
                    <FormControl>
                      <Slider 
                        defaultValue={[field.value]} 
                        max={100} 
                        step={10}
                        onValueChange={(values) => field.onChange(values[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={fecharDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {etapaEditando ? 'Salvar Alterações' : 'Adicionar Etapa'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
