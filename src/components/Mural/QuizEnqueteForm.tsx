
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Quiz, TipoQuiz, NovoQuiz, OpcaoQuiz } from "@/types/mural.types";
import { toast } from "sonner";
import { Trash2, PlusCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface QuizEnqueteFormProps {
  quiz?: Quiz;
  isOpen: boolean;
  onClose: () => void;
  onSave: (quiz: NovoQuiz) => void;
}

const OPCAO_INICIAL = { id: uuidv4(), texto: "", votos: 0 };

export const QuizEnqueteForm = ({ quiz, isOpen, onClose, onSave }: QuizEnqueteFormProps) => {
  const [formData, setFormData] = useState<NovoQuiz>({
    titulo: "",
    descricao: "",
    tipo: "opiniao",
    opcoes: [{ ...OPCAO_INICIAL }, { ...OPCAO_INICIAL, id: uuidv4() }],
    ativo: true,
    multiplaEscolha: false,
    autor: ""
  });

  useEffect(() => {
    if (quiz) {
      setFormData({
        titulo: quiz.titulo,
        descricao: quiz.descricao,
        tipo: quiz.tipo,
        opcoes: quiz.opcoes,
        ativo: quiz.ativo,
        multiplaEscolha: quiz.multiplaEscolha,
        autor: quiz.autor,
        dataEncerramento: quiz.dataEncerramento
      });
    } else {
      setFormData({
        titulo: "",
        descricao: "",
        tipo: "opiniao",
        opcoes: [{ ...OPCAO_INICIAL }, { ...OPCAO_INICIAL, id: uuidv4() }],
        ativo: true,
        multiplaEscolha: false,
        autor: ""
      });
    }
  }, [quiz, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, tipo: value as TipoQuiz }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleOpcaoChange = (id: string, texto: string) => {
    setFormData((prev) => ({
      ...prev,
      opcoes: prev.opcoes.map((opcao) =>
        opcao.id === id ? { ...opcao, texto } : opcao
      ),
    }));
  };

  const adicionarOpcao = () => {
    setFormData((prev) => ({
      ...prev,
      opcoes: [...prev.opcoes, { id: uuidv4(), texto: "", votos: 0 }],
    }));
  };

  const removerOpcao = (id: string) => {
    if (formData.opcoes.length <= 2) {
      toast.error("É necessário ter pelo menos duas opções");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      opcoes: prev.opcoes.filter((opcao) => opcao.id !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.descricao || !formData.autor) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // Verificar se todas as opções têm texto
    const opcoesVazias = formData.opcoes.some((opcao) => !opcao.texto.trim());
    if (opcoesVazias) {
      toast.error("Todas as opções devem ter um texto");
      return;
    }

    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{quiz ? "Editar Enquete" : "Nova Enquete"}</DialogTitle>
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
                placeholder="Título da enquete" 
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição*</Label>
              <Textarea 
                id="descricao" 
                name="descricao" 
                value={formData.descricao} 
                onChange={handleChange} 
                placeholder="Descreva sua enquete..." 
                rows={3} 
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Enquete</Label>
                <Select 
                  value={formData.tipo} 
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="opiniao">Opinião</SelectItem>
                    <SelectItem value="conhecimento">Conhecimento</SelectItem>
                    <SelectItem value="preferencia">Preferência</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
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
            
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => handleSwitchChange("ativo", checked)}
                />
                <Label htmlFor="ativo">Enquete ativa</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="multiplaEscolha"
                  checked={formData.multiplaEscolha}
                  onCheckedChange={(checked) => handleSwitchChange("multiplaEscolha", checked)}
                />
                <Label htmlFor="multiplaEscolha">Permitir múltiplas escolhas</Label>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Opções (mínimo 2)</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={adicionarOpcao}
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> Adicionar Opção
                </Button>
              </div>
              
              {formData.opcoes.map((opcao, index) => (
                <div key={opcao.id} className="flex items-center space-x-2">
                  <Input
                    value={opcao.texto}
                    onChange={(e) => handleOpcaoChange(opcao.id, e.target.value)}
                    placeholder={`Opção ${index + 1}`}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removerOpcao(opcao.id)}
                    disabled={formData.opcoes.length <= 2}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {quiz ? "Atualizar" : "Publicar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
