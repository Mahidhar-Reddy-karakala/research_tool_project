import React from 'react';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { Trade } from './TradeSchema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  BarChart3Icon,
  CalendarIcon, 
  ClockIcon,
  TagIcon
} from 'lucide-react';
import { toast } from 'sonner';

// Generate random price data for the trade detail view
const generatePriceData = (trade: Trade) => {
  const data = [];
  const basePrice = trade.entryPrice || trade.price;
  const endPrice = trade.exitPrice || trade.price;
  const volatility = basePrice * 0.005; // 0.5% volatility
  const points = 50;
  
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    const trendComponent = basePrice + progress * (endPrice - basePrice);
    const randomComponent = (Math.random() - 0.5) * 2 * volatility;
    const price = Math.max(0, trendComponent + randomComponent);
    
    data.push({
      time: i,
      price: parseFloat(price.toFixed(2)),
    });
  }
  
  return data;
};

interface TradeDetailViewProps {
  trade: Trade;
  onUpdate?: (trade: Trade) => void;
}

export function TradeDetailView({ trade, onUpdate }: TradeDetailViewProps) {
  const isMobile = useIsMobile();
  const priceData = React.useMemo(() => generatePriceData(trade), [trade]);
  const formattedDate = React.useMemo(() => {
    try {
      return format(new Date(trade.timestamp), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  }, [trade.timestamp]);
  
  const formattedTime = React.useMemo(() => {
    try {
      return format(new Date(trade.timestamp), 'HH:mm:ss');
    } catch (e) {
      return '';
    }
  }, [trade.timestamp]);

  const isProfitable = trade.pnl !== undefined && trade.pnl > 0;
  const hasPnL = trade.pnl !== undefined && trade.status === 'COMPLETED';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: 'Saving trade details...',
      success: 'Trade updated successfully',
      error: 'Failed to update trade',
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 text-left font-medium">
          {trade.symbol} {trade.type === 'BUY' ? 'Buy' : 'Sell'}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <span className="flex items-center gap-1.5">
                {trade.symbol}
                <Badge 
                  variant="outline" 
                  className={`ml-1 ${trade.type === 'BUY' ? 'text-green-500 border-green-200' : 'text-red-500 border-red-200'}`}
                >
                  {trade.type === 'BUY' ? (
                    <ArrowUpIcon className="mr-1 size-3" />
                  ) : (
                    <ArrowDownIcon className="mr-1 size-3" />
                  )}
                  {trade.type}
                </Badge>
              </span>
            </SheetTitle>
            <Badge 
              variant={trade.status === 'COMPLETED' ? 'outline' : 
                     trade.status === 'PENDING' ? 'secondary' : 'destructive'}
              className="px-2 py-0.5"
            >
              {trade.status}
            </Badge>
          </div>
          <SheetDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-sm">
            <span className="flex items-center gap-1">
              <CalendarIcon className="size-3.5" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <ClockIcon className="size-3.5" />
              {formattedTime}
            </span>
            <span>{trade.exchange}</span>
            {trade.orderType && (
              <Badge variant="outline" className="font-normal">
                {trade.orderType.replace('_', ' ')}
              </Badge>
            )}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4">
          {hasPnL && (
            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium text-muted-foreground">Profit/Loss</div>
              <div className={`mt-1 text-2xl font-semibold ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
                {isProfitable ? '+' : ''}{trade.pnl?.toFixed(2)} USD
              </div>
              {trade.pnlPercentage !== undefined && (
                <div className={`text-sm ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
                  {isProfitable ? '+' : ''}{trade.pnlPercentage.toFixed(2)}%
                </div>
              )}
            </div>
          )}
          
          <div className="h-[200px] w-full">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-medium">Price Chart</div>
              <BarChart3Icon className="size-4 text-muted-foreground" />
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={priceData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="5%" 
                      stopColor={isProfitable ? "rgba(34, 197, 94, 0.8)" : "rgba(239, 68, 68, 0.8)"} 
                      stopOpacity={0.8}
                    />
                    <stop 
                      offset="95%" 
                      stopColor={isProfitable ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)"} 
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis 
                  dataKey="time" 
                  tick={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  domain={['dataMin - 1', 'dataMax + 1']}
                  tick={{ fontSize: 10 }}
                  width={40}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Price']}
                  labelFormatter={() => ''}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={isProfitable ? "#22c55e" : "#ef4444"} 
                  fillOpacity={1}
                  fill="url(#colorPrice)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <Separator />
          
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input 
                  id="quantity" 
                  defaultValue={trade.quantity} 
                  type="number" 
                  min="0"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="price">Price</Label>
                <Input 
                  id="price" 
                  defaultValue={trade.price.toFixed(2)} 
                  type="number" 
                  step="0.01" 
                  min="0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="orderType">Order Type</Label>
                <Select defaultValue={trade.orderType}>
                  <SelectTrigger id="orderType" className="w-full">
                    <SelectValue placeholder="Select order type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MARKET">Market</SelectItem>
                    <SelectItem value="LIMIT">Limit</SelectItem>
                    <SelectItem value="STOP">Stop</SelectItem>
                    <SelectItem value="STOP_LIMIT">Stop Limit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={trade.status}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Input 
                id="notes" 
                defaultValue={trade.notes || ''} 
                placeholder="Add trade notes..."
              />
            </div>
            
            {trade.tags && trade.tags.length > 0 && (
              <div className="flex flex-col gap-2">
                <Label className="flex items-center gap-1.5">
                  <TagIcon className="size-3.5" />
                  Tags
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {trade.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs font-normal"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>
        
        <SheetFooter className="mt-auto flex gap-2 sm:flex-row">
          <Button 
            type="submit" 
            className="flex-1"
            onClick={handleSave}
          >
            Save Changes
          </Button>
          <SheetClose asChild>
            <Button variant="outline" className="flex-1">
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}