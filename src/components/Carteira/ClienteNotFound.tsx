
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ClienteNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
      <h2 className="text-2xl font-semibold text-foreground">Cliente não encontrado</h2>
      <Button onClick={() => navigate("/")}>Voltar para a lista</Button>
    </div>
  );
};
