// import { ChartAreaInteractive } from"../components/chart-area-interactive"
// import { DataTable } from "../components/data-table"
// import { SectionCards } from "../components/section-cards"
// import { SiteHeader } from "../components/site-header"
// import { SidebarInset } from "@/components/ui/sidebar"
// import data from "../components/data.json"

// export default function Overview() {
//     return (
//         <div className="flex flex-1 flex-col">
//           <div className="@container/main flex flex-1 flex-col gap-2">
//             <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
//               <SectionCards />
//               <div className="px-4 lg:px-6">
//                 <ChartAreaInteractive />
//               </div>
//               <DataTable data={data} />
//             </div>
//           </div>
//         </div>
//     )
// }

// import { useState, useEffect } from 'react';
// import { 
//   marketIndices, 
//   stocks, 
//   generateChartData
// } from '@/lib/mockData';
// import { StockCard } from '@/components/ui/stock/Stockcard';
// import { MarketIndexCard } from '@/components/ui/stock/MarketIndexCard';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// export default function Overview() {
//   const [stockChartData, setStockChartData] = useState<
//     Record<string, Array<{ date: string; value: string }>>
//   >({});

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

//   const favoriteStocks = stocks.filter(stock => stock.favorite);
//   const wishlistStocks = stocks.filter(stock => stock.wishlist);
  
//   return (
//     <div className="space-y-6 pl-2 pr-2">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Market Overview</h1>
//         <p className="text-muted-foreground">
//           Monitor indices, favorite stocks, and market trends
//         </p>
//       </div>
      
//       <div className="grid gap-4 md:grid-cols-3">
//         {marketIndices.map(index => (
//           <MarketIndexCard key={index.id} index={index} />
//         ))}
//       </div>
      
//       <div className="grid gap-6 md:grid-cols-2">
//         <Card>
//           <CardHeader className="py-3">
//             <CardTitle className="text-lg font-medium">Favorite Stocks</CardTitle>
//           </CardHeader>
//           <CardContent className="p-4">
//             <div className="grid gap-4 sm:grid-cols-2">
//               {favoriteStocks.map(stock => (
//                 <StockCard
//                   key={stock.id}
//                   stock={stock}
//                   chartData={stockChartData[stock.id] || []}
//                   isFavorite={true}
//                 />
//               ))}
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardHeader className="py-3">
//             <CardTitle className="text-lg font-medium">Watchlist</CardTitle>
//           </CardHeader>
//           <CardContent className="p-4">
//             <div className="grid gap-4 sm:grid-cols-2">
//               {wishlistStocks.map(stock => (
//                 <StockCard
//                   key={stock.id}
//                   stock={stock}
//                   chartData={stockChartData[stock.id] || []}
//                   isWishlist={true}
//                 />
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect, useMemo } from 'react';
import { 
  marketIndices, 
  generateChartData
} from '@/lib/mockData';
import { StockCard } from '@/components/ui/stock/Stockcard';
import { MarketIndexCard } from '@/components/ui/stock/MarketIndexCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStockPrices } from '@/lib/liveData';

export default function Overview() {
  // Use the stock prices hook
  const { 
    prices, 
    loading, 
    error, 
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
        const days = 14; // Two weeks of data
        chartData[stock.id] = generateChartData(days, volatility, stock.price * 0.9);
      } else {
        // Keep existing chart data
        chartData[stock.id] = stockChartData[stock.id];
      }
    });
    
    setStockChartData(chartData);
  }, [stockIds]); // Only depend on stockIds, not stocks or stockChartData

  // Memoize filtered stocks to prevent unnecessary recalculations
  const favoriteStocks = useMemo(() => 
    stocks.filter(stock => stock.favorite), 
    [stocks]
  );
  
  const wishlistStocks = useMemo(() => 
    stocks.filter(stock => stock.wishlist), 
    [stocks]
  );
  
  return (
    <div className="space-y-6 pl-2 pr-2">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Market Overview</h1>
        <p className="text-muted-foreground">
          Monitor indices, favorite stocks, and market trends
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {marketIndices.map(index => (
          <MarketIndexCard key={index.id} index={index} />
        ))}
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">Error updating prices: {error}</p>
        </div>
      )}
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-lg font-medium">Favorite Stocks</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {favoriteStocks.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No favorite stocks yet. Add some from the Stock Analysis page.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {favoriteStocks.map(stock => (
                  <StockCard
                    key={stock.id}
                    stock={stock}
                    chartData={stockChartData[stock.id] || []}
                    isFavorite={true}
                    isWishlist={stock.wishlist}
                    isLoading={loading}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-lg font-medium">Watchlist</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {wishlistStocks.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No stocks in watchlist yet. Add some from the Stock Analysis page.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {wishlistStocks.map(stock => (
                  <StockCard
                    key={stock.id}
                    stock={stock}
                    chartData={stockChartData[stock.id] || []}
                    isFavorite={stock.favorite}
                    isWishlist={true}
                    isLoading={loading}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}