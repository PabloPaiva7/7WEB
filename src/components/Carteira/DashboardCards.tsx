
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, AlertTriangle, Clock, CheckCircle2, ArrowRight } from "lucide-react";

export const DashboardCards = () => {
  const cardsDashboard = [
    { 
      titulo: 'Guia de Início Rápido', 
      descricao: 'Como gerenciar seus contratos e carteira de clientes',
      icone: <HelpCircle className="h-8 w-8 text-blue-500" />,
      cor: 'bg-blue-50 border-blue-200',
      acoes: [
        { texto: 'Ver tutorial', icone: <ArrowRight className="h-4 w-4" /> }
      ]
    },
    { 
      titulo: 'Contratos Próximos do Vencimento', 
      descricao: '3 contratos vencem nos próximos 7 dias',
      icone: <AlertTriangle className="h-8 w-8 text-amber-500" />,
      cor: 'bg-amber-50 border-amber-200',
      acoes: [
        { texto: 'Ver lista', icone: <ArrowRight className="h-4 w-4" /> }
      ]
    },
    { 
      titulo: 'Clientes Pendentes', 
      descricao: '7 clientes aguardando análise de documentação',
      icone: <Clock className="h-8 w-8 text-purple-500" />,
      cor: 'bg-purple-50 border-purple-200',
      acoes: [
        { texto: 'Verificar', icone: <ArrowRight className="h-4 w-4" /> }
      ]
    },
    { 
      titulo: 'Contratos Aprovados', 
      descricao: '12 contratos aprovados no último mês',
      icone: <CheckCircle2 className="h-8 w-8 text-green-500" />,
      cor: 'bg-green-50 border-green-200',
      acoes: [
        { texto: 'Ver detalhes', icone: <ArrowRight className="h-4 w-4" /> }
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardsDashboard.map((card, index) => (
        <Card key={index} className={`${card.cor}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base font-semibold">{card.titulo}</CardTitle>
              {card.icone}
            </div>
            <CardDescription>{card.descricao}</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex space-x-2 mt-2">
              {card.acoes.map((acao, i) => (
                <Button key={i} variant="outline" size="sm" className="bg-white hover:bg-white/90">
                  {acao.texto}
                  {acao.icone}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
