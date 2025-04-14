
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Demanda, NovaDemanda } from "@/types/demanda";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { v4 as uuidv4 } from "uuid";

interface DemandaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  demanda: Demanda | null;
  onSave: (demanda: Demanda) => void;
  isLider: boolean;
}

export function DemandaDialog({
  open,
  onOpenChange,
  demanda,
  onSave,
  isLider
}: DemandaDialogProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<NovaDemanda>({
    titulo: "",
    descricao: "",
    status: "pendente",
    prioridade: "media",
    categoria: "",
    responsavel: user?.id,
  });

  // Resetar o formulário quando o modal for aberto/fechado ou quando demanda mudar
  useEffect(() => {
    if (open && demanda) {
      setFormData({
        titulo: demanda.titulo,
        descricao: demanda.descricao,
        status: demanda.status,
        prioridade: demanda.prioridade,
        categoria: demanda.categoria || "",
        responsavel: demanda.responsavel || user?.id,
        lider: demanda.lider || user?.id,
        colaborador: demanda.colaborador,
      });
    } else if (open) {
      setFormData({
        titulo: "",
        descricao: "",
        status: "pendente",
        prioridade: "media",
        categoria: "",
        responsavel: user?.id,
        lider: user?.id,
      });
    }
  }, [open, demanda, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novaDemanda: Demanda = {
      id: demanda?.id || uuidv4(),
      criacao: demanda?.criacao || new Date(),
      inicioProcessamento: demanda?.inicioProcessamento || null,
      conclusao: demanda?.conclusao || null,
      tempoProcessamento: demanda?.tempoProcessamento || null,
      ...formData,
    };
    
    onSave(novaDemanda);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{demanda ? "Editar Demanda" : "Nova Demanda"}</DialogTitle>
          <DialogDescription>
            {demanda 
              ? "Atualize os detalhes da demanda existente." 
              : "Preencha os campos para criar uma nova demanda."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              placeholder="Título da demanda"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              placeholder="Descreva a demanda em detalhes"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prioridade">Prioridade</Label>
              <Select
                value={formData.prioridade}
                onValueChange={(value: "baixa" | "media" | "alta") =>
                  setFormData({ ...formData, prioridade: value })
                }
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
            
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Input
                id="categoria"
                placeholder="Categoria"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              />
            </div>
          </div>
          
          {isLider && demanda && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Demanda['status']) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="encaminhado">Encaminhado</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="finalizado">Finalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Aqui poderíamos adicionar um campo para selecionar o colaborador */}
          {/* Por enquanto, utilizaremos o usuário logado como responsável */}
          
          <DialogFooter>
            <Button type="submit">
              {demanda ? "Salvar Alterações" : "Criar Demanda"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
