
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
    tipo: "pagamento" | "negociacao" | "contato" | "assessoria";
    conteudo: string;
    atendente: string;
  }) => void;
}

const formSchema = z.object({
  tipo: z.enum(["pagamento", "negociacao", "contato", "assessoria"], {
    required_error: "Selecione o tipo de interação"
  }).optional().default("contato"),
  conteudo: z.string().optional().default(""),
  atendente: z.string().optional().default("")
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
    // Ensure all fields have at least default values
    const interacao = {
      tipo: values.tipo || "contato",
      conteudo: values.conteudo || "",
      atendente: values.atendente || ""
    } as const;
    
    onAdd(interacao);
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
                  <SelectItem value="assessoria">Assessoria</SelectItem>
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
