
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Documento {
  id: string;
  nome: string;
  data: string;
  tipo: string;
  url: string;
}

export const useClienteDocumentos = (clienteId: string | undefined) => {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDocumentos = async () => {
      if (!clienteId) return;
      
      try {
        const bucketName = `cliente-${clienteId}`;
        
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
  }, [clienteId]);

  const handleUploadDocumento = async (files: FileList | null) => {
    if (!clienteId || !files || files.length === 0) return;
    
    const bucketName = `cliente-${clienteId}`;
    
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
    if (!clienteId) return;
    
    const bucketName = `cliente-${clienteId}`;
    
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

  return {
    documentos,
    handleUploadDocumento,
    handleRemoveDocumento
  };
};
