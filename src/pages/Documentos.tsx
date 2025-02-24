
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Folder, FolderPlus, File, Plus, Search, UploadCloud, X, ArrowLeft } from "lucide-react";

// Dados de exemplo para pastas e documentos
const pastasIniciais = [
  {
    id: 1,
    nome: "Minutas",
    documentos: [
      { id: 1, nome: "Minuta - Acordo 01.pdf", data: "2024-03-10", tipo: "pdf" },
      { id: 2, nome: "Minuta - Acordo 02.pdf", data: "2024-03-11", tipo: "pdf" },
    ],
  },
  {
    id: 2,
    nome: "Procurações",
    documentos: [
      { id: 3, nome: "Procuração João Silva.pdf", data: "2024-03-09", tipo: "pdf" },
      { id: 4, nome: "Procuração Maria Santos.pdf", data: "2024-03-08", tipo: "pdf" },
    ],
  },
  {
    id: 3,
    nome: "Boletos",
    documentos: [
      { id: 5, nome: "Boleto Janeiro 2024.pdf", data: "2024-01-15", tipo: "pdf" },
      { id: 6, nome: "Boleto Fevereiro 2024.pdf", data: "2024-02-15", tipo: "pdf" },
    ],
  },
  {
    id: 4,
    nome: "Comprovantes",
    documentos: [
      { id: 7, nome: "Comprovante Pagamento 01.pdf", data: "2024-03-01", tipo: "pdf" },
      { id: 8, nome: "Comprovante Pagamento 02.pdf", data: "2024-03-05", tipo: "pdf" },
    ],
  },
];

interface Documento {
  id: number;
  nome: string;
  data: string;
  tipo: string;
}

interface Pasta {
  id: number;
  nome: string;
  documentos: Documento[];
}

const Documentos = () => {
  const [pastas, setPastas] = useState<Pasta[]>(pastasIniciais);
  const [searchTerm, setSearchTerm] = useState("");
  const [novaPasta, setNovaPasta] = useState("");
  const [pastaAberta, setPastaAberta] = useState<Pasta | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);

  const handleNovaPasta = () => {
    if (novaPasta.trim()) {
      setPastas([
        ...pastas,
        {
          id: pastas.length + 1,
          nome: novaPasta,
          documentos: [],
        },
      ]);
      setNovaPasta("");
      setDialogAberto(false);
    }
  };

  const handleUpload = (pastaId: number, files: FileList) => {
    const novosDocumentos: Documento[] = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      nome: file.name,
      data: new Date().toISOString().split('T')[0],
      tipo: file.name.split('.').pop()?.toLowerCase() || '',
    }));

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

  const handleRemoveDocumento = (pastaId: number, documentoId: number) => {
    setPastas(pastas.map(pasta => {
      if (pasta.id === pastaId) {
        return {
          ...pasta,
          documentos: pasta.documentos.filter(doc => doc.id !== documentoId),
        };
      }
      return pasta;
    }));
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

  if (pastaAberta) {
    return (
      <div className="space-y-6 animate-fadeIn">
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
                  accept=".pdf,.csv,.png,.jpg,.jpeg"
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
                      <p className="font-medium">{doc.nome}</p>
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
    );
  }

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtrarPastas().map((pasta) => (
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
    </div>
  );
};

export default Documentos;
