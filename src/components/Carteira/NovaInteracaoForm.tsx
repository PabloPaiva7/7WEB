
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface NovaInteracaoFormProps {
  onAdd: (interacao: {
    tipo: "pagamento" | "negociacao" | "contato";
    conteudo: string;
    atendente: string;
  }) => void;
}

const formSchema = z.object({
  tipo: z.enum(["pagamento", "negociacao", "contato"], {
    required_error: "Selecione o tipo de interação"
  }),
  conteudo: z.string().min(3, "Insira pelo menos 3 caracteres"),
  atendente: z.string().min(2, "Informe o nome do atendente")
});

export const NovaInteracaoForm = ({ onAdd }: NovaInteracaoFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: "contato",
      conteudo: "",
      atendente: ""
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onAdd(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Interação</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pagamento">Pagamento</SelectItem>
                  <SelectItem value="negociacao">Negociação</SelectItem>
                  <SelectItem value="contato">Contato/Código</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="conteudo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Pagamento de R$ 500,00 realizado" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
        
        <Button type="submit" className="w-full">Adicionar Interação</Button>
      </form>
    </Form>
  );
};
