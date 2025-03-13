
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { NovoAnuncio, Anuncio, TipoAnuncio } from "@/types/mural.types";
import { toast } from "sonner";
import { Upload, Image, XCircle } from "lucide-react";

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
    importante: false,
    permitirInscricao: false
  });
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (anuncio) {
      setFormData({
        ...anuncio
      });
      setPreviewImage(anuncio.imagem || null);
    } else {
      setFormData({
        titulo: "",
        conteudo: "",
        tipo: "corporativo",
        autor: "",
        dataEvento: "",
        importante: false,
        permitirInscricao: false
      });
      setPreviewImage(null);
    }
  }, [anuncio, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean, name: string) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validar tamanho do arquivo (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem não pode ter mais de 5MB");
      return;
    }
    
    // Validar tipo do arquivo
    if (!file.type.startsWith('image/')) {
      toast.error("O arquivo deve ser uma imagem");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageDataUrl = event.target?.result as string;
      setPreviewImage(imageDataUrl);
      setFormData(prev => ({ ...prev, imagem: imageDataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setFormData(prev => {
      const newData = { ...prev };
      delete newData.imagem;
      return newData;
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
            
            <div className="space-y-2">
              <Label htmlFor="imagem">Imagem (opcional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="imagem"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              
              {previewImage && (
                <div className="relative mt-2">
                  <div className="relative rounded-md overflow-hidden border border-gray-200">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-full h-auto max-h-[200px] object-contain"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-white rounded-full shadow-md p-1"
                    >
                      <XCircle className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                </div>
              )}
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
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="importante" 
                    checked={formData.importante} 
                    onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, "importante")} 
                  />
                  <Label htmlFor="importante" className="cursor-pointer">
                    Marcar como importante
                  </Label>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Checkbox 
                    id="permitirInscricao" 
                    checked={formData.permitirInscricao} 
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(checked as boolean, "permitirInscricao")
                    } 
                  />
                  <Label htmlFor="permitirInscricao" className="cursor-pointer">
                    Permitir inscrições
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
