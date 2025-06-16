// import { useState, useEffect } from 'react';
// import { generateChartData } from '@/lib/mockData';
// import  {StockCard} from '@/components/ui/stock/Stockcard';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { 
//   Select, 
//   SelectContent, 
//   SelectItem, 
//   SelectTrigger, 
//   SelectValue
// } from '@/components/ui/select';
// import { Search } from 'lucide-react';
// import StockDetail from '@/components/ui/stock/StockDetail';
// import axios from 'axios';
// import { baseStocks as stocks } from '@/lib/liveData';


// import { useStockPrices } from'@/lib/liveData'; // adjust path as needed

// // Example 1: Basic usage in a component
// function StockDashboard() {
//   const { 
//     prices, 
//     loading, 
//     error, 
//     fetchStockPrice, 
//     updateAllPrices, 
//     getUpdatedStocks 
//   } = useStockPrices();

//   // Get stocks with updated prices
//   const updatedStocks = getUpdatedStocks();

// export interface Data {
//   _id: string;
//   symbol: string;
//   price: number;
//   change: number;
//   changePercent: number;
//   volume: number;
//   marketCap: number | null;
//   fetched_at: string;  // ISO date string
//   name: string;
//   fetched_at_date: string;  // YYYY-MM-DD
//   id: string;
// }

// export default function StockAnalysis() {
//   const [stockChartData, setStockChartData] = useState<
//     Record<string, Array<{ date: string; value: string }>>
//   >({});
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedSector, setSelectedSector] = useState('all');
//   const [selectedStock, setSelectedStock] = useState<string | null>(null);
//   // Generate chart data for each stock
//   useEffect(() => {
//     const chartData: Record<string, Array<{ date: string; value: string }>> = {};
    
//     stocks.forEach(stock => {
//       // Volatility and starting price based on the stock's current price
//       const volatility = 0.02 + (Math.random() * 0.02);
//       const days = 14; // Two weeks of data
//       chartData[stock.id] = generateChartData(days, volatility, stock.price * 0.9);
//     });
    
//     setStockChartData(chartData);
//   }, []);



//   // Get unique sectors for the filter dropdown
//   const sectors = ['all', ...new Set(stocks.map(stock => stock.sector))];
  
//   // Filter stocks based on search query and sector
//   const filteredStocks = stocks.filter(stock => {
//     const matchesSearch = 
//       stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
//       stock.name.toLowerCase().includes(searchQuery.toLowerCase());
    
//     const matchesSector = selectedSector === 'all' || stock.sector === selectedSector;
    
//     return matchesSearch && matchesSector;
//   });

//   const handleStockClick = (stockId: string) => {
//     setSelectedStock(stockId);
//   };

//   const handleCloseDetail = () => {
//     setSelectedStock(null);
//   };
  
//   return (
//     <>
//       {selectedStock ? (
//         <StockDetail 
//           stockId={selectedStock} 
//           chartData={stockChartData[selectedStock] || []}
//           onClose={handleCloseDetail}
//         />
//       ) : (
//         <div className="pl-2 space-y-6">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Stock Analysis</h1>
//             <p className="text-muted-foreground">
//               Research and analyze stocks across different sectors
//             </p>
//           </div>
          
//           <div className="pr-2 flex flex-col gap-4 md:flex-row">
//             <div className="relative flex-1">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 type="search"
//                 placeholder="Search stocks by name or symbol..."
//                 className="pl-8"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
            
//             <Select 
//               value={selectedSector} 
//               onValueChange={setSelectedSector}
//             >
//               <SelectTrigger className="w-full md:w-[180px]">
//                 <SelectValue placeholder="Select sector" />
//               </SelectTrigger>
//               <SelectContent>
//                 {sectors.map(sector => (
//                   <SelectItem key={sector} value={sector}>
//                     {sector === 'all' ? 'All Sectors' : sector}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
            
//             <Button  variant="outline" onClick={() => {
//               setSearchQuery('');
//               setSelectedSector('all');
//             }}>
//               Reset
//             </Button>
//           </div>
          
//           <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 pr-2">
//             {filteredStocks.map(stock => (

