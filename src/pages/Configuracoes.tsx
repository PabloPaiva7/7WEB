
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Sun } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const cores = [
  { nome: "Roxo", hex: "#9b87f5" },
  { nome: "Verde", hex: "#22c55e" },
  { nome: "Azul", hex: "#3b82f6" },
  { nome: "Laranja", hex: "#f97316" },
  { nome: "Rosa", hex: "#ec4899" },
];

const fontes = [
  { nome: "Padrão", valor: "sans-serif" },
  { nome: "Serifa", valor: "serif" },
  { nome: "Monospace", valor: "monospace" },
];

const layouts = [
  { nome: "Padrão", valor: "padrao" },
  { nome: "Compacto", valor: "compacto" },
  { nome: "Espaçado", valor: "espacado" },
];

const idiomas = [
  { nome: "Português", valor: "pt-BR" },
  { nome: "English", valor: "en-US" },
  { nome: "Español", valor: "es" },
];

const hexToHsl = (hex: string) => {
  hex = hex.replace(/^#/, '');
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

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

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
};

export function Configuracoes() {
  const [corSelecionada, setCorSelecionada] = useState(cores[0].hex);
  const [corPersonalizada, setCorPersonalizada] = useState("");
  const [modoEscuro, setModoEscuro] = useState(false);
  const [fonteSelecionada, setFonteSelecionada] = useState(fontes[0].valor);
  const [layoutSelecionado, setLayoutSelecionado] = useState(layouts[0].valor);
  const [idiomaSelecionado, setIdiomaSelecionado] = useState(idiomas[0].valor);
  const { toast } = useToast();

  const aplicarCor = (cor: string) => {
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

  const alternarTema = () => {
    const novoModo = !modoEscuro;
    setModoEscuro(novoModo);
    
    if (novoModo) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('tema-modo', 'escuro');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('tema-modo', 'claro');
    }
    
    toast({
      title: novoModo ? "Modo escuro ativado" : "Modo claro ativado",
      description: `O tema foi alterado para o modo ${novoModo ? "escuro" : "claro"}.`,
    });
  };

  const aplicarFonte = (fonte: string) => {
    document.documentElement.style.setProperty('--font-family', fonte);
    localStorage.setItem('tema-fonte', fonte);
    toast({
      title: "Fonte atualizada!",
      description: "A fonte da interface foi alterada com sucesso.",
    });
  };

  const aplicarLayout = (layout: string) => {
    localStorage.setItem('tema-layout', layout);
    toast({
      title: "Layout atualizado!",
      description: "O layout da interface foi alterado com sucesso.",
    });
  };

  const aplicarIdioma = (idioma: string) => {
    localStorage.setItem('app-idioma', idioma);
    toast({
      title: "Idioma atualizado!",
      description: "O idioma da aplicação foi alterado com sucesso. Algumas alterações podem exigir recarregar a página.",
    });
  };

  useEffect(() => {
    // Verificar e definir o modo escuro
    const modoSalvo = localStorage.getItem('tema-modo');
    if (modoSalvo === 'escuro') {
      setModoEscuro(true);
    } else {
      setModoEscuro(false);
    }

    // Carregar outras configurações salvas
    const corSalva = localStorage.getItem('tema-cor');
    if (corSalva) {
      setCorSelecionada(corSalva);
    }

    const fonteSalva = localStorage.getItem('tema-fonte');
    if (fonteSalva) {
      setFonteSelecionada(fonteSalva);
    }

    const layoutSalvo = localStorage.getItem('tema-layout');
    if (layoutSalvo) {
      setLayoutSelecionado(layoutSalvo);
    }

    const idiomaSalvo = localStorage.getItem('app-idioma');
    if (idiomaSalvo) {
      setIdiomaSelecionado(idiomaSalvo);
    }
  }, []);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tema</CardTitle>
            <CardDescription>
              Escolha entre o modo escuro e claro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sun className="h-5 w-5 text-orange-400" />
                <Label htmlFor="modo-tema">Alternar tema</Label>
                <Moon className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <Switch 
                id="modo-tema" 
                checked={modoEscuro}
                onCheckedChange={alternarTema}
              />
            </div>
          </CardContent>
        </Card>

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

        <Card>
          <CardHeader>
            <CardTitle>Interface</CardTitle>
            <CardDescription>
              Personalize a aparência da interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="fonte-select">Fonte</Label>
              <Select
                value={fonteSelecionada}
                onValueChange={(valor) => {
                  setFonteSelecionada(valor);
                  aplicarFonte(valor);
                }}
              >
                <SelectTrigger id="fonte-select">
                  <SelectValue placeholder="Selecione uma fonte" />
                </SelectTrigger>
                <SelectContent>
                  {fontes.map((fonte) => (
                    <SelectItem key={fonte.valor} value={fonte.valor}>
                      {fonte.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Densidade do Layout</Label>
              <ToggleGroup 
                type="single" 
                value={layoutSelecionado}
                onValueChange={(valor) => {
                  if (valor) {
                    setLayoutSelecionado(valor);
                    aplicarLayout(valor);
                  }
                }}
                className="justify-start"
              >
                {layouts.map((layout) => (
                  <ToggleGroupItem key={layout.valor} value={layout.valor}>
                    {layout.nome}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Idioma</CardTitle>
            <CardDescription>
              Selecione o idioma da aplicação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="idioma-select">Idioma</Label>
              <Select
                value={idiomaSelecionado}
                onValueChange={(valor) => {
                  setIdiomaSelecionado(valor);
                  aplicarIdioma(valor);
                }}
              >
                <SelectTrigger id="idioma-select">
                  <SelectValue placeholder="Selecione um idioma" />
                </SelectTrigger>
                <SelectContent>
                  {idiomas.map((idioma) => (
                    <SelectItem key={idioma.valor} value={idioma.valor}>
                      {idioma.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
