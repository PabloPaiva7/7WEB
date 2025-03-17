
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

export const MapSection = () => {
  return (
    <Card className="h-[450px]">
      <CardHeader>
        <CardTitle className="dark:text-[#D9B300]">Distribuição Geográfica</CardTitle>
        <CardDescription className="dark:text-[#D9B300]/80">
          Processos por região e estado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-[350px] w-full bg-muted rounded-md overflow-hidden">
          {/* Placeholder para o mapa - em uma implementação real seria usado um componente de mapa */}
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <MapPin className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground dark:text-[#D9B300]/80">Mapa de distribuição</p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center max-w-md">
              {["SP", "RJ", "MG", "RS", "PR", "SC", "BA", "DF", "GO", "PE"].map((uf) => (
                <Badge key={uf} variant="outline" className="dark:text-[#D9B300]/80">
                  {uf}: {Math.floor(Math.random() * 100) + 10}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
