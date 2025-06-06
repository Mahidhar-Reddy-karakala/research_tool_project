


import React, { useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Home, LineChart, PieChart, Settings, MessageSquare, Mail, MessageCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import Overview from './pages/Overview';
import StockAnalysis from './pages/StockAnalysis';
import Portfolio from './pages/Portfolio';
import SettingsPage from './pages/Settings';
import FeedbackForm from './pages/FeedbackForm';
import ContactForm from './pages/ContactForm';
import Chatbot from './pages/Chatbot';
import Timeline from './pages/Timeline';


const Dashboard: React.FC = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { path: '/', icon: Home, text: 'Overview' },
    { path: '/analysis', icon: LineChart, text: 'Stock Analysis' },
    { path: '/portfolio', icon: PieChart, text: 'Portfolio' },
    { path: '/timeline', icon: Clock, text: 'Timeline' },
    { path: '/chatbot', icon: MessageCircle, text: 'Chatbot' },
    { path: '/settings', icon: Settings, text: 'Settings' }, // Dynamic route for stock detail
  ];

  const bottomNavItems = [
    { path: '/feedback', icon: MessageSquare, text: 'Feedback' },
    { path: '/contact', icon: Mail, text: 'Contact Us' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
      {/* Left Panel - Collapsible */}
      <div 
        className={`bg-gradient-to-b from-black/80 to-gray-900/80 backdrop-blur-xl text-white flex flex-col flex-shrink-0 border-r border-white/5 transition-all duration-300 ease-in-out relative ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Logo and toggle button at top */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {isSidebarOpen ? (
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              StockDash
            </h1>
          ) : (
            <div className="w-6 h-6 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-xs"></span>
            </div>
          )}
          
          <button 
            onClick={toggleSidebar}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="w-5 h-5 text-gray-300" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-300" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4">
          <ul className="space-y-2 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center ${isSidebarOpen ? 'p-3' : 'p-2 justify-center'} rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 shadow-lg shadow-blue-500/10'
                        : 'hover:bg-white/5 text-gray-300 hover:text-white'
                    }`
                  }
                  title={item.text}
                >
                  <item.icon className={`w-5 h-5 ${isSidebarOpen ? 'mr-3' : ''}`} />
                  {isSidebarOpen && item.text}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Links */}
        <div className="px-2 py-4 border-t border-white/5">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center ${isSidebarOpen ? 'p-3' : 'p-2 justify-center'} rounded-lg transition-all mb-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 shadow-lg shadow-blue-500/10'
                    : 'hover:bg-white/5 text-gray-300 hover:text-white'
                }`
              }
              title={item.text}
            >
              <item.icon className={`w-5 h-5 ${isSidebarOpen ? 'mr-3' : ''}`} />
              {isSidebarOpen && item.text}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-xl shadow-2xl shadow-black/20 p-6 border border-white/5">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/analysis" element={<StockAnalysis />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/feedback" element={<FeedbackForm />} />
              <Route path="/contact" element={<ContactForm />} />
              <Route path="/chatbot" element={<Chatbot />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;