import React,{useEffect,useState}from 'react';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Overview: React.FC = () => {


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Market Value', icon: TrendingUp, value: '$2.4M', change: '+12.5%' },
          { title: 'Active Traders', icon: Users, value: '1,234', change: '+3.2%' },
          { title: 'Total Revenue', icon: DollarSign, value: '$890K', change: '+5.8%' },
          { title: 'Market Activity', icon: Activity, value: '2.1K', change: '+15.3%' },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <stat.icon className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <p className="text-green-400 text-sm mt-4">{stat.change} from last month</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gray-900 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            'Market analysis report generated',
            'Portfolio rebalancing completed',
            'New stock alert: AAPL exceeded threshold',
            'Weekly performance summary updated',
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg"
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <p className="text-gray-200">{activity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;