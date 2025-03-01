
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  InfoIcon, 
  HelpCircle, 
  Percent, 
  DollarSign, 
  Award, 
  PieChart, 
  Users,
  Bell,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileText
} from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define task type interface
interface Task {
  id: number;
  title: string;
  priority: "alta" | "média" | "baixa";
  dueDate: string;
  completed: boolean;
  type: "contrato" | "pagamento" | "relatório" | "administrativo";
}

const Painel = () => {
  // Initial tasks state
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Atualizar status de contratos (5)", priority: "alta", dueDate: "Hoje", completed: false, type: "contrato" },
    { id: 2, title: "Contactar clientes com pagamentos em atraso", priority: "média", dueDate: "em 2 dias", completed: false, type: "pagamento" },
    { id: 3, title: "Preparar relatório semanal", priority: "média", dueDate: "em 3 dias", completed: false, type: "relatório" },
    { id: 4, title: "Arquivar documentos", priority: "baixa", dueDate: "em 5 dias", completed: false, type: "administrativo" },
  ]);

  // Function to toggle task completion
  const toggleTaskCompletion = (taskId: number) => {
    setTasks(
      tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Count task types
  const taskTypeCount = {
    contrato: tasks.filter(task => task.type === "contrato" && task.completed).length,
    pagamento: tasks.filter(task => task.type === "pagamento" && task.completed).length,
    relatório: tasks.filter(task => task.type === "relatório" && task.completed).length,
    administrativo: tasks.filter(task => task.type === "administrativo" && task.completed).length,
  };

  // Count tasks by priority
  const priorityCount = {
    alta: tasks.filter(task => task.priority === "alta" && task.completed).length,
    média: tasks.filter(task => task.priority === "média" && task.completed).length,
    baixa: tasks.filter(task => task.priority === "baixa" && task.completed).length,
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Painel do Colaborador</h1>
      </div>

      {/* Avisos importantes - seção fixa no topo */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-amber-800">
            <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
            Avisos Importantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-2 rounded bg-white">
              <Bell className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Reunião de equipe</p>
                <p className="text-sm text-muted-foreground">Hoje às 15h na sala de conferência - Discussão de metas do trimestre</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 rounded bg-white">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Sistema de pagamentos em manutenção</p>
                <p className="text-sm text-muted-foreground">Amanhã das 8h às 10h - Utilize procedimentos manuais durante este período</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 rounded bg-white">
              <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Novo procedimento de verificação</p>
                <p className="text-sm text-muted-foreground">A partir de 01/06 - Todos os contratos precisarão passar pela etapa de verificação adicional</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 rounded bg-white">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Meta mensal atingida</p>
                <p className="text-sm text-muted-foreground">Parabéns! A equipe atingiu 105% da meta de conversão para o mês de maio</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 rounded bg-white">
              <Calendar className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Feriado próximo</p>
                <p className="text-sm text-muted-foreground">09/06 será feriado municipal - Planeje suas entregas com antecedência</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="lembretes">
        <TabsList className="grid grid-cols-6 w-full max-w-4xl mb-6">
          <TabsTrigger value="lembretes">Lembretes</TabsTrigger>
          <TabsTrigger value="tarefas">Tarefas</TabsTrigger>
          <TabsTrigger value="assessorias">Assessorias</TabsTrigger>
          <TabsTrigger value="ofertas">Ofertas</TabsTrigger>
          <TabsTrigger value="descontos">Descontos</TabsTrigger>
          <TabsTrigger value="suporte">Suporte</TabsTrigger>
        </TabsList>

        <TabsContent value="lembretes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                Lembretes e Próximos Eventos
              </CardTitle>
              <CardDescription>
                Compromissos importantes para os próximos dias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium">Entrega de relatórios</h3>
                      <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">Amanhã</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Prazo final para envio dos relatórios mensais de desempenho.
                    </p>
                    <Button className="mt-4 w-full" variant="outline">Marcar como concluído</Button>
                  </CardContent>
                </Card>

                <Card className="border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium">Treinamento de sistemas</h3>
                      <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">Em 3 dias</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Treinamento obrigatório sobre as novas funcionalidades do sistema de gestão.
                    </p>
                    <Button className="mt-4 w-full" variant="outline">Ver detalhes</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tarefas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                Dashboard de Progresso
              </CardTitle>
              <CardDescription>
                Acompanhamento de tarefas concluídas e pendentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Progresso Geral</h3>
                  <div className="flex items-baseline mb-2">
                    <span className="text-2xl font-bold mr-2">{completionPercentage}%</span>
                    <span className="text-sm text-gray-500">concluído</span>
                  </div>
                  <Progress value={completionPercentage} className="h-2 mb-2" />
                  <p className="text-sm text-gray-500">{completedTasks} de {totalTasks} tarefas</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Por Tipo</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Contratos</span>
                        <span className="font-medium">{taskTypeCount.contrato}</span>
                      </div>
                      <Progress value={(taskTypeCount.contrato / Math.max(1, completedTasks)) * 100} className="h-1.5 bg-blue-100" indicatorClassName="bg-blue-500" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Pagamentos</span>
                        <span className="font-medium">{taskTypeCount.pagamento}</span>
                      </div>
                      <Progress value={(taskTypeCount.pagamento / Math.max(1, completedTasks)) * 100} className="h-1.5 bg-green-100" indicatorClassName="bg-green-500" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Relatórios</span>
                        <span className="font-medium">{taskTypeCount.relatório}</span>
                      </div>
                      <Progress value={(taskTypeCount.relatório / Math.max(1, completedTasks)) * 100} className="h-1.5 bg-amber-100" indicatorClassName="bg-amber-500" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Administrativo</span>
                        <span className="font-medium">{taskTypeCount.administrativo}</span>
                      </div>
                      <Progress value={(taskTypeCount.administrativo / Math.max(1, completedTasks)) * 100} className="h-1.5 bg-purple-100" indicatorClassName="bg-purple-500" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Por Prioridade</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Alta</span>
                        <span className="font-medium">{priorityCount.alta}</span>
                      </div>
                      <Progress value={(priorityCount.alta / Math.max(1, completedTasks)) * 100} className="h-1.5 bg-red-100" indicatorClassName="bg-red-500" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Média</span>
                        <span className="font-medium">{priorityCount.média}</span>
                      </div>
                      <Progress value={(priorityCount.média / Math.max(1, completedTasks)) * 100} className="h-1.5 bg-orange-100" indicatorClassName="bg-orange-500" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Baixa</span>
                        <span className="font-medium">{priorityCount.baixa}</span>
                      </div>
                      <Progress value={(priorityCount.baixa / Math.max(1, completedTasks)) * 100} className="h-1.5 bg-blue-100" indicatorClassName="bg-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Status</TableHead>
                    <TableHead>Tarefa</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map(task => (
                    <TableRow key={task.id} className={task.completed ? "bg-gray-50" : ""}>
                      <TableCell>
                        <input 
                          type="checkbox" 
                          checked={task.completed} 
                          onChange={() => toggleTaskCompletion(task.id)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell className={task.completed ? "line-through text-gray-500" : ""}>
                        {task.title}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          task.type === "contrato" ? "bg-blue-100 text-blue-700" :
                          task.type === "pagamento" ? "bg-green-100 text-green-700" :
                          task.type === "relatório" ? "bg-amber-100 text-amber-700" :
                          "bg-purple-100 text-purple-700"
                        }`}>
                          {task.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          task.priority === "alta" ? "bg-red-100 text-red-700" :
                          task.priority === "média" ? "bg-orange-100 text-orange-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {task.priority}
                        </span>
                      </TableCell>
                      <TableCell>{task.dueDate}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">Detalhes</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-4 flex justify-end">
                <Button size="sm">Adicionar tarefa</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessorias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <InfoIcon className="mr-2 h-5 w-5 text-blue-500" />
                Serviços de Assessoria
              </CardTitle>
              <CardDescription>
                Informações sobre assessorias disponíveis para atendimento a clientes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium">Assessoria Jurídica</h3>
                    <div className="flex items-center mt-2 text-sm text-green-600">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      Disponível agora
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Para casos de contratos, revisões e reclamações legais.
                    </p>
                    <div className="mt-4 space-y-2">
                      <p className="text-sm">
                        <span className="font-semibold">Contato:</span> (11) 3333-4444
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Plantão:</span> Dr. Marcos Silva
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Email:</span> juridico@exemplo.com
                      </p>
                    </div>
                    <Button className="mt-4 w-full" variant="outline">Solicitar atendimento</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium">Assessoria Financeira</h3>
                    <div className="flex items-center mt-2 text-sm text-yellow-600">
                      <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                      Disponível em 1 hora
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Para análise financeira, regularização e negociações.
                    </p>
                    <div className="mt-4 space-y-2">
                      <p className="text-sm">
                        <span className="font-semibold">Contato:</span> (11) 5555-6666
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Plantão:</span> Ana Oliveira
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Email:</span> financeiro@exemplo.com
                      </p>
                    </div>
                    <Button className="mt-4 w-full" variant="outline">Solicitar atendimento</Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium mb-3">Escala semanal de plantões</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-2">Dia</th>
                          <th className="text-left py-2 px-2">Jurídico</th>
                          <th className="text-left py-2 px-2">Financeiro</th>
                          <th className="text-left py-2 px-2">Contábil</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 px-2">Segunda</td>
                          <td className="py-2 px-2">Dr. Marcos</td>
                          <td className="py-2 px-2">Ana</td>
                          <td className="py-2 px-2">Carlos</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-2">Terça</td>
                          <td className="py-2 px-2">Dra. Luiza</td>
                          <td className="py-2 px-2">Roberto</td>
                          <td className="py-2 px-2">Fernanda</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-2">Quarta</td>
                          <td className="py-2 px-2">Dr. Paulo</td>
                          <td className="py-2 px-2">Ana</td>
                          <td className="py-2 px-2">Carlos</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-2">Quinta</td>
                          <td className="py-2 px-2">Dra. Luiza</td>
                          <td className="py-2 px-2">Roberto</td>
                          <td className="py-2 px-2">Fernanda</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-2">Sexta</td>
                          <td className="py-2 px-2">Dr. Marcos</td>
                          <td className="py-2 px-2">Ana</td>
                          <td className="py-2 px-2">Carlos</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ofertas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-yellow-500" />
                Ofertas Especiais Ativas
              </CardTitle>
              <CardDescription>
                Ofertas exclusivas para apresentar aos clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-blue-700">Plano Premium</h3>
                      <span className="bg-blue-200 text-xs font-semibold px-2 py-1 rounded text-blue-700">Novo</span>
                    </div>
                    <p className="text-sm text-blue-600 mt-2">
                      Acesso ilimitado a todos os serviços com 20% de desconto para novos contratos.
                    </p>
                    <div className="mt-3 text-xs text-blue-600 space-y-1">
                      <p><span className="font-semibold">Validade:</span> 30/06/2023</p>
                      <p><span className="font-semibold">Código da promoção:</span> PREM22</p>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">Ver detalhes</Button>
                      <Button className="w-full" variant="outline">Compartilhar</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-green-700">Consultoria Grátis</h3>
                      <span className="bg-green-200 text-xs font-semibold px-2 py-1 rounded text-green-700">Popular</span>
                    </div>
                    <p className="text-sm text-green-600 mt-2">
                      Primeira consultoria gratuita para clientes indicados.
                    </p>
                    <div className="mt-3 text-xs text-green-600 space-y-1">
                      <p><span className="font-semibold">Validade:</span> 15/07/2023</p>
                      <p><span className="font-semibold">Código da promoção:</span> INDIC1</p>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button className="w-full bg-green-600 hover:bg-green-700">Ver detalhes</Button>
                      <Button className="w-full" variant="outline">Compartilhar</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-purple-700">Pacote Empresarial</h3>
                      <span className="bg-purple-200 text-xs font-semibold px-2 py-1 rounded text-purple-700">Limitado</span>
                    </div>
                    <p className="text-sm text-purple-600 mt-2">
                      Soluções completas para empresas com condições especiais e desconto progressivo.
                    </p>
                    <div className="mt-3 text-xs text-purple-600 space-y-1">
                      <p><span className="font-semibold">Validade:</span> 10/07/2023</p>
                      <p><span className="font-semibold">Código da promoção:</span> CORP23</p>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">Ver detalhes</Button>
                      <Button className="w-full" variant="outline">Compartilhar</Button>
                    </div>
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
                Descontos Autorizados
              </CardTitle>
              <CardDescription>
                Descontos que podem ser aplicados nos contratos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h3 className="text-lg font-medium">Desconto Sazonal</h3>
                    <p className="text-sm text-muted-foreground">15% para contratos fechados até 31/07</p>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="font-semibold">Aplicável a:</span> Todos os serviços
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="font-semibold">Aprovação:</span> Automática
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">15%</div>
                    <Button variant="outline" size="sm" className="mt-2">Aplicar</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h3 className="text-lg font-medium">Pacote Família</h3>
                    <p className="text-sm text-muted-foreground">20% para mais de um contrato no mesmo CPF</p>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="font-semibold">Aplicável a:</span> Pessoa física
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="font-semibold">Aprovação:</span> Coordenador
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">20%</div>
                    <Button variant="outline" size="sm" className="mt-2">Solicitar</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h3 className="text-lg font-medium">Renovação Antecipada</h3>
                    <p className="text-sm text-muted-foreground">10% para renovações com 30 dias de antecedência</p>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="font-semibold">Aplicável a:</span> Contratos existentes
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="font-semibold">Aprovação:</span> Automática
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">10%</div>
                    <Button variant="outline" size="sm" className="mt-2">Aplicar</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h3 className="text-lg font-medium">Desconto Especial</h3>
                    <p className="text-sm text-muted-foreground">Até 30% para casos específicos autorizados pela gerência</p>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="font-semibold">Aplicável a:</span> Casos especiais
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="font-semibold">Aprovação:</span> Gerência
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">30%</div>
                    <Button variant="outline" size="sm" className="mt-2">Solicitar</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suporte" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-indigo-500" />
                Suporte e Recursos
              </CardTitle>
              <CardDescription>
                Canais de suporte e materiais de apoio para colaboradores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Canais de Suporte</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="bg-indigo-100 p-2 rounded-full">
                        <InfoIcon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Suporte Técnico TI</h4>
                        <p className="text-sm text-muted-foreground">Para problemas com sistemas e equipamentos</p>
                        <p className="text-sm mt-1">
                          <span className="font-semibold">Contato:</span> (11) 4444-5555 | suporte@exemplo.com
                        </p>
                        <p className="text-sm text-indigo-600">
                          Horário: 8h às 18h (dias úteis)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <HelpCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Suporte Operacional</h4>
                        <p className="text-sm text-muted-foreground">Para dúvidas sobre processos e procedimentos</p>
                        <p className="text-sm mt-1">
                          <span className="font-semibold">Contato:</span> (11) 4444-6666 | operacional@exemplo.com
                        </p>
                        <p className="text-sm text-blue-600">
                          Horário: 9h às 17h (dias úteis)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Materiais de Apoio</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Manual de Processos</p>
                          <p className="text-sm text-muted-foreground">v2.3 - Atualizado em 15/05/2023</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">Download</Button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Tabela de Valores e Condições</p>
                          <p className="text-sm text-muted-foreground">Vigência: Jun-Jul/2023</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">Download</Button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Perguntas Frequentes</p>
                          <p className="text-sm text-muted-foreground">Guia de respostas para clientes</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">Download</Button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Modelos de Documentos</p>
                          <p className="text-sm text-muted-foreground">Templates para uso diário</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">Download</Button>
                    </div>
                  </div>
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
