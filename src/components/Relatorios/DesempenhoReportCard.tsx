
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calendar, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LucideIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateDesempenhoData, downloadCSV, downloadXLSX } from "@/utils/reportUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DesempenhoReportCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  alertText: string;
}

export const DesempenhoReportCard = ({
  title,
  description,
  icon: Icon,
  alertText
}: DesempenhoReportCardProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState(() => generateDesempenhoData());

  const handleGenerateReport = async (format: 'csv' | 'xlsx') => {
    setIsGenerating(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate data
      const data = reportData;
      
      // Download file in requested format
      if (format === 'csv') {
        downloadCSV(data.daily.concat(data.monthly), `relatorio-desempenho-${new Date().toISOString().split('T')[0]}`);
      } else {
        downloadXLSX(data.daily.concat(data.monthly), `relatorio-desempenho-${new Date().toISOString().split('T')[0]}`);
      }
      
      toast({
        title: "Relatório gerado com sucesso",
        description: `O relatório de ${title.toLowerCase()} foi gerado no formato ${format.toUpperCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar relatório",
        description: "Não foi possível gerar o relatório. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-[#D9B300]">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription className="dark:text-[#D9B300]/80">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertDescription>
            {alertText}
          </AlertDescription>
        </Alert>
        
        <div className="mb-6">
          <Tabs defaultValue="diario">
            <TabsList className="mb-4">
              <TabsTrigger value="diario" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Diário
              </TabsTrigger>
              <TabsTrigger value="mensal" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Mensal
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="diario">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Desempenho Diário</CardTitle>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">Carlos Oliveira</span>
                    </div>
                  </div>
                  <CardDescription>
                    {new Date().toLocaleDateString('pt-BR', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px] font-semibold">Status</TableHead>
                        <TableHead className="text-right font-semibold">Quantidade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.daily.map((item) => (
                        <TableRow key={item.status}>
                          <TableCell className="font-medium">{item.status}</TableCell>
                          <TableCell className="text-right">{item.quantidade}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="mensal">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Desempenho Mensal</CardTitle>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">Carlos Oliveira</span>
                    </div>
                  </div>
                  <CardDescription>
                    {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px] font-semibold">Status</TableHead>
                        <TableHead className="text-right font-semibold">Quantidade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.monthly.map((item) => (
                        <TableRow key={item.status}>
                          <TableCell className="font-medium">{item.status}</TableCell>
                          <TableCell className="text-right">{item.quantidade}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => handleGenerateReport('csv')}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Baixar CSV
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => handleGenerateReport('xlsx')}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Baixar XLSX
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
