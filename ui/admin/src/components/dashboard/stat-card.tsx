import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  iconColor?: string;
}

export function StatCard({ title, value, change, changeLabel, icon, iconColor }: StatCardProps) {
  const isPositive = (change ?? 0) >= 0;

  return (
    <Card className="animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold font-display tracking-tight">{value}</p>
            {change !== undefined && (
              <div className={cn("flex items-center gap-1 text-xs font-medium", isPositive ? "text-success" : "text-destructive")}>
                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{isPositive ? "+" : ""}{change}%</span>
                {changeLabel && <span className="text-muted-foreground font-normal">{changeLabel}</span>}
              </div>
            )}
          </div>
          <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg", iconColor ?? "bg-primary/10 text-primary")}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
