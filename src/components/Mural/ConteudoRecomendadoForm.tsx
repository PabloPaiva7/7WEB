
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ConteudoRecomendado, TipoConteudo } from "@/types/mural.types";
import { Book, Film, BookOpen, GraduationCap, Play } from "lucide-react";

interface ConteudoRecomendadoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (conteudo: Omit<ConteudoRecomendado, "id" | "dataCriacao">) => void;
  conteudo?: ConteudoRecomendado;
}

export const ConteudoRecomendadoForm = ({ 
  isOpen, 
  onClose, 
  onSave, 
  conteudo 
}: ConteudoRecomendadoFormProps) => {
  const [titulo, setTitulo] = useState(conteudo?.titulo || "");
  const [descricao, setDescricao] = useState(conteudo?.descricao || "");
  const [tipo, setTipo] = useState<TipoConteudo>(conteudo?.tipo || "livro");
  const [autor, setAutor] = useState(conteudo?.autor || "");
  const [imagem, setImagem] = useState(conteudo?.imagem || "");
  const [link, setLink] = useState(conteudo?.link || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !descricao || !tipo) return;

    onSave({
      titulo,
      descricao,
      tipo,
      autor: autor || undefined,
      imagem: imagem || undefined,
      link: link || undefined
    });

    // Reset form
    setTitulo("");
    setDescricao("");
    setTipo("livro");
    setAutor("");
    setImagem("");
    setLink("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{conteudo ? "Editar" : "Adicionar"} Conteúdo Recomendado</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título do conteúdo"
              required
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="tipo">Tipo de Conteúdo</Label>
            <RadioGroup 
              value={tipo} 
              onValueChange={(value) => setTipo(value as TipoConteudo)}
              className="grid grid-cols-2 sm:grid-cols-5 gap-2"
            >
              <div className="flex items-center space-x-2 border rounded-md p-2">
                <RadioGroupItem value="livro" id="livro" />
                <Label htmlFor="livro" className="flex items-center cursor-pointer">
                  <Book className="h-4 w-4 mr-2 text-emerald-500" />
                  Livro
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-2">
                <RadioGroupItem value="filme" id="filme" />
                <Label htmlFor="filme" className="flex items-center cursor-pointer">
                  <Film className="h-4 w-4 mr-2 text-red-500" />
                  Filme
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-2">
                <RadioGroupItem value="serie" id="serie" />
                <Label htmlFor="serie" className="flex items-center cursor-pointer">
                  <Play className="h-4 w-4 mr-2 text-purple-500" />
                  Série
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-2">
                <RadioGroupItem value="curso" id="curso" />
                <Label htmlFor="curso" className="flex items-center cursor-pointer">
                  <GraduationCap className="h-4 w-4 mr-2 text-blue-500" />
                  Curso
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-2">
                <RadioGroupItem value="versiculo" id="versiculo" />
                <Label htmlFor="versiculo" className="flex items-center cursor-pointer">
                  <BookOpen className="h-4 w-4 mr-2 text-amber-500" />
                  Versículo
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição do conteúdo"
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="autor">Autor/Fonte (opcional)</Label>
            <Input
              id="autor"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              placeholder="Autor ou fonte do conteúdo"
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="imagem">URL da Imagem (opcional)</Label>
            <Input
              id="imagem"
              value={imagem}
              onChange={(e) => setImagem(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="link">Link (opcional)</Label>
            <Input
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://exemplo.com/conteudo"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!titulo || !descricao || !tipo}>
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
