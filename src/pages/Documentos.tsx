import { useState, useEffect } from "react";
import { SearchBar } from "@/components/Documentos/SearchBar";
import { NovaPastaDialog } from "@/components/Documentos/NovasPastaDialog";
import { PermissionAlert } from "@/components/Documentos/PermissionAlert";
import { ListaPastas } from "@/components/Documentos/ListaPastas";
import { DetalhesPasta } from "@/components/Documentos/DetalhesPasta";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { 
  Pasta, 
  carregarPastas, 
  criarPasta, 
  filtrarPastas, 
  removerDocumento,
  uploadDocumentos 
} from "@/utils/document";

const Documentos = () => {
  const [pastas, setPastas] = useState<Pasta[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pastaAberta, setPastaAberta] = useState<Pasta | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [permissionError, setPermissionError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPastas();
  }, []);

  const fetchPastas = async () => {
    setCarregando(true);
    try {
      const { pastas: pastasCarregadas, permissionError: hasPermissionError } = await carregarPastas();
      setPastas(pastasCarregadas);
      setPermissionError(hasPermissionError);
    } catch (error) {
      console.error('Erro ao carregar pastas:', error);
    } finally {
      setCarregando(false);
    }
  };

  const handleNovaPasta = async (nomePasta: string) => {
    if (nomePasta.trim()) {
      try {
        const { success, permissionError: hasPermissionError } = await criarPasta(nomePasta.toLowerCase());

        if (hasPermissionError) {
          setPermissionError(true);
        }

        if (!success) {
          throw new Error("Falha ao criar pasta");
        }

        const novaPastaObj = {
          id: Date.now(),
          nome: nomePasta.toLowerCase(),
          documentos: [],
        };

        setPastas(prevPastas => [...prevPastas, novaPastaObj]);
        
        toast({
          title: "Pasta criada",
          description: "A pasta foi criada com sucesso."
        });

        await fetchPastas();
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

  const handleUpload = async (files: FileList) => {
    if (!pastaAberta) return;

    const novosDocumentos = await uploadDocumentos(pastaAberta, files);

    if (novosDocumentos.length > 0) {
      setPastas(prevPastas => prevPastas.map(pasta => {
        if (pasta.id === pastaAberta.id) {
          return {
            ...pasta,
            documentos: [...pasta.documentos, ...novosDocumentos],
          };
        }
        return pasta;
      }));

      setPastaAberta(prev => {
        if (!prev) return null;
        return {
          ...prev,
          documentos: [...prev.documentos, ...novosDocumentos]
        };
      });
    }
  };

  const handleRemoveDocumento = async (documentoId: number) => {
    if (!pastaAberta) return;

    const documento = pastaAberta.documentos.find(d => d.id === documentoId);
    if (!documento) return;

    const success = await removerDocumento(pastaAberta, documento);

    if (success) {
      setPastas(prevPastas => prevPastas.map(pasta => {
        if (pasta.id === pastaAberta.id) {
          return {
            ...pasta,
            documentos: pasta.documentos.filter(doc => doc.id !== documentoId),
          };
        }
        return pasta;
      }));

      setPastaAberta(prev => {
        if (!prev) return null;
        return {
          ...prev,
          documentos: prev.documentos.filter(doc => doc.id !== documentoId)
        };
      });
    }
  };

  const pastasFiltradas = filtrarPastas(pastas, searchTerm);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-foreground">Documentos</h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          {!permissionError && (
            <NovaPastaDialog onCriarPasta={handleNovaPasta} />
          )}
        </div>
      </div>

      {permissionError && <PermissionAlert />}

      {carregando ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : pastaAberta ? (
        <DetalhesPasta
          pasta={pastaAberta}
          onVoltar={() => setPastaAberta(null)}
          onUpload={handleUpload}
          onRemoveDocumento={handleRemoveDocumento}
          permissionError={permissionError}
        />
      ) : (
        <ListaPastas
          pastas={pastasFiltradas}
          onSelectPasta={setPastaAberta}
          permissionError={permissionError}
        />
      )}
    </div>
  );
};

export default Documentos;
