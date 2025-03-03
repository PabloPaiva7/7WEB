
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ColumnConfig, Cliente } from "./ClientesTable";

interface ClienteDialogProps {
  editingCliente: Cliente | null;
  columnConfig: Record<string, ColumnConfig>;
  onSubmit: (data: Cliente) => void;
  onCancel: () => void;
}

export const ClienteDialog = ({
  editingCliente,
  columnConfig,
  onSubmit,
  onCancel
}: ClienteDialogProps) => {
  const form = useForm<Cliente>({
    defaultValues: editingCliente || {
      id: 0,
      data: new Date().toISOString().split('T')[0],
      resolucao: "",
      contrato: "",
      escritorio: "",
      ultimoPagamento: new Date().toISOString().split('T')[0],
      prazo: "",
      entrada: "",
      banco: "",
      codigo: "",
      valorCliente: "",
      contato: "",
      negociacao: "",
      situacao: "",
    }
  });

  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {editingCliente ? "Editar Cliente" : "Novo Cliente"}
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(columnConfig).map(([key, config]) => (
              key !== 'id' && (
                <FormField
                  key={key}
                  control={form.control}
                  name={key as keyof Cliente}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{config.label}</FormLabel>
                      <FormControl>
                        <Input
                          type={config.type === 'date' ? 'date' : 'text'}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingCliente ? "Salvar" : "Adicionar"}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};
