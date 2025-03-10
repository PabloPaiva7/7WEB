
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mensagens } from "@/components/BatePapo/Mensagens";
import { Demandas } from "@/components/BatePapo/Demandas";
import { Ideias } from "@/components/BatePapo/Ideias";

export default function BatePapo() {
  const [activeTab, setActiveTab] = useState("mensagens");

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Bate-Papo Interno</h1>
        <p className="text-muted-foreground">
          Comunique-se com a equipe, organize demandas e compartilhe ideias.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
          <TabsTrigger value="demandas">Demandas</TabsTrigger>
          <TabsTrigger value="ideias">Ideias</TabsTrigger>
        </TabsList>
        <TabsContent value="mensagens" className="mt-4">
          <Mensagens />
        </TabsContent>
        <TabsContent value="demandas" className="mt-4">
          <Demandas />
        </TabsContent>
        <TabsContent value="ideias" className="mt-4">
          <Ideias />
        </TabsContent>
      </Tabs>
    </div>
  );
}
