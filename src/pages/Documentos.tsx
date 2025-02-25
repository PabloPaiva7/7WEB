import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Folder, FolderPlus, File, Search, UploadCloud, X, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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

const Documentos = () => {
  const [pastas, setPastas] = useState<Pasta[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [novaPasta, setNovaPasta] = useState("");
  const [pastaAberta, setPastaAberta] = useState<Pasta | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    carregarPastas();
  }, []);

  const carregarPastas = async () => {
    try {
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) throw bucketsError;

      const pastasCarregadas: Pasta[] = [];

      for (const bucket of buckets || []) {
        const { data: files, error: filesError } = await supabase.storage
          .from(bucket.name)
          .list();

        if (filesError) throw filesError;

        const documentos: Documento[] = files
          .filter(file => !file.metadata?.isFolder)
          .map(file => ({
            id: Date.now() + Math.random(),
            nome: file.name,
            data: new Date(file.created_at || '').toISOString(),
            tipo: file.metadata?.mimetype || 'unknown',
            url: `${supabase.storage.from(bucket.name).getPublicUrl(file.name).data.publicUrl}`
          }));

        pastasCarregadas.push({
          id: Date.now() + Math.random(),
          nome: bucket.name,
          documentos
        });
      }

      setPastas(pastasCarregadas);
    } catch (error) {
      console.error('Erro ao carregar pastas:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar pastas",
        description: "Não foi possível carregar as pastas e documentos."
      });
    }
  };

  const handleNovaPasta = async () => {
    if (novaPasta.trim()) {
      try {
        const { error } = await supabase.storage.createBucket(novaPasta.toLowerCase(), {
          public: true
        });

        if (error) throw error;

        setPastas([
          ...pastas,
          {
            id: Date.now(),
            nome: novaPasta,
            documentos: [],
          },
        ]);
        
        setNovaPasta("");
        setDialogAberto(false);
        
        toast({
          title: "Pasta criada",
          description: "A pasta foi criada com sucesso."
        });
      } catch (error) {
        console.error('Erro ao criar pasta:', error);
        toast({
          variant: "destructive",
          title: "Erro ao criar pasta",
          description: "Não foi possível criar a pasta."
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
        </div>
      </div>

      {pastaAberta ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setPastaAberta(null)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
            <h1 className="text-2xl font-semibold text-foreground">{pastaAberta.nome}</h1>
          </div>

          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Documentos</h2>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveDocumento(pastaAberta.id, doc.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {pastaAberta.documentos.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <UploadCloud className="mx-auto h-12 w-12 mb-4" />
                    <p>Nenhum documento encontrado</p>
                    <p className="text-sm">Faça upload de arquivos para começar</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      ) : (
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
                    <h3 className="font-medium">{pasta.nome}</h3>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {pasta.documentos.length} {pasta.documentos.length === 1 ? 'documento' : 'documentos'}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documentos;
