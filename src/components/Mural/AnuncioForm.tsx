
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { NovoAnuncio, Anuncio, TipoAnuncio } from "@/types/mural.types";
import { toast } from "sonner";

interface AnuncioFormProps {
  anuncio?: Anuncio;
  isOpen: boolean;
  onClose: () => void;
  onSave: (anuncio: NovoAnuncio) => void;
}

export const AnuncioForm = ({ anuncio, isOpen, onClose, onSave }: AnuncioFormProps) => {
  const [formData, setFormData] = useState<NovoAnuncio>({
    titulo: "",
    conteudo: "",
    tipo: "corporativo",
    autor: "",
    dataEvento: "",
    importante: false
  });

  useEffect(() => {
    if (anuncio) {
      setFormData({
        ...anuncio
      });
    } else {
      setFormData({
        titulo: "",
        conteudo: "",
        tipo: "corporativo",
        autor: "",
        dataEvento: "",
        importante: false
      });
    }
  }, [anuncio, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, importante: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.titulo || !formData.conteudo || !formData.autor) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{anuncio ? "Editar Anúncio" : "Novo Anúncio"}</DialogTitle>
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
                placeholder="Título do anúncio" 
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
                placeholder="Detalhes do anúncio" 
                rows={5} 
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select 
                  value={formData.tipo} 
                  onValueChange={(value) => handleSelectChange(value, "tipo")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="treinamento">Treinamento</SelectItem>
                    <SelectItem value="corporativo">Aviso Corporativo</SelectItem>
                    <SelectItem value="mudanca">Mudança</SelectItem>
                    <SelectItem value="chamada">Chamada</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dataEvento">Data do Evento (opcional)</Label>
                <Input 
                  id="dataEvento" 
                  name="dataEvento" 
                  type="date" 
                  value={formData.dataEvento || ""} 
                  onChange={handleChange} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="autor">Autor*</Label>
                <Input 
                  id="autor" 
                  name="autor" 
                  value={formData.autor} 
                  onChange={handleChange} 
                  placeholder="Nome do autor" 
                  required
                />
              </div>
              
              <div className="flex items-end space-x-2">
                <div className="flex items-center space-x-2 h-10">
                  <Checkbox 
                    id="importante" 
                    checked={formData.importante} 
                    onCheckedChange={handleCheckboxChange} 
                  />
                  <Label htmlFor="importante" className="cursor-pointer">
                    Marcar como importante
                  </Label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {anuncio ? "Atualizar" : "Publicar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
