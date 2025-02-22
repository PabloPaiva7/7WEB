
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const cores = [
  { nome: "Roxo", hex: "#9b87f5" },
  { nome: "Verde", hex: "#22c55e" },
  { nome: "Azul", hex: "#3b82f6" },
  { nome: "Laranja", hex: "#f97316" },
  { nome: "Rosa", hex: "#ec4899" },
];

const hexToHsl = (hex: string) => {
  // Remove o # se existir
  hex = hex.replace(/^#/, '');

  // Converte para RGB
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  // Encontra o mínimo e máximo dos valores RGB
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (max !== min) {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    
    h /= 6;
  }

  // Converte para os valores que o CSS espera
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
};

export function Configuracoes() {
  const [corSelecionada, setCorSelecionada] = useState(cores[0].hex);
  const [corPersonalizada, setCorPersonalizada] = useState("");
  const { toast } = useToast();

  const aplicarCor = (cor: string) => {
    // Validar se é uma cor hex válida
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(cor)) {
      const hsl = hexToHsl(cor);
      document.documentElement.style.setProperty('--primary', hsl);
      localStorage.setItem('tema-cor', cor);
      toast({
        title: "Tema atualizado!",
        description: "A cor do tema foi alterada com sucesso.",
      });
    } else {
      toast({
        title: "Cor inválida",
        description: "Por favor, insira um código de cor hexadecimal válido (ex: #FF0000).",
        variant: "destructive",
      });
    }
  };

  const handleCorPersonalizada = (e: React.FormEvent) => {
    e.preventDefault();
    aplicarCor(corPersonalizada);
  };

  // Recuperar e aplicar cor salva ao carregar a página
  useEffect(() => {
    const corSalva = localStorage.getItem('tema-cor');
    if (corSalva) {
      setCorSelecionada(corSalva);
      aplicarCor(corSalva);
    }
  }, []);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personalização</CardTitle>
            <CardDescription>
              Escolha as cores do tema da sua carteira
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Cores predefinidas</Label>
                <div className="flex flex-wrap gap-3">
                  {cores.map((cor) => (
                    <Button
                      key={cor.hex}
                      variant="outline"
                      className={`w-20 h-20 p-0 relative overflow-hidden ${
                        corSelecionada === cor.hex ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => {
                        setCorSelecionada(cor.hex);
                        aplicarCor(cor.hex);
                      }}
                    >
                      <div
                        className="absolute inset-2 rounded-sm"
                        style={{ backgroundColor: cor.hex }}
                      />
                      <span className="absolute bottom-1 left-1 right-1 text-xs font-medium">
                        {cor.nome}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Cor personalizada</Label>
                <form onSubmit={handleCorPersonalizada} className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="#000000"
                      value={corPersonalizada}
                      onChange={(e) => setCorPersonalizada(e.target.value)}
                      pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                      title="Código de cor hexadecimal (ex: #FF0000)"
                    />
                  </div>
                  <Button type="submit">Aplicar</Button>
                </form>
                <div className="text-sm text-muted-foreground">
                  Digite um código de cor hexadecimal (ex: #FF0000)
                </div>
              </div>

              <div className="p-4 rounded-lg bg-primary/10">
                <div className="font-medium mb-2">Prévia das cores</div>
                <div className="space-y-2">
                  <div className="h-8 rounded-md bg-primary" />
                  <div className="h-8 rounded-md bg-primary/80" />
                  <div className="h-8 rounded-md bg-primary/60" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
