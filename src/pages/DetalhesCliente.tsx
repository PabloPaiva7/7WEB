import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ClienteHeader } from "@/components/Carteira/ClienteHeader";
import { InformacoesTab } from "@/components/Carteira/InformacoesTab";
import { InteracoesTab } from "@/components/Carteira/InteracoesTab";
import { PagamentosTab } from "@/components/Carteira/PagamentosTab";
import { DocumentosTab } from "@/components/Carteira/DocumentosTab";

interface Cliente {
  id: string;
  contrato: string;
  banco: string | null;
  valor_cliente: number | null;
  escritorio: string | null;
  data: string | null;
  situacao: string | null;
  codigo: string | null;
  contato: string | null;
  created_at: string;
  entrada: string | null;
  negociacao: string | null;
  prazo: string | null;
  resolucao: string | null;
  ultimo_pagamento: string | null;
  upload_id: string | null;
}

interface Documento {
  id: string;
  nome: string;
  data: string;
  tipo: string;
  url: string;
}

interface Interacao {
  id: string;
  data: string;
  tipo: "pagamento" | "negociacao" | "contato" | "assessoria";
  conteudo: string;
  atendente: string;
}

const DetalhesCliente = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [interacoes, setInteracoes] = useState<Interacao[]>([]);

  useEffect(() => {
    const fetchCliente = async () => {
      if (!id) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from("carteira_clientes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erro ao buscar cliente:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os dados do cliente."
        });
        navigate("/");
        return;
      }

      if (data) {
        console.log("Dados do cliente:", data);
        setCliente(data);
      }
      
      setLoading(false);
    };

    fetchCliente();
  }, [id, navigate, toast]);

  useEffect(() => {
    const fetchDocumentos = async () => {
      if (!id) return;
      
      try {
        const bucketName = `cliente-${id}`;
        
        const { data, error } = await supabase.storage
          .from(bucketName)
          .list();

        if (error) {
          console.log("Nenhum documento encontrado ou bucket não existe:", error);
          return;
        }

        if (data) {
          const docs = data.map(file => ({
            id: file.id || String(Date.now() + Math.random()),
            nome: file.name,
            data: file.created_at || new Date().toISOString(),
            tipo: file.metadata?.mimetype || 'application/octet-stream',
            url: supabase.storage.from(bucketName).getPublicUrl(file.name).data.publicUrl
          }));
          
          setDocumentos(docs);
        }
      } catch (error) {
        console.error("Erro ao buscar documentos:", error);
      }
    };

    fetchDocumentos();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    
    const fetchInteracoes = async () => {
      try {
        const storedInteracoes = localStorage.getItem(`interacoes-cliente-${id}`);
        if (storedInteracoes) {
          setInteracoes(JSON.parse(storedInteracoes));
        }
      } catch (error) {
        console.error("Erro ao buscar interações:", error);
      }
    };

    fetchInteracoes();
  }, [id]);

  const handleUploadDocumento = async (files: FileList | null) => {
    if (!id || !files || files.length === 0) return;
    
    const bucketName = `cliente-${id}`;
    
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(b => b.name === bucketName);
      
      if (!bucketExists) {
        await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 52428800,
          allowedMimeTypes: [
            'image/jpeg',
            'image/png',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv',
            'application/zip',
            'text/plain'
          ]
        });
      }
      
      const uploadedDocs: Documento[] = [];
      
      for (const file of Array.from(files)) {
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(file.name, file);
          
        if (error) {
          console.error("Erro ao fazer upload:", error);
          toast({
            variant: "destructive",
            title: "Erro no upload",
            description: `Não foi possível enviar ${file.name}: ${error.message}`
          });
          continue;
        }
        
        if (data) {
          const url = supabase.storage.from(bucketName).getPublicUrl(file.name).data.publicUrl;
          
          uploadedDocs.push({
            id: String(Date.now() + Math.random()),
            nome: file.name,
            data: new Date().toISOString(),
            tipo: file.type,
            url
          });
          
          toast({
            title: "Upload concluído",
            description: `${file.name} foi enviado com sucesso.`
          });
        }
      }
      
      setDocumentos([...documentos, ...uploadedDocs]);
    } catch (error: any) {
      console.error("Erro ao processar upload:", error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: error.message || "Não foi possível fazer o upload dos documentos."
      });
    }
  };

  const handleRemoveDocumento = async (docNome: string) => {
    if (!id) return;
    
    const bucketName = `cliente-${id}`;
    
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([docNome]);
        
      if (error) throw error;
      
      setDocumentos(documentos.filter(doc => doc.nome !== docNome));
      
      toast({
        title: "Documento removido",
        description: "O documento foi removido com sucesso."
      });
    } catch (error) {
      console.error("Erro ao remover documento:", error);
      toast({
        variant: "destructive",
        title: "Erro ao remover",
        description: "Não foi possível remover o documento."
      });
    }
  };

  const handleAddInteracao = (interacao: {
    tipo: "pagamento" | "negociacao" | "contato" | "assessoria";
    conteudo: string;
    atendente: string;
  }) => {
    if (!id) return;
    
    const novaInteracao: Interacao = {
      id: String(Date.now()),
      data: new Date().toISOString(),
      ...interacao
    };
    
    const novasInteracoes = [novaInteracao, ...interacoes];
    setInteracoes(novasInteracoes);
    
    localStorage.setItem(`interacoes-cliente-${id}`, JSON.stringify(novasInteracoes));
    
    toast({
      title: "Interação adicionada",
      description: "A interação foi registrada com sucesso."
    });

    if (interacao.tipo === "pagamento") {
      updateClienteFields({ ultimo_pagamento: new Date().toISOString() });
    } else if (interacao.tipo === "negociacao") {
      updateClienteFields({ negociacao: new Date().toISOString() });
    } else if (interacao.tipo === "contato" && interacao.conteudo.includes("Código:")) {
      updateClienteFields({ codigo: interacao.conteudo.split("Código:")[1].trim() });
    }
  };

  const handleRemoveInteracao = (interacaoId: string) => {
    if (!id) return;
    
    const novasInteracoes = interacoes.filter(i => i.id !== interacaoId);
    setInteracoes(novasInteracoes);
    
    localStorage.setItem(`interacoes-cliente-${id}`, JSON.stringify(novasInteracoes));
    
    toast({
      title: "Interação removida",
      description: "A interação foi removida com sucesso."
    });
  };

  const handleUpdateClienteInfo = async (fields: Partial<{
    contato: string | null;
    entrada: string | null;
    prazo: string | null;
    negociacao: string | null;
    resolucao: string | null;
  }>) => {
    updateClienteFields(fields);
  };

  const updateClienteFields = async (fields: Partial<Cliente>) => {
    if (!id) return;
    
    try {
      const { error } = await supabase
        .from("carteira_clientes")
        .update(fields)
        .eq("id", id);
        
      if (error) throw error;
      
      if (cliente) {
        setCliente({ ...cliente, ...fields });
      }
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar os dados do cliente."
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Cliente não encontrado</h2>
        <Button onClick={() => navigate("/")}>Voltar para a lista</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate("/")} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">Detalhes do Cliente</h1>
      </div>

      <ClienteHeader cliente={cliente} />

      <Tabs defaultValue="informacoes">
        <TabsList className="grid grid-cols-4 w-full lg:w-[500px]">
          <TabsTrigger value="informacoes">Informações</TabsTrigger>
          <TabsTrigger value="interacoes">Interações</TabsTrigger>
          <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="informacoes" className="space-y-4 mt-6">
          <InformacoesTab
            cliente={cliente}
            onUpdateCliente={handleUpdateClienteInfo}
          />
        </TabsContent>

        <TabsContent value="interacoes" className="space-y-4 mt-6">
          <InteracoesTab 
            interacoes={interacoes}
            onAddInteracao={handleAddInteracao}
            onRemoveInteracao={handleRemoveInteracao}
          />
        </TabsContent>
        
        <TabsContent value="pagamentos" className="space-y-4 mt-6">
          <PagamentosTab ultimoPagamento={cliente.ultimo_pagamento} />
        </TabsContent>
        
        <TabsContent value="documentos" className="space-y-4 mt-6">
          <DocumentosTab 
            documentos={documentos}
            onUploadDocumento={handleUploadDocumento}
            onRemoveDocumento={handleRemoveDocumento}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetalhesCliente;
