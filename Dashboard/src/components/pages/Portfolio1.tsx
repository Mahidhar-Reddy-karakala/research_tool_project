import { useState, useEffect } from 'react';
import axios from 'axios';
import { stocks } from '@/lib/mockData';
import { formatCurrency, calculateProfitLoss } from '@/lib/utils';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Plus, Brain, Trash2, X } from 'lucide-react';
import PortfolioStockDialog from '@/components/ui/portfolio/PortfolioDialog';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Markdown from 'react-markdown';

// Interface definitions
interface PortfolioItem {
  _id: string;
  stockId: string;
  symbol: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface StockData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  sector: string;
  favorite?: boolean;
  wishlist?: boolean;
}

interface AnalysisData {
  success: boolean;
  metrics: {
    totalValue: number;
    totalInvestment: number;
    totalProfitLoss: number;
    profitLossPercentage: number;
  };
  analysis: string;
  timestamp: string;
  itemsAnalyzed: number;
  source?: string;
  warning?: string;
}

export default function Portfolio() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPortfolioItem, setEditingPortfolioItem] = useState<string | null>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/portfolio', { 
        withCredentials: true 
      });
      
      // Update current prices with latest stock data
      const updatedPortfolio = Array.isArray(response.data) 
        ? response.data.map((item: PortfolioItem) => {
            const currentStock = stocks.find(stock => stock.id === item.stockId);
            return {
              ...item,
              currentPrice: currentStock?.price || item.currentPrice
            };
          })
        : [];
      
      setPortfolioData(updatedPortfolio);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      toast({
        title: "Error",
        description: "Failed to fetch portfolio data",
        variant: "destructive"
      });
      setPortfolioData([]);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/portfolio/${id}`, { 
        withCredentials: true 
      });
      toast({
        title: "Success",
        description: "Portfolio item deleted successfully"
      });
      fetchPortfolioData();
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      toast({
        title: "Error",
        description: "Failed to delete portfolio item",
        variant: "destructive"
      });
    } finally {
      setDeleteItemId(null);
    }
  };

  // const handleAnalyzePortfolio = async () => {
  //   if (portfolioData.length === 0) {
  //     toast({
  //       title: "No Data",
  //       description: "Add some stocks to your portfolio first",
  //       variant: "destructive"
  //     });
  //     return;
  //   }

  //   setIsAnalyzing(true);
  //   try {
  //     // Prepare portfolio items for Flask API
  //     const portfolioItems = portfolioData.map(item => ({
  //       symbol: item.symbol,
  //       name: item.name,
  //       quantity: item.quantity,
  //       avgBuyPrice: item.avgBuyPrice,
  //       currentPrice: item.currentPrice
  //     }));

  //     // Call Flask API directly
  //     const response = await axios.post('http://localhost:8000/analyze', {
  //       portfolioItems: portfolioItems
  //     }, {
  //       timeout: 30000, // 30 seconds timeout
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     });
      
  //     if (response.data && response.data.success) {
  //       setAnalysisData({
  //         ...response.data,
  //         source: 'Flask API (Direct)',
  //         warning: undefined
  //       });
  //       setShowAnalysis(true);
        
  //       toast({
  //         title: "Analysis Complete",
  //         description: `Portfolio analysis completed successfully. ${response.data.itemsAnalyzed} items analyzed.`,
  //       });
  //     } else {
  //       throw new Error(response.data?.message || 'Analysis failed');
  //     }
  //   } catch (error: any) {
  //     console.error('Error analyzing portfolio:', error);
      
  //     let errorMessage = "Failed to analyze portfolio";
  //     if (error.code === 'ECONNABORTED') {
  //       errorMessage = "Analysis request timed out. Please try again.";
  //     } else if (error.response?.status === 502) {
  //       errorMessage = "Failed to contact AI service. Please check if the Flask server is running.";
  //     } else if (error.response?.data?.message) {
  //       errorMessage = error.response.data.message;
  //     } else if (error.message) {
  //       errorMessage = error.message;
  //     }
      
  //     toast({
  //       title: "Analysis Error",
  //       description: errorMessage,
  //       variant: "destructive"
  //     });
  //   } finally {
  //     setIsAnalyzing(false);
  //   }
  // };
const handleAnalyzePortfolio = async () => {
  if (portfolioData.length === 0) {
    toast({
      title: "No Data",
      description: "Add some stocks to your portfolio first",
      variant: "destructive"
    });
    return;
  }

  setIsAnalyzing(true);
  try {
    // Prepare portfolio items for Flask API
    const portfolioItems = portfolioData.map(item => ({
      symbol: item.symbol,
      quantity: item.quantity,
      avgBuyPrice: item.avgBuyPrice,
      currentPrice: item.currentPrice
    }));

    // Call Flask API using fetch
    const response = await fetch('http://localhost:8000/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        portfolioItems: portfolioItems
      })
    });

    // Check for successful response
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        setAnalysisData({
          ...data,
          source: 'Flask API (Direct)',
          warning: undefined
        });
        setShowAnalysis(true);

        toast({
          title: "Analysis Complete",
          description: `Portfolio analysis completed successfully. ${data.itemsAnalyzed} items analyzed.`,
        });
      } else {
        throw new Error(data.message || 'Analysis failed');
      }
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error analyzing portfolio:', error);

    let errorMessage = "Failed to analyze portfolio";

    // Handle error from fetch or network issues
    if (error instanceof Error) {
      if (error.code === 'ECONNABORTED') {
        errorMessage = "Analysis request timed out. Please try again.";
      } else if (error.message.includes('502')) {
        errorMessage = "Failed to contact AI service. Please check if the Flask server is running.";
      } else if (error.message) {
        errorMessage = error.message;
      }
    } else if (error && typeof error === 'object' && 'message' in error) {
      // If the error is an object and has a message property
      errorMessage = error.message;
    } else {
      errorMessage = "An unknown error occurred.";
    }

    toast({
      title: "Analysis Error",
      description: errorMessage,
      variant: "destructive"
    });
  } finally {
    setIsAnalyzing(false);
  }
};



  const closeAnalysis = () => {
    setShowAnalysis(false);
    setAnalysisData(null);
  };

  // Calculate portfolio summary
  const portfolioSummary = portfolioData.reduce(
    (acc, item) => {
      const investment = item.quantity * item.avgBuyPrice;
      const currentValue = item.quantity * item.currentPrice;
      const pl = currentValue - investment;
      
      acc.totalInvestment += investment;
      acc.currentValue += currentValue;
      acc.totalProfitLoss += pl;
      
      return acc;
    },
    { totalInvestment: 0, currentValue: 0, totalProfitLoss: 0 }
  );
  
  const profitLossPercent = portfolioSummary.totalInvestment > 0 
    ? (portfolioSummary.totalProfitLoss / portfolioSummary.totalInvestment) * 100 
    : 0;
  const isProfit = portfolioSummary.totalProfitLoss >= 0;
  
  // Prepare data for pie chart
  const sectorData = portfolioData.reduce((acc, item) => {
    const stock = stocks.find(s => s.id === item.stockId);
    const sector = stock?.sector || 'Unknown';
    const value = item.quantity * item.currentPrice;
    
    const existingSector = acc.find(s => s.name === sector);
    if (existingSector) {
      existingSector.value += value;
    } else {
      acc.push({ name: sector, value });
    }
    
    return acc;
  }, [] as Array<{ name: string; value: number }>);
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Function to render markdown-like content as HTML
  const renderAnalysisContent = (content: string) => {
    // Simple markdown-to-HTML conversion for basic formatting
    return content
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mt-3 mb-2">$1</h3>')
      .replace(/^\*\*(.*)\*\*$/gm, '<strong>$1</strong>')
      .replace(/^\* (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/\n\n/g, '</p><p class="mb-2">')
      .replace(/^(.*)$/gm, '<p class="mb-2">$1</p>');
  };
  
  return (
    <div className="space-y-6 p-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
          <p className="text-muted-foreground">
            Manage and track your stock investments
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleAnalyzePortfolio} 
            disabled={isAnalyzing || portfolioData.length === 0}
            variant="outline"
          >
            <Brain className="mr-2 h-4 w-4" />
            {isAnalyzing ? 'Analyzing...' : 'AI Analyze'}
          </Button>
          <Button onClick={() => {
            setEditingPortfolioItem(null);
            setIsDialogOpen(true);
          }}>
            <Plus className="mr-1 h-4 w-4" />
            Add Stock
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(portfolioSummary.totalInvestment)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Current Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(portfolioSummary.currentValue)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Total P/L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(portfolioSummary.totalProfitLoss)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">P/L %</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
              {profitLossPercent.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Holdings</CardTitle>
            <CardDescription>
              Your current stock positions and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {portfolioData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No stocks in your portfolio yet.</p>
                <Button 
                  className="mt-4" 
                  onClick={() => {
                    setEditingPortfolioItem(null);
                    setIsDialogOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Stock
                </Button>
              </div>
            ) : (
              <Table>
                <TableCaption>A list of your stock holdings.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stock</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Avg. Price</TableHead>
                    <TableHead>Current</TableHead>
                    <TableHead>P/L</TableHead>
                    <TableHead>% Return</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolioData.map((item) => {
                    const { pl, plPercentage } = calculateProfitLoss(
                      item.quantity,
                      item.avgBuyPrice,
                      item.currentPrice
                    );
                    const isItemProfit = pl >= 0;
                    
                    return (
                      <TableRow key={item._id}>
                        <TableCell className="font-medium">
                          <div>{item.symbol}</div>
                          <div className="text-xs text-muted-foreground">{item.name}</div>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.avgBuyPrice)}</TableCell>
                        <TableCell>{formatCurrency(item.currentPrice)}</TableCell>
                        <TableCell className={isItemProfit ? 'text-green-500' : 'text-red-500'}>
                          {formatCurrency(pl)}
                        </TableCell>
                        <TableCell className={isItemProfit ? 'text-green-500' : 'text-red-500'}>
                          {plPercentage.toFixed(2)}%
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setEditingPortfolioItem(item._id);
                                setIsDialogOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteItemId(item._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sector Allocation</CardTitle>
            <CardDescription>
              Diversification across sectors
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sectorData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No data to display
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sectorData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [formatCurrency(Number(value)), 'Value']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis Results Section - Displayed at Bottom */}
      {showAnalysis && analysisData && (
        <Card className="mt-6 border-2 border-blue-200 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Brain className="h-5 w-5" />
                AI Portfolio Analysis
              </CardTitle>
              <CardDescription>
                Generated on {new Date(analysisData.timestamp).toLocaleString()}
                <span className="text-blue-600 ml-2 font-medium">
                  📊 Direct Flask API Analysis
                </span>
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={closeAnalysis}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {analysisData.metrics && (
              <div className="grid gap-4 md:grid-cols-4 mb-6 p-4 bg-white rounded-lg border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(analysisData.metrics.totalValue)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Value</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(analysisData.metrics.totalInvestment)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Investment</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    analysisData.metrics.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(analysisData.metrics.totalProfitLoss)}
                  </div>
                  <div className="text-sm text-muted-foreground">Profit/Loss</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    analysisData.metrics.profitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {analysisData.metrics.profitLossPercentage.toFixed(2)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Return %</div>
                </div>
              </div>
            )}
            
            <div className="prose max-w-none bg-white rounded-lg p-4 border">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: renderAnalysisContent(analysisData.analysis) 
                }}
                className="space-y-4"
              />
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground border-t pt-4 bg-white rounded-lg p-3 border">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    🔗 <strong>Source:</strong> Flask API (Port 8000)
                  </span>
                  
                  <span className="flex items-center gap-1">
                    📈 <strong>Items:</strong>{<Markdown>analysisData.itemsAnalyzed</Markdown>}
                    
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  Direct API Call - No Express Middleware
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <PortfolioStockDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        stocks={stocks}
        portfolio={portfolioData}
        portfolioItemId={editingPortfolioItem}
        onSuccess={fetchPortfolioData}
        apiBaseUrl="http://localhost:5000"
      />

      <AlertDialog open={!!deleteItemId} onOpenChange={() => setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the portfolio item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteItemId && handleDeleteItem(deleteItemId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}