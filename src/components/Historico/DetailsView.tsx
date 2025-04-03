
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, History } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { Badge } from '@/components/ui/badge';
import { MovimentacaoHistorico } from '@/types/agenda.types';

interface DetailsViewProps {
  currentItems: MovimentacaoHistorico[];
  verificarAutenticidade: (protocolo: string) => void;
  exportarParaPDF: (items: MovimentacaoHistorico[], filename: string) => void;
  toast: any;
}

export const DetailsView = ({
  currentItems,
  verificarAutenticidade,
  exportarParaPDF,
  toast
}: DetailsViewProps) => {
  return (
    <>
      {currentItems.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Nenhum registro encontrado com os filtros aplicados.</p>
          </CardContent>
        </Card>
      ) : (
        currentItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="font-mono">{item.protocolo}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5"
                      onClick={() => verificarAutenticidade(item.protocolo)}
                    >
                      <History className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    {new Date(item.data).toLocaleDateString('pt-BR')} às {new Date(item.data).toLocaleTimeString('pt-BR')}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={item.status} />
                  <Badge variant={item.statusCampanha ? "default" : "outline"} className="ml-2">
                    Campanha: {item.statusCampanha ? "Sim" : "Não"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Contrato/Cliente</h4>
                    <p>{item.contrato} - {item.cliente}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Usuário</h4>
                    <p>{item.usuario}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Tipo</h4>
                    <p>{item.tipo}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Módulo</h4>
                    <p>{item.modulo}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Descrição</h4>
                  <p>{item.descricao}</p>
                </div>
                
                <div className="flex justify-end pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      exportarParaPDF([item], `movimentacao-${item.protocolo}`);
                      toast({
                        title: "Exportação concluída",
                        description: "Registro exportado para PDF com sucesso."
                      });
                    }}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Baixar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </>
  );
};
