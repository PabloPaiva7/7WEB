
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Participante } from "@/types/mural.types";
import { toast } from "sonner";

interface ParticipanteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (participante: Omit<Participante, "id" | "dataInscricao">) => void;
}

export const ParticipanteForm = ({ isOpen, onClose, onSave }: ParticipanteFormProps) => {
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    email: "",
    departamento: "",
    observacoes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nomeCompleto || !formData.email || !formData.departamento) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Inscrição</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="nomeCompleto">Nome Completo*</Label>
              <Input
                id="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={(e) => setFormData(prev => ({ ...prev, nomeCompleto: e.target.value }))}
                placeholder="Digite seu nome completo"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail*</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Digite seu e-mail"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="departamento">Departamento*</Label>
              <Input
                id="departamento"
                value={formData.departamento}
                onChange={(e) => setFormData(prev => ({ ...prev, departamento: e.target.value }))}
                placeholder="Digite seu departamento"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                placeholder="Digite suas observações (opcional)"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Confirmar Inscrição
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

