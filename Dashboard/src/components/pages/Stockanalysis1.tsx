import { useState, useEffect } from 'react';
import { stocks, generateChartData } from '@/lib/mockData';
import  {StockCard} from '@/components/ui/stock/Stockcard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import StockDetail from '@/components/ui/stock/StockDetail';

export default function StockAnalysis() {
  const [stockChartData, setStockChartData] = useState<
    Record<string, Array<{ date: string; value: string }>>
  >({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  
  // Generate chart data for each stock
  useEffect(() => {
    const chartData: Record<string, Array<{ date: string; value: string }>> = {};
    
    stocks.forEach(stock => {
      // Volatility and starting price based on the stock's current price
      const volatility = 0.02 + (Math.random() * 0.02);
      const days = 14; // Two weeks of data
      chartData[stock.id] = generateChartData(days, volatility, stock.price * 0.9);
    });
    
    setStockChartData(chartData);
  }, []);

  // Get unique sectors for the filter dropdown
  const sectors = ['all', ...new Set(stocks.map(stock => stock.sector))];
  
  // Filter stocks based on search query and sector
  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = 
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
      stock.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSector = selectedSector === 'all' || stock.sector === selectedSector;
    
    return matchesSearch && matchesSector;
  });

  const handleStockClick = (stockId: string) => {
    setSelectedStock(stockId);
  };

  const handleCloseDetail = () => {
    setSelectedStock(null);
  };
  
  return (
    <>
      {selectedStock ? (
        <StockDetail 
          stockId={selectedStock} 
          chartData={stockChartData[selectedStock] || []}
          onClose={handleCloseDetail}
        />
      ) : (
        <div className="pl-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Stock Analysis</h1>
            <p className="text-muted-foreground">
              Research and analyze stocks across different sectors
            </p>
          </div>
          
          <div className="pr-2 flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search stocks by name or symbol..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select 
              value={selectedSector} 
              onValueChange={setSelectedSector}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select sector" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map(sector => (
                  <SelectItem key={sector} value={sector}>
                    {sector === 'all' ? 'All Sectors' : sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button  variant="outline" onClick={() => {
              setSearchQuery('');
              setSelectedSector('all');
            }}>
              Reset
            </Button>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 pr-2">
            {filteredStocks.map(stock => (
              <StockCard
                key={stock.id}
                stock={stock}
                chartData={stockChartData[stock.id] || []}
                onClick={() => handleStockClick(stock.id)}
                isFavorite={stock.favorite}
                isWishlist={stock.wishlist}
              />
            ))}
            
            {filteredStocks.length === 0 && (
              <div className="col-span-full py-8 text-center text-muted-foreground">
                No stocks match your search criteria
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}