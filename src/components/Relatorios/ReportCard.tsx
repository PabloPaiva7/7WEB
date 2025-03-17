
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LucideIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateReportData, downloadCSV, downloadXLSX } from "@/utils/reportUtils";

interface ReportCardProps {
  reportType: string;
  title: string;
  description: string;
  icon: LucideIcon;
  alertText: string;
}

export const ReportCard = ({
  reportType,
  title,
  description,
  icon: Icon,
  alertText
}: ReportCardProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async (format: 'csv' | 'xlsx') => {
    setIsGenerating(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock data
      const data = generateReportData(reportType);
      
      // Download file in requested format
      if (format === 'csv') {
        downloadCSV(data, `relatorio-${reportType}-${new Date().toISOString().split('T')[0]}`);
      } else {
        downloadXLSX(data, `relatorio-${reportType}-${new Date().toISOString().split('T')[0]}`);
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
