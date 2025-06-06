import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { type MarketIndex } from '@/lib/mockData';

interface MarketIndexCardProps {
  index: MarketIndex;
  className?: string;
}

export function MarketIndexCard({ index, className }: MarketIndexCardProps) {
  const isPositive = index.changePercent >= 0;
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-medium">{index.name}</h3>
          
          <div className="flex flex-col">
            <span className="text-xl font-bold">
              {formatCurrency(index.value)}
            </span>
            <div className={cn(
              "flex items-center text-sm",
              isPositive ? "text-green-500" : "text-red-500"
            )}>
              <span>{formatCurrency(index.change)}</span>
              <span className="ml-1">({formatPercentage(index.changePercent)})</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}