import React from 'react';
import { LineChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StockAnalysis: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Stock Analysis</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Trends */}
        <div className="lg:col-span-2 bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <LineChart className="w-5 h-5 mr-2 text-blue-400" />
            Market Trends
          </h2>
          <div className="h-64 flex items-center justify-center border border-gray-600 rounded-lg">
            <p className="text-gray-400">Chart placeholder</p>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Top Performers</h2>
          <div className="space-y-4">
            {[
              { symbol: 'AAPL', change: '+2.4%', price: '$150.23' },
              { symbol: 'MSFT', change: '+1.8%', price: '$290.45' },
              { symbol: 'GOOGL', change: '-0.5%', price: '$2,800.10' },
            ].map((stock, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-white">{stock.symbol}</p>
                  <p className="text-sm text-gray-400">{stock.price}</p>
                </div>
                <div className={`flex items-center ${
                  stock.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stock.change.startsWith('+') ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {stock.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Technical Indicators</h2>
          <div className="space-y-3">
            {[
              { name: 'Moving Average', value: '45.67' },
              { name: 'RSI', value: '62.3' },
              { name: 'MACD', value: '0.45' },
            ].map((indicator, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-300">{indicator.name}</span>
                <span className="text-white font-mono">{indicator.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Market Sentiment</h2>
          <div className="space-y-3">
            {[
              { metric: 'Fear & Greed Index', value: '65 - Greed' },
              { metric: 'Volatility', value: 'Moderate' },
              { metric: 'Momentum', value: 'Strong' },
            ].map((metric, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-300">{metric.metric}</span>
                <span className="text-white">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockAnalysis;

