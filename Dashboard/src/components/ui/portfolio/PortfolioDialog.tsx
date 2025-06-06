
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

// Set default axios configuration
axios.defaults.withCredentials = true;

interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  sector?: string;
}

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

interface PortfolioStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stocks: Stock[];
  portfolio: PortfolioItem[];
  portfolioItemId?: string | null; // For editing existing items
  onSuccess?: () => void;
  apiBaseUrl?: string; // Allow customizable API endpoint
}

export default function PortfolioStockDialog({
  open,
  onOpenChange,
  stocks,
  portfolio,
  portfolioItemId,
  onSuccess,
  apiBaseUrl = 'http://localhost:5000', // Default API base URL
}: PortfolioStockDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    stockId: '',
    quantity: '0',
    avgBuyPrice: '0',
  });
  const { toast } = useToast();

  const isEditing = !!portfolioItemId;

  // Initialize form data when editing
  useEffect(() => {
    if (isEditing && portfolioItemId && portfolio.length > 0) {
      const existingItem = portfolio.find(item => item._id === portfolioItemId);
      if (existingItem) {
        setFormData({
          stockId: existingItem.stockId,
          quantity: existingItem.quantity.toString(),
          avgBuyPrice: existingItem.avgBuyPrice.toString(),
        });
      }
    } else {
      // Reset form for new entries
      setFormData({
        stockId: '',
        quantity: '0',
        avgBuyPrice: '0',
      });
    }
  }, [isEditing, portfolioItemId, portfolio, open]);

  // Filter out stocks already in portfolio (for adding new)
  const availableStocks = isEditing 
    ? stocks
    : stocks.filter(stock => !portfolio.some(item => item.stockId === stock.id));
    
  // Get current market price for selected stock
  const selectedStock = stocks.find(stock => stock.id === formData.stockId);
  const currentPrice = selectedStock?.price || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const selectedStock = stocks.find(s => s.id === formData.stockId);
    if (!selectedStock) {
      toast({
        title: "Error",
        description: "Please select a stock",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (!formData.quantity || Number(formData.quantity) <= 0 || !formData.avgBuyPrice || Number(formData.avgBuyPrice) <= 0) {
      toast({
        title: "Error",
        description: "Please enter valid quantity and average buy price",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    const portfolioItem = {
      stockId: formData.stockId,
      symbol: selectedStock.symbol,
      name: selectedStock.name,
      quantity: Number(formData.quantity),
      avgBuyPrice: Number(formData.avgBuyPrice),
      currentPrice: selectedStock.price
    };

    try {
      if (isEditing && portfolioItemId) {
        await axios.put(`${apiBaseUrl}/api/portfolio/${portfolioItemId}`, portfolioItem, { 
          withCredentials: true 
        });
        toast({
          title: "Success",
          description: "Stock holding updated successfully"
        });
      } else {
        await axios.post(`${apiBaseUrl}/api/portfolio`, portfolioItem, { 
          withCredentials: true 
        });
        toast({
          title: "Success",
          description: "Stock added to portfolio successfully"
        });
      }
      
      onSuccess?.();
      onOpenChange(false);
      
      // Reset form after successful submission
      setFormData({
        stockId: '',
        quantity: '0',
        avgBuyPrice: '0',
      });
    } catch (error: any) {
      console.error('Portfolio operation failed:', error);
      const errorMessage = error.response?.data?.message || 
        (isEditing ? "Failed to update stock holding" : "Failed to add stock to portfolio");
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset form when canceling
    setFormData({
      stockId: '',
      quantity: '0',
      avgBuyPrice: '0',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Stock Holding' : 'Add New Stock'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Select 
              value={formData.stockId} 
              onValueChange={(value) => updateFormData('stockId', value)}
              disabled={isEditing}
            >
              <SelectTrigger id="stock">
                <SelectValue placeholder="Select stock" />
              </SelectTrigger>
              <SelectContent>
                {(isEditing ? stocks : availableStocks).map(stock => (
                  <SelectItem key={stock.id} value={stock.id}>
                    {stock.symbol} - {stock.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedStock && (
            <div className="text-sm">
              <span className="text-muted-foreground">Current Market Price: </span>
              <span className="font-medium">{formatCurrency(currentPrice)}</span>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => updateFormData('quantity', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avgBuyPrice">Avg. Buy Price (₹)</Label>
              <Input
                id="avgBuyPrice"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.avgBuyPrice}
                onChange={(e) => updateFormData('avgBuyPrice', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          {Number(formData.quantity) > 0 && Number(formData.avgBuyPrice) > 0 && (
            <div className="rounded-lg bg-muted p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span>Total Investment:</span>
                <span className="font-medium">
                  {formatCurrency(Number(formData.quantity) * Number(formData.avgBuyPrice))}
                </span>
              </div>
              {selectedStock && (
                <>
                  <div className="flex justify-between">
                    <span>Current Value:</span>
                    <span className="font-medium">
                      {formatCurrency(Number(formData.quantity) * currentPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-1">
                    <span>Unrealized P&L:</span>
                    <span className={`font-medium ${
                      (Number(formData.quantity) * currentPrice) - (Number(formData.quantity) * Number(formData.avgBuyPrice)) >= 0
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {formatCurrency(
                        (Number(formData.quantity) * currentPrice) - 
                        (Number(formData.quantity) * Number(formData.avgBuyPrice))
                      )}
                      {' '}
                      ({(((Number(formData.quantity) * currentPrice) - (Number(formData.quantity) * Number(formData.avgBuyPrice))) / (Number(formData.quantity) * Number(formData.avgBuyPrice)) * 100).toFixed(2)}%)
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
          
          <DialogFooter className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading 
                ? 'Saving...' 
                : isEditing 
                  ? 'Update' 
                  : 'Add'
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}