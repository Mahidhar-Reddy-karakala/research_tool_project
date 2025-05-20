// import React from 'react';
// import { 
//   LineChart, 
//   Search, 
//   Brain, 
//   BarChart3, 
//   History, 
//   Briefcase,
//   ArrowRight,
//   Github,
//   Twitter,
//   Linkedin
// } from 'lucide-react';

// function Landing() {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900 text-white ">
//       {/* Hero Section */}
//       <div className="relative min-h-screen flex items-center">
//         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1642790106117-e829e14a795f')] bg-cover bg-center opacity-10"></div>
//         <div className="container mx-auto px-4 py-16 relative z-10">
//           <div className="max-w-3xl mx-auto text-center">
//             <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
//               Unlock the Power of Stock Data with AI-Driven Insights
//             </h1>
//             <p className="text-xl md:text-2xl text-gray-300 mb-8">
//               Analyze, query, and visualize stock trends in real-time
//             </p>
//             <button  onClick={() => window.location.href = '/login'} className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 rounded-lg text-lg font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] flex items-center gap-2 mx-auto">
//               Get Started <ArrowRight className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Features Section */}
//       <div className="py-24 bg-black/30">
//         <div className="container mx-auto px-4">
//           <h2 className="text-4xl font-bold text-center mb-16">Key Features</h2>
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[
//               { icon: Search, title: 'Interactive Stock Querying', desc: 'Advanced search and filtering capabilities' },
//               { icon: Brain, title: 'AI-Driven Analysis', desc: 'Predictive insights powered by machine learning' },
//               { icon: BarChart3, title: 'Real-time Visualization', desc: 'Dynamic charts and interactive graphs' },
//               { icon: History, title: 'Historical Tracking', desc: 'Comprehensive historical data analysis' },
//               { icon: Briefcase, title: 'Portfolio Management', desc: 'Track and manage your investments' },
//               { icon: LineChart, title: 'Market Trends', desc: 'Stay updated with market movements' }
//             ].map((feature, index) => (
//               <div key={index} className="p-6 rounded-xl bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-300 backdrop-blur-sm">
//                 <feature.icon className="w-12 h-12 text-cyan-400 mb-4" />
//                 <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
//                 <p className="text-gray-400">{feature.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* How It Works */}
//       <div className="py-24">
//         <div className="container mx-auto px-4">
//           <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               { step: '01', title: 'Search & Analyze', desc: 'Find stocks and analyze market data' },
//               { step: '02', title: 'Get AI-Powered Insights', desc: 'Receive intelligent predictions and recommendations' },
//               { step: '03', title: 'Make Data-Driven Decisions', desc: 'Execute informed trading strategies' }
//             ].map((step, index) => (
//               <div key={index} className="text-center">
//                 <div className="text-6xl font-bold text-cyan-400/20 mb-4">{step.step}</div>
//                 <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
//                 <p className="text-gray-400">{step.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Pricing */}
//       <div className="py-24 bg-black/30">
//         <div className="container mx-auto px-4">
//           <h2 className="text-4xl font-bold text-center mb-16">Pricing Plans</h2>
//           <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
//             {[
//               {
//                 title: 'Free',
//                 price: '$0',
//                 features: ['Basic stock analysis', 'Limited historical data', 'Standard charts', '5 saved searches']
//               },
//               {
//                 title: 'Premium',
//                 price: '$49',
//                 features: ['Advanced AI insights', 'Full historical data', 'Real-time alerts', 'Unlimited saved searches']
//               }
//             ].map((plan, index) => (
//               <div key={index} className={`p-8 rounded-xl ${index === 1 ? 'bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-500/20' : 'bg-gray-800/50'}`}>
//                 <h3 className="text-2xl font-bold mb-4">{plan.title}</h3>
//                 <div className="text-4xl font-bold mb-6">{plan.price}<span className="text-lg text-gray-400">/month</span></div>
//                 <ul className="space-y-3">
//                   {plan.features.map((feature, i) => (
//                     <li key={i} className="flex items-center gap-2">
//                       <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
//                       {feature}
//                     </li>
//                   ))}
//                 </ul>
//                 <button className={`w-full mt-8 py-3 rounded-lg font-semibold transition-all duration-300 ${index === 1 ? 'bg-cyan-500 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]' : 'bg-gray-700 hover:bg-gray-600'}`}>
//                   Get Started
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="py-12 border-t border-gray-800">
//         <div className="container mx-auto px-4">
//           <div className="grid md:grid-cols-4 gap-8">
//             <div>
//               <h4 className="font-bold mb-4">Quick Links</h4>
//               <ul className="space-y-2">
//                 <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-bold mb-4">Features</h4>
//               <ul className="space-y-2">
//                 <li><a href="#" className="text-gray-400 hover:text-white">Analysis</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white">AI Insights</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white">Portfolio</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white">API</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-bold mb-4">Resources</h4>
//               <ul className="space-y-2">
//                 <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-bold mb-4">Connect</h4>
//               <div className="flex space-x-4">
//                 <a href="#" className="text-gray-400 hover:text-white">
//                   <Github className="w-6 h-6" />
//                 </a>
//                 <a href="#" className="text-gray-400 hover:text-white">
//                   <Twitter className="w-6 h-6" />
//                 </a>
//                 <a href="#" className="text-gray-400 hover:text-white">
//                   <Linkedin className="w-6 h-6" />
//                 </a>
//               </div>
//             </div>
//           </div>
//           <div className="mt-12 text-center text-gray-400">
//             <p>&copy; 2025 Stock Analysis Platform. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default Landing;


//
//import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, TrendingUp, PieChart, Activity,
  Github, Twitter, Linkedin
 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ScrollReveal from '../components/ScrollReveal';

const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Landing = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-bg min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="text-center"
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Advanced <span className="gradient-text">Stock Analysis</span><br />
              Made Simple
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
            >
              Unlock the power of data-driven investment decisions with real-time analytics,
              advanced charting, and AI-powered insights.
            </motion.p>
            <motion.div 
              variants={fadeInUp}
              className="flex justify-center space-x-4"
            >
              <Link 
                to="/register" 
                className="btn-primary"
              >
                Get Started Free
              </Link>
              <button className="btn-secondary">
                Watch Demo
              </button>
            </motion.div>
          </motion.div>

          <ScrollReveal>
            <div className="mt-16 chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(20, 20, 25, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#2563eb"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Powerful Features for Smart Investing
              </h2>
              <p className="text-gray-400 text-lg">
                Everything you need to make informed investment decisions
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <LineChart className="w-8 h-8 text-primary" />,
                title: "Real-time Charts",
                description: "Live market data and interactive charts"
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-primary" />,
                title: "Trend Analysis",
                description: "Advanced technical indicators and patterns"
              },
              {
                icon: <PieChart className="w-8 h-8 text-primary" />,
                title: "Portfolio Tracking",
                description: "Monitor and analyze your investments"
              },
              {
                icon: <Activity className="w-8 h-8 text-primary" />,
                title: "Market Alerts",
                description: "Custom notifications for price movements"
              }
            ].map((feature, index) => (
              <ScrollReveal key={index}>
                <div className="feature-card">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Features</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Analysis</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">AI Insights</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Portfolio</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Github className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center text-gray-400">
            <p>&copy; 2025 Stock Analysis Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;