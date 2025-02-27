
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Download, DollarSign, FileText, Mail, Phone, User, Save, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

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

const DetalhesCliente = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Formulário para edição das informações
  const form = useForm<Cliente>({
    defaultValues: {
      contrato: "",
      banco: "",
      valor_cliente: 0,
      escritorio: "",
      codigo: "",
      contato: "",
      entrada: "",
      prazo: "",
      negociacao: "",
      resolucao: "",
      situacao: "",
    }
  });

  // Buscar dados do cliente
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
        // Preencher o formulário com os dados
        form.reset({
          ...data,
          // Converter valores nulos para strings vazias para o formulário
          banco: data.banco || "",
          escritorio: data.escritorio || "",
          codigo: data.codigo || "",
          contato: data.contato || "",
          entrada: data.entrada || "",
          prazo: data.prazo || "",
          negociacao: data.negociacao || "",
          resolucao: data.resolucao || "",
          situacao: data.situacao || ""
        });
      }
      
      setLoading(false);
    };

    fetchCliente();
  }, [id, navigate, toast, form]);

  // Buscar documentos do cliente
  useEffect(() => {
    const fetchDocumentos = async () => {
      if (!id) return;
      
      try {
        // Verificar se existe um bucket para este cliente
        const bucketName = `cliente-${id}`;
        
        // Listar arquivos do cliente
        const { data, error } = await supabase.storage
          .from(bucketName)
          .list();

        if (error) {
          // Bucket pode não existir ainda
          console.log("Nenhum documento encontrado ou bucket não existe:", error);
          return;
        }

        if (data) {
          // Converter para o formato de documentos
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

  // Salvar alterações do cliente
  const salvarAlteracoes = async (data: Cliente) => {
    if (!id || !cliente) return;
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from("carteira_clientes")
        .update({
          contrato: data.contrato,
          banco: data.banco,
          valor_cliente: data.valor_cliente,
          escritorio: data.escritorio,
          codigo: data.codigo,
          contato: data.contato,
          entrada: data.entrada,
          prazo: data.prazo,
          negociacao: data.negociacao,
          resolucao: data.resolucao,
          situacao: data.situacao,
        })
        .eq("id", id);

      if (error) throw error;
      
      // Atualizar cliente local
      setCliente({
        ...cliente,
        ...data
      });
      
      setIsEditing(false);
      toast({
        title: "Alterações salvas",
        description: "As informações do cliente foram atualizadas com sucesso."
      });
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações."
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Upload de documentos
  const handleUploadDocumento = async (files: FileList | null) => {
    if (!id || !files || files.length === 0) return;
    
    // Criar bucket para o cliente se não existir
    const bucketName = `cliente-${id}`;
    
    try {
      // Verificar se o bucket existe e criar se não existir
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(b => b.name === bucketName);
      
      if (!bucketExists) {
        await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 52428800, // 50MB
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
      
      // Upload dos arquivos
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
      
      // Atualizar lista de documentos
      setDocumentos([...documentos, ...uploadedDocs]);
      setUploadDialogOpen(false);
    } catch (error: any) {
      console.error("Erro ao processar upload:", error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: error.message || "Não foi possível fazer o upload dos documentos."
      });
    }
  };

  // Remover documento
  const handleRemoveDocumento = async (docNome: string) => {
    if (!id) return;
    
    const bucketName = `cliente-${id}`;
    
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([docNome]);
        
      if (error) throw error;
      
      // Atualizar lista de documentos
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
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate("/")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-semibold text-foreground">Detalhes do Cliente</h1>
        </div>
        
        {isEditing ? (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button 
              onClick={form.handleSubmit(salvarAlteracoes)}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent rounded-full" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            Editar Informações
          </Button>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(salvarAlteracoes)}>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-primary" />
                    {isEditing ? (
                      <FormField
                        control={form.control}
                        name="contrato"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="Nome do contrato" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <h2 className="text-xl font-semibold">{cliente.contrato}</h2>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name="situacao"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Situação" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      cliente.situacao === "Em andamento" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {cliente.situacao || 'Pendente'}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Banco</p>
                      {isEditing ? (
                        <FormField
                          control={form.control}
                          name="banco"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Banco" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <p className="font-medium">{cliente.banco || "Não informado"}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Escritório</p>
                      {isEditing ? (
                        <FormField
                          control={form.control}
                          name="escritorio"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Escritório" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <p className="font-medium">{cliente.escritorio || "Não informado"}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Código</p>
                      {isEditing ? (
                        <FormField
                          control={form.control}
                          name="codigo"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Código" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <p className="font-medium">{cliente.codigo || "Não informado"}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Data de Entrada</p>
                      {isEditing ? (
                        <FormField
                          control={form.control}
                          name="data"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <p className="font-medium">
                          {cliente.data ? new Date(cliente.data).toLocaleDateString('pt-BR') : "Não informado"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-6 bg-primary/5 rounded-lg space-y-3">
                  <DollarSign className="h-8 w-8 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Valor</p>
                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name="valor_cliente"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <p className="text-3xl font-bold text-primary">
                      {cliente.valor_cliente 
                        ? new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(cliente.valor_cliente)
                        : 'R$ 0,00'
                      }
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>

      <Tabs defaultValue="informacoes">
        <TabsList className="grid grid-cols-3 w-full lg:w-[400px]">
          <TabsTrigger value="informacoes">Informações</TabsTrigger>
          <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="informacoes" className="space-y-4 mt-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                Informações de Contato
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Contato</p>
                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name="contato"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Contato" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <p className="font-medium">{cliente.contato || "Não informado"}</p>
                  )}
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <h3 className="text-lg font-semibold flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Datas Importantes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Data de Entrada</p>
                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name="entrada"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <p className="font-medium">
                      {cliente.entrada ? new Date(cliente.entrada).toLocaleDateString('pt-BR') : "Não informado"}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prazo</p>
                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name="prazo"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <p className="font-medium">
                      {cliente.prazo ? new Date(cliente.prazo).toLocaleDateString('pt-BR') : "Não informado"}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Negociação</p>
                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name="negociacao"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <p className="font-medium">
                      {cliente.negociacao ? new Date(cliente.negociacao).toLocaleDateString('pt-BR') : "Não informado"}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Resolução</p>
                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name="resolucao"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <p className="font-medium">
                      {cliente.resolucao ? new Date(cliente.resolucao).toLocaleDateString('pt-BR') : "Não informado"}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pagamentos" className="space-y-4 mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                Histórico de Pagamentos
              </h3>
              
              {cliente.ultimo_pagamento ? (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Último Pagamento</p>
                  <p className="font-medium">
                    {new Date(cliente.ultimo_pagamento).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum pagamento registrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documentos" className="space-y-4 mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Documentos do Cliente
                </h3>
                
                <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Upload className="mr-2 h-4 w-4" />
                      Adicionar Documento
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload de Documento</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="documento-upload">Selecione os arquivos</Label>
                        <Input 
                          id="documento-upload" 
                          type="file" 
                          multiple
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.zip,.txt"
                          onChange={(e) => handleUploadDocumento(e.target.files)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Formatos aceitos: PDF, Word, Excel, CSV, imagens, ZIP, TXT (máx. 50MB)
                        </p>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          const fileInput = document.getElementById('documento-upload') as HTMLInputElement;
                          handleUploadDocumento(fileInput?.files || null);
                        }}
                      >
                        Enviar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              {documentos.length > 0 ? (
                <div className="space-y-3">
                  {documentos.map((doc) => (
                    <div 
                      key={doc.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
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
                        onClick={() => handleRemoveDocumento(doc.nome)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum documento disponível</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Adicione documentos clicando no botão acima
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetalhesCliente;
