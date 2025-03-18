
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckSquare, Ticket } from "lucide-react";

// Import the content from both pages
import TarefasContent from "./Tarefas";
import TicketsContent from "./Tickets";

const TarefasTickets = () => {
  const [activeTab, setActiveTab] = useState<string>("tarefas");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tarefas e Tickets</h1>
      
      <Tabs 
        defaultValue="tarefas" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="tarefas" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            <span>Tarefas</span>
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            <span>Tickets</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tarefas" fullWidth={true} className="mt-6">
          <TarefasContent />
        </TabsContent>
        
        <TabsContent value="tickets" fullWidth={true} className="mt-6">
          <TicketsContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TarefasTickets;
