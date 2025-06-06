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

import { useState, useEffect } from 'react';
import { 
  marketIndices, 
  stocks, 
  generateChartData
} from '@/lib/mockData';
import { StockCard } from '@/components/ui/stock/Stockcard';
import { MarketIndexCard } from '@/components/ui/stock/MarketIndexCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Overview() {
  const [stockChartData, setStockChartData] = useState<
    Record<string, Array<{ date: string; value: string }>>
  >({});

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

  const favoriteStocks = stocks.filter(stock => stock.favorite);
  const wishlistStocks = stocks.filter(stock => stock.wishlist);
  
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
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-lg font-medium">Favorite Stocks</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {favoriteStocks.map(stock => (
                <StockCard
                  key={stock.id}
                  stock={stock}
                  chartData={stockChartData[stock.id] || []}
                  isFavorite={true}
                />
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-lg font-medium">Watchlist</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {wishlistStocks.map(stock => (
                <StockCard
                  key={stock.id}
                  stock={stock}
                  chartData={stockChartData[stock.id] || []}
                  isWishlist={true}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}