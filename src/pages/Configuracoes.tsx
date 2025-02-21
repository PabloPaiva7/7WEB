
import { useState } from "react";
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

export function Configuracoes() {
  const [corSelecionada, setCorSelecionada] = useState(cores[0].hex);
  const [corPersonalizada, setCorPersonalizada] = useState("");
  const { toast } = useToast();

  const aplicarCor = (cor: string) => {
    // Validar se é uma cor hex válida
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(cor)) {
      document.documentElement.style.setProperty('--primary', cor);
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

  // Recuperar cor salva ao carregar a página
  useState(() => {
    const corSalva = localStorage.getItem('tema-cor');
    if (corSalva) {
      document.documentElement.style.setProperty('--primary', corSalva);
      setCorSelecionada(corSalva);
    }
  });

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
