
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

type CsvPreviewProps = {
  isOpen: boolean;
  onClose: () => void;
  data: any[];
  headers: string[];
  errors: { row: number; field: string; message: string }[];
  onConfirm: () => void;
  isLoading: boolean;
};

export function CsvPreviewModal({
  isOpen,
  onClose,
  data,
  headers,
  errors,
  onConfirm,
  isLoading,
}: CsvPreviewProps) {
  const previewData = data.slice(0, 5); // Mostra apenas as 5 primeiras linhas

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Prévia da Importação</DialogTitle>
        </DialogHeader>

        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Foram encontrados {errors.length} erros nos dados
            </AlertDescription>
          </Alert>
        )}

        {errors.length === 0 && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Dados validados com sucesso!
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((header, index) => (
                    <TableHead key={index}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {headers.map((header, colIndex) => (
                      <TableCell key={`${rowIndex}-${colIndex}`}>
                        {row[header]}
                        {errors.some(
                          (error) =>
                            error.row === rowIndex && error.field === header
                        ) && (
                          <Badge variant="destructive" className="ml-2">
                            Erro
                          </Badge>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {errors.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Erros encontrados:</h4>
              {errors.map((error, index) => (
                <Alert key={index} variant="destructive">
                  <AlertDescription>
                    Linha {error.row + 1}, Campo {error.field}: {error.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} disabled={errors.length > 0 || isLoading}>
            {isLoading ? "Importando..." : "Confirmar Importação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
