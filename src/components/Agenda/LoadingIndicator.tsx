
import React from "react";

const LoadingIndicator = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="space-y-4 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="text-muted-foreground">Carregando dados da agenda...</p>
      </div>
    </div>
  );
};

export default LoadingIndicator;
