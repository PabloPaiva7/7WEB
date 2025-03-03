
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Folder, FolderPlus, File, Search, UploadCloud, X, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface Documento {
  id: number;
  nome: string;
  data: string;
  tipo: string;
  url?: string;
}

interface Pasta {
  id: number;
  nome: string;
  documentos: Documento[];
}

// Lista de pastas predefinidas que já foram criadas no Supabase
const pastasPredefinidas = [
  "minutas",
  "procuracoes",
  "prints",
  "boletos",
  "comprovantes",
  "notificacoes_extrajudiciais"
];

// Mapeamento de nomes para exibição
const pastasDisplay: Record<string, string> = {
  "minutas": "MINUTAS",
  "procuracoes": "PROCURAÇÕES",
  "prints": "PRINTS",
  "boletos": "BOLETOS",
  "comprovantes": "COMPROVANTES",
  "notificacoes_extrajudiciais": "NOTIFICAÇÕES EXTRAJUDICIAIS"
};

const Documentos = () => {
  const [pastas, setPastas] = useState<Pasta[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [novaPasta, setNovaPasta] = useState("");
  const [pastaAberta, setPastaAberta] = useState<Pasta | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [permissionError, setPermissionError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    carregarPastas();
  }, []);

  const carregarPastas = async () => {
    try {
      setCarregando(true);
      
      // Carregar todas as pastas existentes
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error("Erro ao listar buckets:", bucketsError);
        if (bucketsError.message?.includes("violates row-level security policy")) {
          setPermissionError(true);
        }
        throw bucketsError;
      }
      
      const bucketsExistentes = (buckets || []).map(b => b.name);
      console.log("Buckets existentes:", bucketsExistentes);
      
      const pastasCarregadas: Pasta[] = [];

      // Processar cada bucket para obter seus arquivos
      for (const bucket of buckets || []) {
        try {
          const { data: files, error: filesError } = await supabase.storage
            .from(bucket.name)
            .list();

          if (filesError) {
            console.error(`Erro ao listar arquivos da pasta ${bucket.name}:`, filesError);
            // Adicionar pasta mesmo sem arquivos
            pastasCarregadas.push({
              id: Date.now() + Math.random(),
              nome: bucket.name,
              documentos: []
            });
          } else {
            const documentos: Documento[] = files
              ?.filter(file => !file.name.endsWith('/') && file.name !== '.emptyFolderPlaceholder')
              .map(file => {
                const { data: urlData } = supabase.storage
                  .from(bucket.name)
                  .getPublicUrl(file.name);
                
                return {
                  id: Date.now() + Math.random(),
                  nome: file.name,
                  data: new Date(file.created_at || '').toISOString(),
                  tipo: file.metadata?.mimetype || 'unknown',
                  url: urlData.publicUrl
                };
              }) || [];

            pastasCarregadas.push({
              id: Date.now() + Math.random(),
              nome: bucket.name,
              documentos
            });
          }
        } catch (error) {
          console.error(`Erro ao processar pasta ${bucket.name}:`, error);
          // Adicionar pasta mesmo em caso de erro
          pastasCarregadas.push({
            id: Date.now() + Math.random(),
            nome: bucket.name,
            documentos: []
          });
        }
      }

      setPastas(pastasCarregadas);
    } catch (error) {
      console.error('Erro ao carregar pastas:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar pastas",
        description: "Não foi possível carregar as pastas e documentos."
      });
    } finally {
      setCarregando(false);
    }
  };

  const criarPasta = async (nomePasta: string) => {
    try {
      // Verificar se o bucket já existe
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExiste = buckets?.some(b => b.name === nomePasta);
      
      if (bucketExiste) {
        console.log(`Bucket ${nomePasta} já existe.`);
        return true;
      }
      
      const { error } = await supabase.storage.createBucket(nomePasta, {
        public: true,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: [
          'image/jpeg',
          'image/png',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/csv'
        ]
      });

      if (error) {
        console.error('Erro ao criar pasta:', error);
        if (error.message?.includes("violates row-level security policy")) {
          setPermissionError(true);
          return false;
        }
        return false;
      }
      
      return true;
    } catch (error: any) {
      console.error(`Erro ao criar pasta ${nomePasta}:`, error);
      if (error.message?.includes("violates row-level security policy")) {
        setPermissionError(true);
      }
      return false;
    }
  };

  const handleNovaPasta = async () => {
    if (novaPasta.trim()) {
      try {
        const success = await criarPasta(novaPasta.toLowerCase());

        if (!success) {
          throw new Error("Falha ao criar pasta");
        }

        // Atualizar a lista de pastas localmente
        const novaPastaObj = {
          id: Date.now(),
          nome: novaPasta.toLowerCase(),
          documentos: [],
        };

        setPastas(prevPastas => [...prevPastas, novaPastaObj]);
        setNovaPasta("");
        setDialogAberto(false);
        
        toast({
          title: "Pasta criada",
          description: "A pasta foi criada com sucesso."
        });

        // Recarregar pastas para garantir sincronização
        await carregarPastas();
      } catch (error: any) {
        console.error('Erro ao criar pasta:', error);
        toast({
          variant: "destructive",
          title: "Erro ao criar pasta",
          description: error.message || "Não foi possível criar a pasta."
        });
      }
    }
  };

  const handleUpload = async (pastaId: number, files: FileList) => {
    const pasta = pastas.find(p => p.id === pastaId);
    if (!pasta) return;

    const novosDocumentos: Documento[] = [];

    for (const file of Array.from(files)) {
      try {
        const { error: uploadError } = await supabase.storage
          .from(pasta.nome)
          .upload(file.name, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from(pasta.nome)
          .getPublicUrl(file.name);

        novosDocumentos.push({
          id: Date.now() + Math.random(),
          nome: file.name,
          data: new Date().toISOString(),
          tipo: file.type,
          url: urlData.publicUrl
        });

        toast({
          title: "Arquivo enviado",
          description: `${file.name} foi enviado com sucesso.`
        });
      } catch (error) {
        console.error('Erro ao fazer upload:', error);
        toast({
          variant: "destructive",
          title: "Erro no upload",
          description: `Não foi possível enviar ${file.name}.`
        });
      }
    }

    // Atualizar estado das pastas após uploads
    setPastas(pastas.map(pasta => {
      if (pasta.id === pastaId) {
        return {
          ...pasta,
          documentos: [...pasta.documentos, ...novosDocumentos],
        };
      }
      return pasta;
    }));
  };

  const handleRemoveDocumento = async (pastaId: number, documentoId: number) => {
    const pasta = pastas.find(p => p.id === pastaId);
    if (!pasta) return;

    const documento = pasta.documentos.find(d => d.id === documentoId);
    if (!documento) return;

    try {
      const { error } = await supabase.storage
        .from(pasta.nome)
        .remove([documento.nome]);

      if (error) throw error;

      setPastas(pastas.map(pasta => {
        if (pasta.id === pastaId) {
          return {
            ...pasta,
            documentos: pasta.documentos.filter(doc => doc.id !== documentoId),
          };
        }
        return pasta;
      }));

      toast({
        title: "Documento removido",
        description: "O documento foi removido com sucesso."
      });
    } catch (error) {
      console.error('Erro ao remover documento:', error);
      toast({
        variant: "destructive",
        title: "Erro ao remover",
        description: "Não foi possível remover o documento."
      });
    }
  };

  const filtrarPastas = () => {
    if (!searchTerm) return pastas;
    return pastas.map(pasta => ({
      ...pasta,
      documentos: pasta.documentos.filter(doc =>
        doc.nome.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    })).filter(pasta =>
      pasta.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pasta.documentos.length > 0
    );
  };

  // Obter o nome de exibição para uma pasta
  const getNomePastaDisplay = (nome: string) => {
    return pastasDisplay[nome] || nome.toUpperCase();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-foreground">Documentos</h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar documentos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {!permissionError && (
            <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
              <DialogTrigger asChild>
                <Button>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Nova Pasta
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Nova Pasta</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="Nome da pasta"
                    value={novaPasta}
                    onChange={(e) => setNovaPasta(e.target.value)}
                  />
                  <Button onClick={handleNovaPasta} className="w-full">
                    Criar Pasta
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {permissionError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Aviso de permissão</AlertTitle>
          <AlertDescription>
            Você não tem permissões suficientes para gerenciar pastas no armazenamento. 
            Você ainda pode visualizar pastas e documentos existentes, mas não pode criar novas pastas.
            Entre em contato com o administrador para solicitar acesso completo.
          </AlertDescription>
        </Alert>
      )}

      {carregando ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : pastaAberta ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setPastaAberta(null)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
            <h1 className="text-2xl font-semibold text-foreground">
              {getNomePastaDisplay(pastaAberta.nome)}
            </h1>
          </div>

          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Documentos</h2>
                {!permissionError && (
                  <div className="relative">
                    <Input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      multiple
                      accept=".pdf,.doc,.docx,.csv,.png,.jpg,.jpeg"
                      onChange={(e) => e.target.files && handleUpload(pastaAberta.id, e.target.files)}
                    />
                    <label htmlFor="file-upload">
                      <Button asChild>
                        <div>
                          <UploadCloud className="mr-2 h-4 w-4" />
                          Upload
                        </div>
                      </Button>
                    </label>
                  </div>
                )}
              </div>

              <div className="grid gap-4">
                {pastaAberta.documentos.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <File className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <a 
                          href={doc.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium hover:underline"
                        >
                          {doc.nome}
                        </a>
                        <p className="text-sm text-muted-foreground">
                          {new Date(doc.data).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    {!permissionError && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveDocumento(pastaAberta.id, doc.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                {pastaAberta.documentos.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <UploadCloud className="mx-auto h-12 w-12 mb-4" />
                    <p>Nenhum documento encontrado</p>
                    <p className="text-sm">
                      {!permissionError ? "Faça upload de arquivos para começar" : "Entre em contato com o administrador para adicionar documentos"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      ) : pastas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pastas.map((pasta) => (
            <Card
              key={pasta.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setPastaAberta(pasta)}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Folder className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">
                      {getNomePastaDisplay(pasta.nome)}
                    </h3>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {pasta.documentos.length} {pasta.documentos.length === 1 ? 'documento' : 'documentos'}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <FolderPlus className="mx-auto h-12 w-12 mb-4" />
          <p>Nenhuma pasta encontrada</p>
          <p className="text-sm">
            {!permissionError ? 
              "Crie uma pasta para começar a adicionar documentos" : 
              "Entre em contato com o administrador para adicionar pastas e documentos"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Documentos;
