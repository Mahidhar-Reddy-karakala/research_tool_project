import React, { useState } from 'react';
import { PieChart, Briefcase, TrendingUp, TrendingDown, Plus, Trash2, Save, RefreshCw } from 'lucide-react';

interface StockEntry {
  id: string;
  symbol: string;
  shares: number;
  avgPrice: number;
  // dateOfPurchase: string;
}

const Portfolio: React.FC = () => {
  const [stockEntries, setStockEntries] = useState<StockEntry[]>([
    { id: '1', symbol: 'APPL', shares: 100, avgPrice: 150 },
  ]);

  const addStockEntry = () => {
    setStockEntries([
      ...stockEntries,
      { id: Date.now().toString(), symbol: '', shares: 0, avgPrice: 0 },
    ]);
  };

  const removeStockEntry = (id: string) => {
    setStockEntries(stockEntries.filter(entry => entry.id !== id));
  };

  const updateStockEntry = (id: string, field: keyof StockEntry, value: string | number) => {
    setStockEntries(stockEntries.map(entry => {
      if (entry.id === id) {
        return { ...entry, [field]: value };
      }
      return entry;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted entries:', stockEntries);
    // Handle form submission logic here
  };

  const handleReset = () => {
    setStockEntries([{ id: '1', symbol: '', shares: 0, avgPrice: 0 }]);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white mb-6">Portfolio Management</h1>

      {/* Portfolio Entry Form */}
      <div className="bg-gray-900 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Plus className="w-5 h-5 mr-2 text-blue-400" />
          Add Portfolio Entries
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {stockEntries.map((entry, index) => (
            <div key={entry.id} className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Stock Symbol"
                  value={entry.symbol}
                  onChange={(e) => updateStockEntry(entry.id, 'symbol', e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-500 focus:border-blue-400 focus:ring focus:ring-blue-400/20"
                  required
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Number of Shares"
                  value={entry.shares || ''}
                  onChange={(e) => updateStockEntry(entry.id, 'shares', Number(e.target.value))}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-500 focus:border-blue-400 focus:ring focus:ring-blue-400/20"
                  min="0"
                  step="1"
                  required
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Avg Purchase Price"
                  value={entry.avgPrice || ''}
                  onChange={(e) => updateStockEntry(entry.id, 'avgPrice', Number(e.target.value))}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-500 focus:border-blue-400 focus:ring focus:ring-blue-400/20"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              {stockEntries.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStockEntry(entry.id)}
                  className="p-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={addStockEntry}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-500 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Stock</span>
            </button>
            
            <div className="flex-1"></div>
            
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-500 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            
            <button
              type="submit"
              className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-900 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Portfolio</span>
            </button>
          </div>
        </form>
      </div>

      {/* Demo Portfolio Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white mb-4">Demo Portfolio</h2>
        
        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Total Value</p>
                <p className="text-2xl font-bold text-white mt-1">$124,500</p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Today's Gain</p>
                <p className="text-2xl font-bold text-green-400 mt-1">+$1,240</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Total Return</p>
                <p className="text-2xl font-bold text-red-400 mt-1">-2.4%</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Holdings */}
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-blue-400" />
            Holdings
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-400 border-b border-gray-600">
                  <th className="text-left py-3">Symbol</th>
                  <th className="text-left py-3">Shares</th>
                  <th className="text-left py-3">Avg Price</th>
                  <th className="text-left py-3">Current</th>
                  <th className="text-left py-3">Return</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { symbol: 'AAPL', shares: 50, avgPrice: 150.20, current: 155.30, return: '+3.4%' },
                  { symbol: 'MSFT', shares: 30, avgPrice: 280.50, current: 290.75, return: '+3.7%' },
                  { symbol: 'GOOGL', shares: 10, avgPrice: 2750.00, current: 2800.10, return: '+1.8%' },
                  { symbol: 'AMZN', shares: 20, avgPrice: 3300.00, current: 3250.50, return: '-1.5%' },
                ].map((stock, index) => (
                  <tr key={index} className="border-b border-gray-600">
                    <td className="py-4 text-white font-semibold">{stock.symbol}</td>
                    <td className="py-4 text-gray-300">{stock.shares}</td>
                    <td className="py-4 text-gray-300">${stock.avgPrice.toFixed(2)}</td>
                    <td className="py-4 text-gray-300">${stock.current.toFixed(2)}</td>
                    <td className={`py-4 ${
                      stock.return.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stock.return}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Asset Allocation</h2>
            <div className="space-y-4">
              {[
                { type: 'Stocks', percentage: '60%' },
                { type: 'Bonds', percentage: '25%' },
                { type: 'Cash', percentage: '10%' },
                { type: 'Other', percentage: '5%' },
              ].map((asset, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-1">
                    <p className="text-gray-300">{asset.type}</p>
                    <div className="w-full bg-gray-800 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-400 rounded-full h-2"
                        style={{ width: asset.percentage }}
                      ></div>
                    </div>
                  </div>
                  <span className="ml-4 text-white">{asset.percentage}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Transactions</h2>
            <div className="space-y-4">
              {[
                { action: 'Buy', symbol: 'AAPL', amount: '10 shares', date: '2024-03-15' },
                { action: 'Sell', symbol: 'MSFT', amount: '5 shares', date: '2024-03-14' },
                { action: 'Buy', symbol: 'GOOGL', amount: '2 shares', date: '2024-03-13' },
              ].map((transaction, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                  <div>
                    <p className="text-white font-semibold">{transaction.symbol}</p>
                    <p className="text-sm text-gray-400">{transaction.date}</p>
                  </div>
                  <div className={`text-sm ${
                    transaction.action === 'Buy' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {transaction.action} • {transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;