//               <StockCard
//                 key={stock.id}
//                 stock={stock}
//                 chartData={stockChartData[stock.id] || []}
//                 onClick={() => handleStockClick(stock.id)}
//                 isFavorite={stock.favorite}
//                 isWishlist={stock.wishlist}
//               />
//             ))}
            
//             {filteredStocks.length === 0 && (
//               <div className="col-span-full py-8 text-center text-muted-foreground">
//                 No stocks match your search criteria
//               </div>
//             )}
//           </div>
//         </div>
        
//       )}
//       {
//         <div>
//           <p>{JSON.stringify(stocks)}</p>
//         </div>
//       }
//     </>
//   );
// }


import { useState, useEffect, useCallback, useMemo } from 'react';
import { generateChartData } from '@/lib/mockData';
import { StockCard } from '@/components/ui/stock/Stockcard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';
import { Search, RefreshCw } from 'lucide-react';
import StockDetail from '@/components/ui/stock/StockDetail';
import { useStockPrices } from '@/lib/liveData';

export interface Data {
  _id: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number | null;
  fetched_at: string;
  name: string;
  fetched_at_date: string;
  id: string;
}

export default function StockAnalysis() {
  // Use the stock prices hook
  const { 
    prices, 
    loading, 
    error, 
    fetchStockPrice, 
    updateAllPrices, 
    getUpdatedStocks 
  } = useStockPrices();

  // Get stocks with updated prices
  const stocks = getUpdatedStocks();

  // Load initial prices when component mounts
  useEffect(() => {
    updateAllPrices();
  }, [updateAllPrices]);

  const [stockChartData, setStockChartData] = useState<
    Record<string, Array<{ date: string; value: string }>>
  >({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  // Memoize stock IDs to prevent unnecessary chart regeneration
  const stockIds = useMemo(() => 
    stocks.map(stock => stock.id).sort().join(','), 
    [stocks]
  );

  // Generate chart data only when stock IDs change, not when prices change
  useEffect(() => {
    const chartData: Record<string, Array<{ date: string; value: string }>> = {};
    
    stocks.forEach(stock => {
      // Only generate new chart data if it doesn't exist
      if (!stockChartData[stock.id]) {
        const volatility = 0.02 + (Math.random() * 0.02);
        const days = 14;
        chartData[stock.id] = generateChartData(days, volatility, stock.price * 0.9);
      } else {
        // Keep existing chart data
        chartData[stock.id] = stockChartData[stock.id];
      }
    });
    
    setStockChartData(chartData);
  }, [stockIds]); // Only depend on stockIds, not stocks or stockChartData

  // Get unique sectors for the filter dropdown
  const sectors = useMemo(() => 
    ['all', ...new Set(stocks.map(stock => stock.sector))], 
    [stocks]
  );
  
  // Filter stocks based on search query and sector
  const filteredStocks = useMemo(() => 
    stocks.filter(stock => {
      const matchesSearch = 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
        stock.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSector = selectedSector === 'all' || stock.sector === selectedSector;
      
      return matchesSearch && matchesSector;
    }), 
    [stocks, searchQuery, selectedSector]
  );

  const handleStockClick = useCallback((stockId: string) => {
    setSelectedStock(stockId);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedStock(null);
  }, []);

  const handleRefreshAll = useCallback(async () => {
    try {
      await updateAllPrices();
    } catch (err) {
      console.error('Price update failed:', err);
    }
  }, [updateAllPrices]);

  const handleRefreshStock = useCallback(async (stockId: string) => {
    try {
      await fetchStockPrice(stockId);
    } catch (err) {
      console.error(`Failed to update stock ${stockId}:`, err);
    }
  }, [fetchStockPrice]);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedSector('all');
  }, []);
  
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

            <Button 
              variant="outline" 
              onClick={handleRefreshAll}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Updating...' : 'Refresh Prices'}
            </Button>
            
            <Button variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </div>

          {error && (
            <div className="pr-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">Error updating prices: {error}</p>
            </div>
          )}
          
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 pr-2">
            {filteredStocks.map(stock => (
              <StockCard
                key={stock.id}
                stock={stock}
                chartData={stockChartData[stock.id] || []}
                onClick={() => handleStockClick(stock.id)}
                isFavorite={stock.favorite}
                isWishlist={stock.wishlist}
                onRefresh={() => handleRefreshStock(stock.id)}
                isLoading={loading}
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