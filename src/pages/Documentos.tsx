
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Folder, FolderPlus, File, Plus, Search } from "lucide-react";

// Dados de exemplo para pastas e documentos
const pastasIniciais = [
  {
    id: 1,
    nome: "Minutas",
    documentos: [
      { id: 1, nome: "Minuta - Acordo 01.pdf", data: "2024-03-10" },
      { id: 2, nome: "Minuta - Acordo 02.pdf", data: "2024-03-11" },
    ],
  },
  {
    id: 2,
    nome: "Procurações",
    documentos: [
      { id: 3, nome: "Procuração João Silva.pdf", data: "2024-03-09" },
      { id: 4, nome: "Procuração Maria Santos.pdf", data: "2024-03-08" },
    ],
  },
  {
    id: 3,
    nome: "Boletos",
    documentos: [
      { id: 5, nome: "Boleto Janeiro 2024.pdf", data: "2024-01-15" },
      { id: 6, nome: "Boleto Fevereiro 2024.pdf", data: "2024-02-15" },
    ],
  },
  {
    id: 4,
    nome: "Comprovantes",
    documentos: [
      { id: 7, nome: "Comprovante Pagamento 01.pdf", data: "2024-03-01" },
      { id: 8, nome: "Comprovante Pagamento 02.pdf", data: "2024-03-05" },
    ],
  },
];

const Documentos = () => {
  const [pastas, setPastas] = useState(pastasIniciais);
  const [searchTerm, setSearchTerm] = useState("");
  const [novaPasta, setNovaPasta] = useState("");
  const [pastaAberta, setPastaAberta] = useState<number | null>(null);

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
          <Dialog>
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
            className={`p-6 cursor-pointer transition-all ${
              pastaAberta === pasta.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setPastaAberta(pastaAberta === pasta.id ? null : pasta.id)}
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

              {pastaAberta === pasta.id && (
                <div className="space-y-2 pt-2 border-t">
                  {pasta.documentos.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                    >
                      <File className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{doc.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(doc.data).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Documento
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Documentos;
