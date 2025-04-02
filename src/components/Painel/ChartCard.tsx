
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

export const ChartCard = ({ title, description, children, className }: ChartCardProps) => {
  return (
    <Card className={`overflow-hidden border-t-4 border-t-primary/20 shadow-sm hover:shadow-md transition-duration-200 ${className}`}>
      <CardHeader className="pb-2 bg-muted/30">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-[#D9B300]">{title}</CardTitle>
        <CardDescription className="dark:text-[#D9B300]/80 text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[280px] p-4">
          {children}
        </div>
      </CardContent>
    </Card>
  );
};
