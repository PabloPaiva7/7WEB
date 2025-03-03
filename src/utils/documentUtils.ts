
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface Documento {
  id: number;
  nome: string;
  data: string;
  tipo: string;
  url?: string;
}

export interface Pasta {
  id: number;
  nome: string;
  documentos: Documento[];
}

// Lista de pastas predefinidas que já foram criadas no Supabase
export const pastasPredefinidas = [
  "minutas",
  "procuracoes",
  "prints",
  "boletos",
  "comprovantes",
  "notificacoes_extrajudiciais"
];

// Mapeamento de nomes para exibição
export const pastasDisplay: Record<string, string> = {
  "minutas": "MINUTAS",
  "procuracoes": "PROCURAÇÕES",
  "prints": "PRINTS",
  "boletos": "BOLETOS",
  "comprovantes": "COMPROVANTES",
  "notificacoes_extrajudiciais": "NOTIFICAÇÕES EXTRAJUDICIAIS"
};

export const getNomePastaDisplay = (nome: string) => {
  return pastasDisplay[nome] || nome.toUpperCase();
};

export const carregarPastas = async (): Promise<{ 
  pastas: Pasta[], 
  permissionError: boolean 
}> => {
  try {
    // Carregar todas as pastas existentes
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error("Erro ao listar buckets:", bucketsError);
      if (bucketsError.message?.includes("violates row-level security policy")) {
        return { pastas: [], permissionError: true };
      }
      throw bucketsError;
    }
    
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

    return { pastas: pastasCarregadas, permissionError: false };
  } catch (error) {
    console.error('Erro ao carregar pastas:', error);
    toast({
      variant: "destructive",
      title: "Erro ao carregar pastas",
      description: "Não foi possível carregar as pastas e documentos."
    });
    return { pastas: [], permissionError: false };
  }
};

export const criarPasta = async (nomePasta: string): Promise<{ success: boolean, permissionError: boolean }> => {
  try {
    // Verificar se o bucket já existe
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExiste = buckets?.some(b => b.name === nomePasta);
    
    if (bucketExiste) {
      console.log(`Bucket ${nomePasta} já existe.`);
      return { success: true, permissionError: false };
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
        return { success: false, permissionError: true };
      }
      return { success: false, permissionError: false };
    }
    
    return { success: true, permissionError: false };
  } catch (error: any) {
    console.error(`Erro ao criar pasta ${nomePasta}:`, error);
    const permissionError = error.message?.includes("violates row-level security policy");
    return { success: false, permissionError };
  }
};

export const uploadDocumentos = async (pasta: Pasta, files: FileList): Promise<Documento[]> => {
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

  return novosDocumentos;
};

export const removerDocumento = async (pasta: Pasta, documento: Documento): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(pasta.nome)
      .remove([documento.nome]);

    if (error) throw error;

    toast({
      title: "Documento removido",
      description: "O documento foi removido com sucesso."
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao remover documento:', error);
    toast({
      variant: "destructive",
      title: "Erro ao remover",
      description: "Não foi possível remover o documento."
    });
    return false;
  }
};

export const filtrarPastas = (pastas: Pasta[], searchTerm: string): Pasta[] => {
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
