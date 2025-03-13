
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClienteHeader } from "@/components/Carteira/ClienteHeader";
import { InformacoesTab } from "@/components/Carteira/InformacoesTab";
import { InteracoesTab } from "@/components/Carteira/InteracoesTab";
import { PagamentosTab } from "@/components/Carteira/PagamentosTab";
import { DocumentosTab } from "@/components/Carteira/DocumentosTab";
import { useClienteDetailContext } from "@/contexts/ClienteDetailContext";
import { ClienteLoading } from "@/components/Carteira/ClienteLoading";
import { ClienteNotFound } from "@/components/Carteira/ClienteNotFound";

export const ClienteDetalheContent = () => {
  const { 
    cliente, 
    loading, 
    interacoes, 
    documentos, 
    handleAddInteracao, 
    handleRemoveInteracao,
    handleUploadDocumento,
    handleRemoveDocumento,
    updateClienteFields
  } = useClienteDetailContext();

  if (loading) {
    return <ClienteLoading />;
  }

  if (!cliente) {
    return <ClienteNotFound />;
  }

  const handleUpdateClienteInfo = async (fields: Partial<{
    contato: string | null;
    entrada: string | null;
    prazo: string | null;
    negociacao: string | null;
    resolucao: string | null;
  }>) => {
    await updateClienteFields(fields);
  };

  return (
    <>
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
          <PagamentosTab 
            ultimoPagamento={cliente.ultimo_pagamento} 
            clienteId={cliente.id}
          />
        </TabsContent>
        
        <TabsContent value="documentos" className="space-y-4 mt-6">
          <DocumentosTab 
            documentos={documentos}
            onUploadDocumento={handleUploadDocumento}
            onRemoveDocumento={handleRemoveDocumento}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};
