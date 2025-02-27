
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { InfoIcon, HelpCircle, Percent, DollarSign, Award, PieChart, Users } from "lucide-react";

const Painel = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Painel Informativo</h1>
      </div>

      <Tabs defaultValue="assessorias">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl mb-6">
          <TabsTrigger value="assessorias">Assessorias</TabsTrigger>
          <TabsTrigger value="ofertas">Ofertas</TabsTrigger>
          <TabsTrigger value="descontos">Descontos</TabsTrigger>
          <TabsTrigger value="numeros">Números</TabsTrigger>
          <TabsTrigger value="perguntas">Perguntas</TabsTrigger>
        </TabsList>

        <TabsContent value="assessorias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <InfoIcon className="mr-2 h-5 w-5 text-blue-500" />
                Informações sobre Assessorias
              </CardTitle>
              <CardDescription>
                Detalhes e contatos de assessorias disponíveis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium">Assessoria Jurídica</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Disponível para todos os clientes com contrato ativo.
                    </p>
                    <p className="text-sm mt-4">
                      <span className="font-semibold">Contato:</span> (11) 3333-4444
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Email:</span> juridico@exemplo.com
                    </p>
                    <Button className="mt-4 w-full" variant="outline">Ver detalhes</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium">Assessoria Financeira</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Análise e consultoria para gestão financeira.
                    </p>
                    <p className="text-sm mt-4">
                      <span className="font-semibold">Contato:</span> (11) 5555-6666
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Email:</span> financeiro@exemplo.com
                    </p>
                    <Button className="mt-4 w-full" variant="outline">Ver detalhes</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ofertas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-yellow-500" />
                Ofertas Especiais
              </CardTitle>
              <CardDescription>
                Ofertas exclusivas para nossos clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium text-blue-700">Plano Premium</h3>
                    <p className="text-sm text-blue-600 mt-2">
                      Acesso ilimitado a todos os serviços com 20% de desconto.
                    </p>
                    <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700">Saiba mais</Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium text-green-700">Consultoria Grátis</h3>
                    <p className="text-sm text-green-600 mt-2">
                      Primeira consultoria gratuita para novos clientes.
                    </p>
                    <Button className="mt-4 w-full bg-green-600 hover:bg-green-700">Saiba mais</Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium text-purple-700">Pacote Empresarial</h3>
                    <p className="text-sm text-purple-600 mt-2">
                      Soluções completas para empresas com condições especiais.
                    </p>
                    <Button className="mt-4 w-full bg-purple-600 hover:bg-purple-700">Saiba mais</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="descontos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Percent className="mr-2 h-5 w-5 text-green-500" />
                Descontos Ativos
              </CardTitle>
              <CardDescription>
                Descontos e promoções disponíveis atualmente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h3 className="text-lg font-medium">Desconto Sazonal</h3>
                    <p className="text-sm text-muted-foreground">15% para contratos fechados até 31/12</p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">15%</div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h3 className="text-lg font-medium">Pacote Família</h3>
                    <p className="text-sm text-muted-foreground">20% para mais de um contrato no mesmo CPF</p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">20%</div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h3 className="text-lg font-medium">Renovação Antecipada</h3>
                    <p className="text-sm text-muted-foreground">10% para renovações com 30 dias de antecedência</p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">10%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="numeros" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="mr-2 h-5 w-5 text-indigo-500" />
                Números e Estatísticas
              </CardTitle>
              <CardDescription>
                Informações numéricas relevantes para análise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="text-center p-6">
                  <DollarSign className="h-10 w-10 text-green-500 mx-auto mb-2" />
                  <h3 className="text-3xl font-bold">R$ 1.5M</h3>
                  <p className="text-sm text-muted-foreground">Valor total em contratos</p>
                </Card>

                <Card className="text-center p-6">
                  <Users className="h-10 w-10 text-blue-500 mx-auto mb-2" />
                  <h3 className="text-3xl font-bold">250+</h3>
                  <p className="text-sm text-muted-foreground">Clientes ativos</p>
                </Card>

                <Card className="text-center p-6">
                  <Award className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                  <h3 className="text-3xl font-bold">97%</h3>
                  <p className="text-sm text-muted-foreground">Taxa de satisfação</p>
                </Card>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-4">Distribuição por Tipo de Contrato</h3>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Gráfico será implementado em breve
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="perguntas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="mr-2 h-5 w-5 text-orange-500" />
                Perguntas Frequentes
              </CardTitle>
              <CardDescription>
                Respostas para as dúvidas mais comuns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-medium mb-2">Como calcular o valor do contrato?</h3>
                  <p className="text-muted-foreground">
                    O valor do contrato é calculado com base no montante em questão, prazo de duração e tipo de serviço solicitado. Utilize nossa calculadora para uma estimativa personalizada.
                  </p>
                </div>

                <div className="border-b pb-4">
                  <h3 className="text-lg font-medium mb-2">Quais documentos são necessários?</h3>
                  <p className="text-muted-foreground">
                    Os documentos básicos são: identidade, CPF, comprovante de residência e documentação específica relacionada ao caso. A lista completa será fornecida durante a consulta inicial.
                  </p>
                </div>

                <div className="border-b pb-4">
                  <h3 className="text-lg font-medium mb-2">Qual o prazo médio de resolução?</h3>
                  <p className="text-muted-foreground">
                    O prazo varia conforme a complexidade do caso, mas em média os processos são concluídos em 3 a 6 meses. Casos mais complexos podem levar até 12 meses.
                  </p>
                </div>

                <div className="border-b pb-4">
                  <h3 className="text-lg font-medium mb-2">Como acompanhar o andamento do processo?</h3>
                  <p className="text-muted-foreground">
                    Você pode acompanhar todas as atualizações através da plataforma online, além de receber notificações por e-mail. Também disponibilizamos atendimento por telefone.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Posso cancelar o contrato?</h3>
                  <p className="text-muted-foreground">
                    Sim, os contratos podem ser cancelados conforme as condições estabelecidas no termo de adesão. Geralmente há um aviso prévio de 30 dias e possíveis taxas administrativas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Painel;
