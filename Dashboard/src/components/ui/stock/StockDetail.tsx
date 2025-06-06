import { useState, useEffect } from 'react';
import { stocks, generateChartData } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {BarChart1 } from '@/components/ui/charts/barchart';
import {PieChart1} from '@/components/ui/charts/pie';
import {BarChartMultiple} from '@/components/ui/charts/barchart2'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils';
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Star, StarOff, TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios';
import Markdown from 'react-markdown';

interface StockDetailProps {
  stockId: string;
  chartData: Array<{ date: string; value: string }>;
  onClose: () => void;
}

type StockDocument =[SummaryItem]

export interface SummaryItem {
  sum: string;
  filename: string;
}


export default function StockDetail({ stockId, chartData, onClose }: StockDetailProps) {
  const stock = stocks.find(s => s.id === stockId);
  const [timeRange, setTimeRange] = useState<'1w' | '2w' | '1m' | '3m' | '1y'>('1m');
  const [isFavorite, setIsFavorite] = useState(stock?.favorite || false);
  const [isWishlist, setIsWishlist] = useState(stock?.wishlist || false);
  const [view, setView] = useState<'preview' | 'financials' | 'about'>('preview');
  const [document, setDocument] = useState<StockDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  if (!stock) return null;
  
  const isPositive = stock.changePercent >= 0;

  useEffect(() => {
    const fetchFinancialData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(
          'http://localhost:5000/api/finance/financial-data/6836c54c9ec843ba3b283e90',
          {
            withCredentials: true // Important for sending cookies with the request
          }
        );
        
        if (response.data.success) {
          setDocument(response.data.financialData);
        } else {
          setError(response.data.message || "Failed to fetch financial data");
        }
      } catch (error) {
        console.error("Error fetching financial data:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            setError("Authentication required. Please login again.");
          } else if (error.response?.status === 404) {
            setError("Financial data not found.");
          } else {
            setError(error.response?.data?.message || "Failed to fetch financial data");
          }
        } else {
          setError("Network error. Please check your connection.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  // Generate chart data based on time range
  const getTimeRangeData = () => {
    const days = 
      timeRange === '1w' ? 7 : 
      timeRange === '2w' ? 14 : 
      timeRange === '1m' ? 30 : 
      timeRange === '3m' ? 90 : 
      365;
    
    return generateChartData(days, 0.02, stock.price * 0.7);
  };
  
  const rangeData = getTimeRangeData();
  
  // Mock fundamentals data
  const fundamentals = {
    eps: 45.20,
    pe: 22.5,
    pbv: 3.2,
    beta: 1.15,
    dividend: 2.5,
    roe: 18.4,
    dayHigh: stock.price * 1.03,
    dayLow: stock.price * 0.97,
    yearHigh: stock.price * 1.15,
    yearLow: stock.price * 0.85,
  };
  
  // Mock news
  const news = [
    {
      id: 'n1',
      title: `${stock.name} Reports Strong Q2 Results, Beats Estimates`,
      source: 'Financial Times',
      time: '2 hours ago',
    },
    {
      id: 'n2',
      title: `Analysts Raise Target Price for ${stock.symbol} Following Earnings`,
      source: 'Economic Times',
      time: '5 hours ago',
    },
    {
      id: 'n3',
      title: `${stock.sector} Sector Outlook: What It Means for ${stock.name}`,
      source: 'Market Watch',
      time: '1 day ago',
    },
  ];
  
  return (
    <div className="space-y-6 pl-2 pr-2">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="flex items-center space-x-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Search</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (isFavorite) {
              setIsFavorite(false);
            } else if (isWishlist) {
              setIsWishlist(false);
              setIsFavorite(true);
            } else {
              setIsWishlist(true);
            }
          }}
        >
          {isFavorite ? (
            <>
              <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>Favorite</span>
            </>
          ) : isWishlist ? (
            <>
              <Star className="mr-1 h-4 w-4" />
              <span>Watchlist</span>
            </>
          ) : (
            <>
              <StarOff className="mr-1 h-4 w-4" />
              <span>Add to Watchlist</span>
            </>
          )}
        </Button>
      </div>
      
      <div className="pl-4 flex flex-col space-y-2">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">{stock.symbol}</h1>
          <span className="ml-2 text-lg text-muted-foreground">{stock.name}</span>
          <span className="ml-2 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
            {stock.sector}
          </span>
        </div>
        
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold">{formatCurrency(stock.price)}</span>
          <span className={`flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? (
              <TrendingUp className="mr-1 h-4 w-4" />
            ) : (
              <TrendingDown className="mr-1 h-4 w-4" />
            )}
            <span>{formatCurrency(stock.change)}</span>
            <span className="ml-1">({formatPercentage(stock.changePercent)})</span>
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button
          variant={view === 'preview' ? 'secondary' : 'ghost'}
          onClick={() => setView('preview')}
        >
          Preview
        </Button>
        <Button
          variant={view === 'financials' ? 'secondary' : 'ghost'}
          onClick={() => setView('financials')}
        >
          Financials
        </Button>
        <Button
          variant={view === 'about' ? 'secondary' : 'ghost'}
          onClick={() => setView('about')}
        >
          About
        </Button>
      </div>

      {view === 'preview' && (
        <>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Price Chart</CardTitle>
                <div className="flex items-center space-x-1">
                  <Button 
                    variant={timeRange === '1w' ? 'secondary' : 'ghost'} 
                    size="sm"
                    onClick={() => setTimeRange('1w')}
                  >
                    1W
                  </Button>
                  <Button 
                    variant={timeRange === '2w' ? 'secondary' : 'ghost'} 
                    size="sm"
                    onClick={() => setTimeRange('2w')}
                  >
                    2W
                  </Button>
                  <Button 
                    variant={timeRange === '1m' ? 'secondary' : 'ghost'} 
                    size="sm"
                    onClick={() => setTimeRange('1m')}
                  >
                    1M
                  </Button>
                  <Button 
                    variant={timeRange === '3m' ? 'secondary' : 'ghost'} 
                    size="sm"
                    onClick={() => setTimeRange('3m')}
                  >
                    3M
                  </Button>
                  <Button 
                    variant={timeRange === '1y' ? 'secondary' : 'ghost'} 
                    size="sm"
                    onClick={() => setTimeRange('1y')}
                  >
                    1Y
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={rangeData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
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
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(date) => {
                        if (timeRange === '1w' || timeRange === '2w') {
                          return date.slice(-2);
                        }
                        return date.slice(5);
                      }}
                    />
                    <YAxis 
                      domain={['auto', 'auto']}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => formatCurrency(Number(value))}
                    />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(Number(value)), 'Price']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={isPositive ? "hsl(var(--chart-1))" : "hsl(var(--destructive))"}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="fundamentals">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
              <TabsTrigger value="news">Latest News</TabsTrigger>
            </TabsList>
            <TabsContent value="fundamentals" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Market Cap</dt>
                        <dd className="font-medium">{formatCurrency(stock.marketCap * 1000000000)}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Volume (Mn)</dt>
                        <dd className="font-medium">{formatNumber(stock.volume)}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">P/E Ratio</dt>
                        <dd className="font-medium">{fundamentals.pe.toFixed(2)}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">EPS (₹)</dt>
                        <dd className="font-medium">{fundamentals.eps.toFixed(2)}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">P/BV</dt>
                        <dd className="font-medium">{fundamentals.pbv.toFixed(2)}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">ROE (%)</dt>
                        <dd className="font-medium">{fundamentals.roe.toFixed(2)}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Beta</dt>
                        <dd className="font-medium">{fundamentals.beta.toFixed(2)}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Dividend (%)</dt>
                        <dd className="font-medium">{fundamentals.dividend.toFixed(2)}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Price Range</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-4 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Today's Range</dt>
                        <dd className="mt-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{formatCurrency(fundamentals.dayLow)}</span>
                            <div className="h-2 flex-1 rounded-full bg-secondary">
                              <div 
                                className="h-full rounded-full bg-primary" 
                                style={{ 
                                  width: `${((stock.price - fundamentals.dayLow) / (fundamentals.dayHigh - fundamentals.dayLow)) * 100}%` 
                                }}
                              />
                            </div>
                            <span className="font-medium">{formatCurrency(fundamentals.dayHigh)}</span>
                          </div>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">52 Week Range</dt>
                        <dd className="mt-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{formatCurrency(fundamentals.yearLow)}</span>
                            <div className="h-2 flex-1 rounded-full bg-secondary">
                              <div 
                                className="h-full rounded-full bg-primary" 
                                style={{ 
                                  width: `${((stock.price - fundamentals.yearLow) / (fundamentals.yearHigh - fundamentals.yearLow)) * 100}%` 
                                }}
                              />
                            </div>
                            <span className="font-medium">{formatCurrency(fundamentals.yearHigh)}</span>
                          </div>
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Based on recent performance and market trends, {stock.name} ({stock.symbol}) shows {isPositive ? 'positive momentum' : 'some weakness'} in the short term. The company's fundamentals remain {fundamentals.pe < 20 ? 'reasonably valued' : 'somewhat expensive'} with a P/E ratio of {fundamentals.pe.toFixed(2)}. 
                    
                    {stock.sector === 'Technology' && ' The technology sector continues to show resilience despite broader market volatility. Key catalysts to watch include upcoming product launches and expansion into new markets.'}
                    
                    {stock.sector === 'Financial' && ' The financial sector is navigating a complex interest rate environment. Watch for impacts of monetary policy changes and credit growth trends in upcoming quarters.'}
                    
                    {stock.sector === 'Energy' && ' The energy sector is experiencing transformation amid global shifts toward cleaner energy alternatives. Monitor commodity price trends and regulatory developments.'}
                    
                    Analysts consensus suggests a {isPositive ? 'moderate buy' : 'hold'} rating, with an average target price approximately {isPositive ? '12-15%' : '5-8%'} above current levels.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="news">
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {news.map((item) => (
                      <div key={item.id} className="p-4">
                        <h3 className="font-medium">{item.title}</h3>
                        <div className="mt-1 flex items-center text-sm text-muted-foreground">
                          <span>{item.source}</span>
                          <span className="mx-1">•</span>
                          <span>{item.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {view === 'financials' && (
        <Card>
          <CardHeader>
            <CardTitle>Financial Information</CardTitle>
          </CardHeader>
          <CardContent>
            {/* {loading && <p>Loading financial data...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {!loading && !error && document && (
              <div>
                {document.xbrl_data && document.xbrl_data.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">XBRL Financial Data</h3>
                    {document.xbrl_data.map((item, index) => (
                      <div key={index} className="border rounded p-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Source:</strong> {item.filename}
                        </p>
                        <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
                          {JSON.stringify(item.data, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No XBRL financial data available.</p>
                )}
              </div>
            )}
            {!loading && !error && !document && (
              <p>Financial information will be available soon.</p>
            )} */}

            <div className='flex left-0'>
              <BarChart1></BarChart1>
              <div className='ml-4'>
              <PieChart1 ></PieChart1>
              </div>
              <div className='ml-4'>
                <BarChartMultiple></BarChartMultiple>
              </div>
            </div>
            
          </CardContent>
        </Card>
      )}

      {view === 'about' && (
        <Card>
          <CardHeader>
            <CardTitle>Financial Summaries</CardTitle>
          </CardHeader>
          
          <CardContent>
            {loading && <p>Loading summaries...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {!loading && !error && document?.length ? (
              document.length > 0 ? (
                document.map((item, index) => (
                  <div key={index} className="mb-6">
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Filename:</strong> {item.filename}
                    </p>
                    <p className="text-base"><Markdown>{item.sum}</Markdown></p>
                  </div>
                ))
              ) : (
                <p>No summaries available.</p>
              )
            ) : !loading && !error && (
              <p>Summary information will be available soon.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}