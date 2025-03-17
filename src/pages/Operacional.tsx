
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  PencilLine, 
  FileSignature, 
  ScrollText, 
  Receipt, 
  AlertCircle, 
  KeyRound, 
  FileCheck, 
  FileText, 
  Plus, 
  Check, 
  X, 
  Calendar, 
  User,
  Clock
} from "lucide-react";

const Operacional = () => {
  const [activeTab, setActiveTab] = useState("anotacoes");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleAddItem = (type: string) => {
    setDialogType(type);
    setSelectedItem(null);
    setOpenDialog(true);
  };

  const handleCardClick = (type: string, item: any) => {
    setDialogType(`view-${type}`);
    setSelectedItem(item);
    setOpenDialog(true);
  };

  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Operacional</h1>
        <p className="text-muted-foreground">
          Acompanhamento e gerenciamento das etapas operacionais de contratos.
        </p>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="anotacoes" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 gap-2 mb-12">
          <div className="col-span-4 grid grid-cols-4 gap-2">
            <TabsTrigger value="anotacoes" className="flex flex-col items-center gap-1 py-2">
              <PencilLine className="h-4 w-4" />
              <span>Anotações</span>
            </TabsTrigger>
            <TabsTrigger value="minutas-assinar" className="flex flex-col items-center gap-1 py-2">
              <FileSignature className="h-4 w-4" />
              <span>Minutas Para Assinar</span>
            </TabsTrigger>
            <TabsTrigger value="procuracoes" className="flex flex-col items-center gap-1 py-2">
              <ScrollText className="h-4 w-4" />
              <span>Procurações</span>
            </TabsTrigger>
            <TabsTrigger value="boletos" className="flex flex-col items-center gap-1 py-2">
              <Receipt className="h-4 w-4" />
              <span>Boletos</span>
            </TabsTrigger>
          </div>
          
          <div className="col-span-4 grid grid-cols-4 gap-2 mt-2">
            <TabsTrigger value="prioridades" className="flex flex-col items-center gap-1 py-2">
              <AlertCircle className="h-4 w-4" />
              <span>Prioridades</span>
            </TabsTrigger>
            <TabsTrigger value="habilitacao" className="flex flex-col items-center gap-1 py-2">
              <KeyRound className="h-4 w-4" />
              <span>Habilitação</span>
            </TabsTrigger>
            <TabsTrigger value="comprovantes" className="flex flex-col items-center gap-1 py-2">
              <FileCheck className="h-4 w-4" />
              <span>Comprovantes</span>
            </TabsTrigger>
            <TabsTrigger value="minutas" className="flex flex-col items-center gap-1 py-2">
              <FileText className="h-4 w-4" />
              <span>Minutas</span>
            </TabsTrigger>
          </div>
        </TabsList>

        {/* Conteúdo separado visualmente das abas - Aumentado o espaçamento */}
        <div className="mt-16 pt-4">
          {/* Anotações */}
          <TabsContent value="anotacoes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Anotações</h2>
              <Button onClick={() => handleAddItem("anotacao")}>
                <Plus className="mr-2 h-4 w-4" /> Nova Anotação
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(item => (
                <Card 
                  key={item} 
                  className="hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleCardClick("anotacao", { id: item, title: `Anotação #${item}`, date: '10/05/2023', status: 'Pendente', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.', category: 'Documentação' })}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-lg">Anotação #{item}</CardTitle>
                        <CardDescription>Criada em: 10/05/2023</CardDescription>
                      </div>
                      <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-xs px-2 py-1 rounded-full">Pendente</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.</p>
                    <div className="flex justify-between items-center">
                      <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
                        Categoria: Documentação
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); }}><Check className="h-3 w-3" /></Button>
                        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); }}><X className="h-3 w-3" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Minutas para Assinar */}
          <TabsContent value="minutas-assinar" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Minutas para Assinar</h2>
              <Button onClick={() => handleAddItem("minuta-assinar")}>
                <Plus className="mr-2 h-4 w-4" /> Nova Minuta
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2].map(item => (
                <Card 
                  key={item} 
                  className="hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleCardClick("minuta-assinar", { id: item, title: `Contrato #${item}`, client: 'Empresa ABC', status: 'Enviado', sentDate: '15/05/2023', deadline: '25/05/2023', responsible: 'João Silva' })}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-lg">Contrato #{item}</CardTitle>
                        <CardDescription>Cliente: Empresa ABC</CardDescription>
                      </div>
                      <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded-full">Enviado</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm">Enviado em: 15/05/2023</p>
                      <p className="text-sm">Prazo: 25/05/2023</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Responsável: João Silva</span>
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); }}>Marcar como Assinado</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Procurações */}
          <TabsContent value="procuracoes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Procurações</h2>
              <Button onClick={() => handleAddItem("procuracao")}>
                <Plus className="mr-2 h-4 w-4" /> Nova Procuração
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(item => (
                <Card 
                  key={item} 
                  className="hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleCardClick("procuracao", { id: item, title: `Procuração #${item}`, client: 'Empresa XYZ', status: 'Verificada', validity: '31/12/2023', type: 'Plenos Poderes', authDate: '05/01/2023' })}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-lg">Procuração #{item}</CardTitle>
                        <CardDescription>Cliente: Empresa XYZ</CardDescription>
                      </div>
                      <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2 py-1 rounded-full">Verificada</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm">Validade: 31/12/2023</p>
                      <p className="text-sm">Tipo: Plenos Poderes</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Autenticada em: 05/01/2023</span>
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); }}>Ver Detalhes</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Boletos Liberados */}
          <TabsContent value="boletos" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Boletos Liberados</h2>
              <Button onClick={() => handleAddItem("boleto")}>
                <Plus className="mr-2 h-4 w-4" /> Novo Boleto
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4].map(item => (
                <Card 
                  key={item} 
                  className="hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleCardClick("boleto", { id: item, title: `Boleto #${item}`, value: 'R$ 1.250,00', status: 'Liberado', client: 'Empresa DEF', dueDate: '30/05/2023', releasedBy: 'Maria Santos' })}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-lg">Boleto #{item}</CardTitle>
                        <CardDescription>R$ 1.250,00</CardDescription>
                      </div>
                      <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs px-2 py-1 rounded-full">Liberado</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm">Cliente: Empresa DEF</p>
                      <p className="text-sm">Vencimento: 30/05/2023</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Liberado por: Maria Santos</span>
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); }}>Enviar por Email</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Prioridades Consultores */}
          <TabsContent value="prioridades" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Prioridades de Consultores</h2>
              <Button onClick={() => handleAddItem("prioridade")}>
                <Plus className="mr-2 h-4 w-4" /> Nova Prioridade
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2].map(item => (
                <Card 
                  key={item} 
                  className={`hover:shadow-md transition-all cursor-pointer ${item === 1 ? 'border-red-500 dark:border-red-700' : ''}`}
                  onClick={() => handleCardClick("prioridade", { 
                    id: item, 
                    title: `Demanda Urgente #${item}`, 
                    consultant: 'Pedro Oliveira', 
                    status: item === 1 ? 'Crítica' : 'Alta', 
                    client: `Cliente Importante ${item}`, 
                    requestDate: item === 1 ? '18/05/2023' : '17/05/2023',
                    description: 'Necessidade urgente de resolução de pendência contratual.',
                    deadline: item === 1 ? '19/05/2023' : '20/05/2023'
                  })}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-lg">Demanda Urgente #{item}</CardTitle>
                        <CardDescription>Consultor: Pedro Oliveira</CardDescription>
                      </div>
                      <span className={`${item === 1 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'} text-xs px-2 py-1 rounded-full`}>
                        {item === 1 ? 'Crítica' : 'Alta'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm">Cliente: Cliente Importante {item}</p>
                      <p className="text-sm">Solicitado em: {item === 1 ? '18/05/2023' : '17/05/2023'}</p>
                      <p className="text-sm">Descrição: Necessidade urgente de resolução de pendência contratual.</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Prazo: {item === 1 ? '19/05/2023' : '20/05/2023'}</span>
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); }}>Iniciar Atendimento</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Habilitação */}
          <TabsContent value="habilitacao" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Habilitação</h2>
              <Button onClick={() => handleAddItem("habilitacao")}>
                <Plus className="mr-2 h-4 w-4" /> Nova Habilitação
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(item => (
                <Card 
                  key={item} 
                  className="hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleCardClick("habilitacao", { id: item, title: `Habilitação #${item}`, user: 'Carlos Mendes', status: 'Aprovada', accessLevel: 'Administrador', validity: '31/12/2023', approvedBy: 'Ana Lucia' })}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-lg">Habilitação #{item}</CardTitle>
                        <CardDescription>Usuário: Carlos Mendes</CardDescription>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 text-xs px-2 py-1 rounded-full">Aprovada</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm">Nível de Acesso: Administrador</p>
                      <p className="text-sm">Validade: 31/12/2023</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Aprovado por: Ana Lucia</span>
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); }}>Revogar Acesso</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Comprovante de Pagamento */}
          <TabsContent value="comprovantes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Comprovantes de Pagamento</h2>
              <Button onClick={() => handleAddItem("comprovante")}>
                <Plus className="mr-2 h-4 w-4" /> Novo Comprovante
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(item => (
                <Card 
                  key={item} 
                  className="hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleCardClick("comprovante", { id: item, title: `Comprovante #${item}`, value: 'R$ 2.500,00', status: 'Confirmado', client: 'Empresa GHI', paymentDate: '05/05/2023', reference: 'Fatura #12345', verifiedDate: '06/05/2023' })}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-lg">Comprovante #{item}</CardTitle>
                        <CardDescription>R$ 2.500,00</CardDescription>
                      </div>
                      <span className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 text-xs px-2 py-1 rounded-full">Confirmado</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm">Cliente: Empresa GHI</p>
                      <p className="text-sm">Data do Pagamento: 05/05/2023</p>
                      <p className="text-sm">Referente a: Fatura #12345</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Verificado em: 06/05/2023</span>
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); }}>Visualizar</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Minutas */}
          <TabsContent value="minutas" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Minutas</h2>
              <Button onClick={() => handleAddItem("minuta")}>
                <Plus className="mr-2 h-4 w-4" /> Nova Minuta
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4].map(item => (
                <Card 
                  key={item} 
                  className="hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleCardClick("minuta", { id: item, title: `Minuta #${item}`, type: 'Contrato de Prestação de Serviços', status: 'Em Revisão', client: 'Empresa JKL', creationDate: '12/05/2023', checklistProgress: '3/5', responsible: 'Marcos Pereira' })}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-lg">Minuta #{item}</CardTitle>
                        <CardDescription>Tipo: Contrato de Prestação de Serviços</CardDescription>
                      </div>
                      <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-xs px-2 py-1 rounded-full">Em Revisão</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm">Cliente: Empresa JKL</p>
                      <p className="text-sm">Criada em: 12/05/2023</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">Checklist:</span>
                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-1 py-0.5 rounded">3/5</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Responsável: Marcos Pereira</span>
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); }}>Validar Minuta</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Dialog para adicionar novos itens ou visualizar detalhes */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {dialogType === "anotacao" && "Nova Anotação"}
              {dialogType === "minuta-assinar" && "Nova Minuta para Assinar"}
              {dialogType === "procuracao" && "Nova Procuração"}
              {dialogType === "boleto" && "Novo Boleto"}
              {dialogType === "prioridade" && "Nova Prioridade"}
              {dialogType === "habilitacao" && "Nova Habilitação"}
              {dialogType === "comprovante" && "Novo Comprovante"}
              {dialogType === "minuta" && "Nova Minuta"}
              
              {dialogType === "view-anotacao" && `Detalhes da Anotação #${selectedItem?.id}`}
              {dialogType === "view-minuta-assinar" && `Detalhes do Contrato #${selectedItem?.id}`}
              {dialogType === "view-procuracao" && `Detalhes da Procuração #${selectedItem?.id}`}
              {dialogType === "view-boleto" && `Detalhes do Boleto #${selectedItem?.id}`}
              {dialogType === "view-prioridade" && `Detalhes da Prioridade #${selectedItem?.id}`}
              {dialogType === "view-habilitacao" && `Detalhes da Habilitação #${selectedItem?.id}`}
              {dialogType === "view-comprovante" && `Detalhes do Comprovante #${selectedItem?.id}`}
              {dialogType === "view-minuta" && `Detalhes da Minuta #${selectedItem?.id}`}
            </DialogTitle>
            {selectedItem && <DialogDescription>
              {dialogType.startsWith("view-") && "Informações detalhadas do item selecionado"}
            </DialogDescription>}
          </DialogHeader>
          
          {!selectedItem && (
            <div className="py-4">
              <p className="text-center text-muted-foreground">
                Formulário para adicionar novo item será implementado aqui.
              </p>
            </div>
          )}
          
          {selectedItem && (
            <div className="py-4 space-y-4">
              {/* Detalhes do item selecionado baseado no tipo */}
              {dialogType === "view-anotacao" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{selectedItem.title}</h3>
                    <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-xs px-2 py-1 rounded-full">{selectedItem.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Criada em: {selectedItem.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Categoria: {selectedItem.category}</span>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-1">Descrição:</p>
                    <p className="text-sm">{selectedItem.description}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline">
                      <Check className="mr-2 h-3 w-3" />
                      Marcar como Concluído
                    </Button>
                    <Button size="sm" variant="destructive">
                      <X className="mr-2 h-3 w-3" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
              
              {dialogType === "view-minuta-assinar" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{selectedItem.title}</h3>
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded-full">{selectedItem.status}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Cliente: {selectedItem.client}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Enviado em: {selectedItem.sentDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Prazo: {selectedItem.deadline}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Responsável: {selectedItem.responsible}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-end">
                    <Button>Marcar como Assinado</Button>
                  </div>
                </div>
              )}
              
              {/* Adicione blocos similares para os outros tipos de itens */}
              {(dialogType === "view-procuracao" || 
               dialogType === "view-boleto" || 
               dialogType === "view-prioridade" || 
               dialogType === "view-habilitacao" || 
               dialogType === "view-comprovante" || 
               dialogType === "view-minuta") && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{selectedItem.title}</h3>
                    <span className={`${
                      dialogType === "view-prioridade" && selectedItem.status === "Crítica" 
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" 
                        : dialogType === "view-prioridade" 
                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                          : dialogType === "view-procuracao" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : dialogType === "view-boleto"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                              : dialogType === "view-habilitacao"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                                : dialogType === "view-comprovante"
                                  ? "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"
                                  : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                    } text-xs px-2 py-1 rounded-full`}>{selectedItem.status}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(selectedItem).map(([key, value]: [string, unknown]) => {
                      // Exclui propriedades que já estão exibidas em outros lugares
                      if (["id", "title", "status"].includes(key)) return null;
                      
                      return (
                        <div key={key} className="flex items-center gap-2">
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                          <span>{String(value)}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-end gap-2">
                    {dialogType === "view-procuracao" && (
                      <Button size="sm">Validar Procuração</Button>
                    )}
                    {dialogType === "view-boleto" && (
                      <Button size="sm">Enviar por Email</Button>
                    )}
                    {dialogType === "view-prioridade" && (
                      <Button size="sm">Iniciar Atendimento</Button>
                    )}
                    {dialogType === "view-habilitacao" && (
                      <Button size="sm" variant="destructive">Revogar Acesso</Button>
                    )}
                    {dialogType === "view-comprovante" && (
                      <Button size="sm">Download do Comprovante</Button>
                    )}
                    {dialogType === "view-minuta" && (
                      <Button size="sm">Validar Minuta</Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            {!selectedItem ? (
              <>
                <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancelar</Button>
                <Button onClick={() => setOpenDialog(false)}>Salvar</Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setOpenDialog(false)}>Fechar</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
};

export default Operacional;
