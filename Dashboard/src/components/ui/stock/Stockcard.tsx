import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { type StockData } from '@/lib/mockData';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { Star, StarOff } from 'lucide-react';



interface StockCardProps {
  stock: StockData;
  chartData: Array<{ date: string; value: string }>;
  onClick?: () => void;
  onToggleFavorite?: () => void;
  onToggleWishlist?: () => void;
  isFavorite?: boolean;
  isWishlist?: boolean;
  variant?: 'default' | 'compact';
}

export function StockCard({
  stock,
  chartData,
  onClick,
  onToggleFavorite,
  onToggleWishlist,
  isFavorite = false,
  isWishlist = false,
  variant = 'default',
}: StockCardProps) {
  const isPositive = stock.changePercent >= 0;
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all hover:shadow-md cursor-pointer",
        variant === 'compact' ? 'h-28' : 'h-40'
      )}
      onClick={onClick}
    >
      <CardContent className={cn("p-4", variant === 'compact' ? 'space-y-1' : 'space-y-2')}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className={cn("font-medium", variant === 'compact' ? 'text-sm' : 'text-base')}>{stock.symbol}</h3>
              {variant !== 'compact' && (
                <span className="text-xs text-muted-foreground">{stock.sector}</span>
              )}
            </div>
            <p className={cn("text-muted-foreground", variant === 'compact' ? 'text-xs' : 'text-sm')}>
              {variant === 'compact' ? stock.name.substring(0, 15) + (stock.name.length > 15 ? '...' : '') : stock.name}
            </p>
          </div>
          {variant !== 'compact' && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                isFavorite ? onToggleFavorite?.() : onToggleWishlist?.();
              }}
              className="text-muted-foreground hover:text-primary"
            >
              {isFavorite ? (
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ) : isWishlist ? (
                <Star className="h-4 w-4" />
              ) : (
                <StarOff className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <div className={cn(
              variant === 'compact' ? 'text-base font-semibold' : 'text-xl font-bold'
            )}>
              {formatCurrency(stock.price)}
            </div>
            <div className={cn(
              "flex items-center",
              isPositive ? "text-green-500" : "text-red-500",
              variant === 'compact' ? 'text-xs' : 'text-sm'
            )}>
              <span>{formatCurrency(stock.change)}</span>
              <span className="ml-1">({formatPercentage(stock.changePercent)})</span>
            </div>
          </div>
          
          <div className={cn(
            "w-24 h-12",
            variant === 'compact' ? 'h-8' : 'h-12'
          )}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id={`gradient-${stock.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="5%" 
                      stopColor={isPositive ? "hsl(var(--chart-1))" : "hsl(var(--destructive))"}
                      stopOpacity={0.8}
                    />
                    <stop 
                      offset="95%" 
                      stopColor={isPositive ? "hsl(var(--chart-1))" : "hsl(var(--destructive))"}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? "hsl(var(--chart-1))" : "hsl(var(--destructive))"}
                  fillOpacity={1}
                  fill={`url(#gradient-${stock.id})`}
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}