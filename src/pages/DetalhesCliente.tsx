
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Download, DollarSign, FileText, Mail, Phone, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

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

const DetalhesCliente = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

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

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">{cliente.contrato}</h2>
              </div>
              
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                cliente.situacao === "Em andamento" 
                  ? "bg-blue-100 text-blue-800" 
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {cliente.situacao || 'Pendente'}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Banco</p>
                  <p className="font-medium">{cliente.banco || "Não informado"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Escritório</p>
                  <p className="font-medium">{cliente.escritorio || "Não informado"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Código</p>
                  <p className="font-medium">{cliente.codigo || "Não informado"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de Entrada</p>
                  <p className="font-medium">
                    {cliente.data ? new Date(cliente.data).toLocaleDateString('pt-BR') : "Não informado"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-primary/5 rounded-lg space-y-3">
              <DollarSign className="h-8 w-8 text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Valor</p>
              <p className="text-3xl font-bold text-primary">
                {cliente.valor_cliente 
                  ? new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(cliente.valor_cliente)
                  : 'R$ 0,00'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  <p className="font-medium">{cliente.contato || "Não informado"}</p>
                </div>
                {/* Adicione mais informações de contato quando disponíveis */}
              </div>
              
              <Separator className="my-4" />
              
              <h3 className="text-lg font-semibold flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Datas Importantes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Data de Entrada</p>
                  <p className="font-medium">
                    {cliente.entrada ? new Date(cliente.entrada).toLocaleDateString('pt-BR') : "Não informado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prazo</p>
                  <p className="font-medium">
                    {cliente.prazo ? new Date(cliente.prazo).toLocaleDateString('pt-BR') : "Não informado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Negociação</p>
                  <p className="font-medium">
                    {cliente.negociacao ? new Date(cliente.negociacao).toLocaleDateString('pt-BR') : "Não informado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Resolução</p>
                  <p className="font-medium">
                    {cliente.resolucao ? new Date(cliente.resolucao).toLocaleDateString('pt-BR') : "Não informado"}
                  </p>
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
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Adicionar Documento
                </Button>
              </div>
              
              {/* Documentos aqui */}
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum documento disponível</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetalhesCliente;
