
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";

const formSchema = z.object({
  clienteNome: z.string().min(2, { message: "Nome do cliente é obrigatório" }),
  clienteContato: z.string().min(8, { message: "Contato do cliente é obrigatório" }),
  oferta: z.string().min(5, { message: "Descrição da oferta é obrigatória" }),
  valor: z.string().transform(val => parseFloat(val.replace(/[^\d.,]/g, '').replace(',', '.'))),
  banco: z.string().min(2, { message: "Nome do banco é obrigatório" }),
  atendente: z.string().min(2, { message: "Nome do atendente é obrigatório" }),
});

interface NovoTicketFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}

export function NovoTicketForm({ onSubmit }: NovoTicketFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clienteNome: "",
      clienteContato: "",
      oferta: "",
      valor: "",
      banco: "",
      atendente: "",
    },
  });

  const [open, setOpen] = React.useState(false);

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Novo Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Ticket</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clienteNome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do cliente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clienteContato"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contato</FormLabel>
                    <FormControl>
                      <Input placeholder="Telefone ou email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="banco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banco</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do banco" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="R$ 0,00" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="atendente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Atendente</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do atendente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="oferta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição da Oferta</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva a oferta do cliente..." 
                      className="resize-none h-20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-4">
              <Button type="submit">Criar Ticket</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
