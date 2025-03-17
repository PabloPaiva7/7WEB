
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ThumbsUp, MessageSquare, Star, Mail } from "lucide-react";

// Define the form schema
const feedbackFormSchema = z.object({
  satisfactionLevel: z.string({
    required_error: "Por favor, selecione seu nível de satisfação.",
  }),
  categoria: z.string({
    required_error: "Por favor, selecione uma categoria.",
  }),
  comentario: z.string().min(5, {
    message: "O comentário deve ter pelo menos 5 caracteres.",
  }),
  sugestoes: z.string().optional(),
  isAnonimo: z.boolean().default(false),
  email: z.string().email({ message: "Email inválido" }).optional().or(z.literal("")),
  permiteContato: z.boolean().default(false),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

const Feedback = () => {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      satisfactionLevel: "3",
      categoria: "",
      comentario: "",
      sugestoes: "",
      isAnonimo: false,
      email: "",
      permiteContato: false,
    },
  });

  function onSubmit(data: FeedbackFormValues) {
    console.log("Feedback enviado:", data);
    toast({
      title: "Feedback enviado com sucesso!",
      description: "Agradecemos por compartilhar sua opinião conosco.",
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="container max-w-4xl mx-auto py-10">
        <Card className="border-2 border-green-500 dark:border-green-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-700 dark:text-green-400">
              <ThumbsUp className="h-12 w-12 mx-auto mb-4" />
              Obrigado pelo seu feedback!
            </CardTitle>
            <CardDescription className="text-lg">
              Sua opinião é extremamente valiosa e nos ajudará a melhorar nossos serviços.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p>Seu feedback foi registrado com sucesso e será analisado pela nossa equipe.</p>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Quer ajudar ainda mais?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Button className="flex items-center justify-center">
                  <Star className="mr-2 h-4 w-4" />
                  Avalie na loja de aplicativos
                </Button>
                <Button variant="outline" className="flex items-center justify-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Participe da nossa comunidade
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <Button 
              variant="ghost"
              onClick={() => setSubmitted(false)}
            >
              Enviar outro feedback
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl dark:text-[#D9B300]">
            Sua opinião é importante para nós!
          </CardTitle>
          <CardDescription className="text-lg dark:text-[#D9B300]/80">
            Ajude-nos a melhorar nossos serviços compartilhando sua experiência
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField
                control={form.control}
                name="satisfactionLevel"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base dark:text-[#D9B300]">Como você avalia sua experiência?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex justify-between space-x-1"
                      >
                        <FormItem className="flex flex-col items-center space-y-2">
                          <FormControl>
                            <RadioGroupItem value="1" className="sr-only" />
                          </FormControl>
                          <label
                            htmlFor="1"
                            className={`text-3xl cursor-pointer ${
                              field.value === "1" ? "opacity-100 scale-125" : "opacity-50"
                            }`}
                            onClick={() => form.setValue("satisfactionLevel", "1")}
                          >
                            😞
                          </label>
                          <FormLabel className="text-xs font-normal">Ruim</FormLabel>
                        </FormItem>
                        <FormItem className="flex flex-col items-center space-y-2">
                          <FormControl>
                            <RadioGroupItem value="2" className="sr-only" />
                          </FormControl>
                          <label
                            htmlFor="2"
                            className={`text-3xl cursor-pointer ${
                              field.value === "2" ? "opacity-100 scale-125" : "opacity-50"
                            }`}
                            onClick={() => form.setValue("satisfactionLevel", "2")}
                          >
                            🙁
                          </label>
                          <FormLabel className="text-xs font-normal">Regular</FormLabel>
                        </FormItem>
                        <FormItem className="flex flex-col items-center space-y-2">
                          <FormControl>
                            <RadioGroupItem value="3" className="sr-only" />
                          </FormControl>
                          <label
                            htmlFor="3"
                            className={`text-3xl cursor-pointer ${
                              field.value === "3" ? "opacity-100 scale-125" : "opacity-50"
                            }`}
                            onClick={() => form.setValue("satisfactionLevel", "3")}
                          >
                            😐
                          </label>
                          <FormLabel className="text-xs font-normal">Neutro</FormLabel>
                        </FormItem>
                        <FormItem className="flex flex-col items-center space-y-2">
                          <FormControl>
                            <RadioGroupItem value="4" className="sr-only" />
                          </FormControl>
                          <label
                            htmlFor="4"
                            className={`text-3xl cursor-pointer ${
                              field.value === "4" ? "opacity-100 scale-125" : "opacity-50"
                            }`}
                            onClick={() => form.setValue("satisfactionLevel", "4")}
                          >
                            🙂
                          </label>
                          <FormLabel className="text-xs font-normal">Bom</FormLabel>
                        </FormItem>
                        <FormItem className="flex flex-col items-center space-y-2">
                          <FormControl>
                            <RadioGroupItem value="5" className="sr-only" />
                          </FormControl>
                          <label
                            htmlFor="5"
                            className={`text-3xl cursor-pointer ${
                              field.value === "5" ? "opacity-100 scale-125" : "opacity-50"
                            }`}
                            onClick={() => form.setValue("satisfactionLevel", "5")}
                          >
                            😄
                          </label>
                          <FormLabel className="text-xs font-normal">Excelente</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#D9B300]">Categoria do Feedback</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="funcionalidades">Funcionalidades</SelectItem>
                        <SelectItem value="usabilidade">Usabilidade</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="suporte">Suporte</SelectItem>
                        <SelectItem value="visual">Design Visual</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comentario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#D9B300]">O que você gostaria de compartilhar conosco?</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Conte-nos sua experiência..." 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Compartilhe detalhes sobre sua experiência para que possamos entender melhor.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sugestoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#D9B300]">Você tem alguma sugestão de melhoria?</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Suas sugestões são valiosas para nós..." 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 border-t pt-4">
                <FormField
                  control={form.control}
                  name="isAnonimo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked) {
                              form.setValue("email", "");
                              form.setValue("permiteContato", false);
                            }
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="dark:text-[#D9B300]">
                          Enviar feedback anonimamente
                        </FormLabel>
                        <FormDescription>
                          Seu feedback será registrado sem suas informações pessoais.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {!form.watch("isAnonimo") && (
                  <>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-[#D9B300]">E-mail (opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="seu.email@exemplo.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            Preencha seu e-mail se desejar receber uma resposta.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="permiteContato"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={!form.watch("email")}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="dark:text-[#D9B300]">
                              Desejo ser contactado sobre este feedback
                            </FormLabel>
                            <FormDescription>
                              Nossa equipe poderá entrar em contato para saber mais sobre sua experiência.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar Feedback
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Feedback;
