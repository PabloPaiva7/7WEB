
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DicaHack, CategoriaDica } from "@/types/mural.types";
import { toast } from "sonner";

interface DicaHackFormProps {
  dica?: DicaHack;
  isOpen: boolean;
  onClose: () => void;
  onSave: (dica: Omit<DicaHack, "id" | "dataCriacao" | "curtidas">) => void;
}

export const DicaHackForm = ({ dica, isOpen, onClose, onSave }: DicaHackFormProps) => {
  const [formData, setFormData] = useState<Omit<DicaHack, "id" | "dataCriacao" | "curtidas">>({
    titulo: "",
    conteudo: "",
    categoria: "produtividade",
    autor: ""
  });

  useEffect(() => {
    if (dica) {
      setFormData({
        titulo: dica.titulo,
        conteudo: dica.conteudo,
        categoria: dica.categoria,
        autor: dica.autor
      });
    } else {
      setFormData({
        titulo: "",
        conteudo: "",
        categoria: "produtividade",
        autor: ""
      });
    }
  }, [dica, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, categoria: value as CategoriaDica }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.conteudo || !formData.autor) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{dica ? "Editar Dica" : "Nova Dica"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título*</Label>
              <Input 
                id="titulo" 
                name="titulo" 
                value={formData.titulo} 
                onChange={handleChange} 
                placeholder="Título da dica" 
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="conteudo">Conteúdo*</Label>
              <Textarea 
                id="conteudo" 
                name="conteudo" 
                value={formData.conteudo} 
                onChange={handleChange} 
                placeholder="Descreva sua dica ou truque..." 
                rows={5} 
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select 
                  value={formData.categoria} 
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trabalho">Trabalho</SelectItem>
                    <SelectItem value="produtividade">Produtividade</SelectItem>
                    <SelectItem value="tecnologia">Tecnologia</SelectItem>
                    <SelectItem value="bem-estar">Bem-estar</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="autor">Autor*</Label>
                <Input 
                  id="autor" 
                  name="autor" 
                  value={formData.autor} 
                  onChange={handleChange} 
                  placeholder="Seu nome" 
                  required
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {dica ? "Atualizar" : "Publicar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
