import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search as SearchIcon, TrendingUp, History } from 'lucide-react';
import { stocks } from '@/lib/mockData';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredStocks = stocks.filter(stock => 
    stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const trendingSearches = [
    'RELIANCE',
    'TCS',
    'HDFC Bank',
    'Infosys',
  ];

  const recentSearches = [
    'ICICI Bank',
    'Bharti Airtel',
    'Tata Motors',
  ];

  return (
    <div className="space-y-6 p-2">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Search</h1>
        <p className="text-muted-foreground">
          Search for stocks, companies, and market information
        </p>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search stocks by name or symbol..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {searchQuery ? (
        <div className="grid gap-4">
          {filteredStocks.map((stock) => (
            <Card key={stock.id} className="cursor-pointer hover:bg-muted/50">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-semibold">{stock.symbol}</h3>
                  <p className="text-sm text-muted-foreground">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{stock.price.toFixed(2)}</p>
                  <p className={`text-sm ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredStocks.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No results found for "{searchQuery}"
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Trending Searches</h2>
              </div>
              <div className="space-y-2">
                {trendingSearches.map((term) => (
                  <Button
                    key={term}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setSearchQuery(term)}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <History className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Recent Searches</h2>
              </div>
              <div className="space-y-2">
                {recentSearches.map((term) => (
                  <Button
                    key={term}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setSearchQuery(term)}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}