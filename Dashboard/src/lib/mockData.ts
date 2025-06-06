// Mock data for the financial dashboard

export interface StockData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number; // in billions
  volume: number; // in millions
  sector: string;
  favorite?: boolean;
  wishlist?: boolean;
}

export interface PortfolioItem {
  id: string;
  stockId: string;
  symbol: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
}

export interface TimelinePost {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  stockMentions: string[];
}

export interface MarketIndex {
  id: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Mock Market Indices
export const marketIndices: MarketIndex[] = [
  {
    id: 'nifty',
    name: 'NIFTY 50',
    value: 22345.20,
    change: 245.20,
    changePercent: 1.27,
  },
  {
    id: 'banknifty',
    name: 'BANK NIFTY',
    value: 48560.35,
    change: -120.15,
    changePercent: -0.25,
  },
  {
    id: 'sensex',
    name: 'SENSEX',
    value: 73450.60,
    change: 680.40,
    changePercent: 0.94,
  },
];

// Mock Stocks Data
export const stocks: StockData[] = [
  {
    id: '1',
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    price: 2430.75,
    change: 45.80,
    changePercent: 1.92,
    marketCap: 1540.5,
    volume: 6.2,
    sector: 'Energy',
    favorite: true,
  },
  {
    id: '2',
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    price: 3560.25,
    change: -12.30,
    changePercent: -0.34,
    marketCap: 1230.2,
    volume: 3.1,
    sector: 'Technology',
    favorite: true,
  },
  {
    id: '3',
    symbol: 'INFY',
    name: 'Infosys',
    price: 1425.10,
    change: 28.50,
    changePercent: 2.04,
    marketCap: 615.8,
    volume: 5.4,
    sector: 'Technology',
    wishlist: true,
  },
  {
    id: '4',
    symbol: 'HDFCBANK',
    name: 'HDFC Bank',
    price: 1680.40,
    change: -5.60,
    changePercent: -0.33,
    marketCap: 945.3,
    volume: 8.7,
    sector: 'Financial',
    favorite: true,
  },
  {
    id: '5',
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel',
    price: 965.20,
    change: 15.40,
    changePercent: 1.62,
    marketCap: 510.2,
    volume: 4.8,
    sector: 'Telecom',
    wishlist: true,
  },
  {
    id: '6',
    symbol: 'ICICIBANK',
    name: 'ICICI Bank',
    price: 980.65,
    change: 12.80,
    changePercent: 1.32,
    marketCap: 725.4,
    volume: 6.3,
    sector: 'Financial',
    favorite: true,
  },
  {
    id: '7',
    symbol: 'TATAMOTORS',
    name: 'Tata Motors',
    price: 845.30,
    change: -2.75,
    changePercent: -0.32,
    marketCap: 320.1,
    volume: 12.5,
    sector: 'Automotive',
    wishlist: true,
  },
  {
    id: '8',
    symbol: 'WIPRO',
    name: 'Wipro',
    price: 425.85,
    change: 8.35,
    changePercent: 2.00,
    marketCap: 235.6,
    volume: 3.9,
    sector: 'Technology',
  },
  {
    id: '9',
    symbol: 'SUNPHARMA',
    name: 'Sun Pharmaceutical',
    price: 1125.50,
    change: -15.25,
    changePercent: -1.34,
    marketCap: 270.3,
    volume: 2.8,
    sector: 'Healthcare',
  },
  {
    id: '10',
    symbol: 'KOTAKBANK',
    name: 'Kotak Mahindra Bank',
    price: 1760.40,
    change: 22.35,
    changePercent: 1.29,
    marketCap: 385.7,
    volume: 3.2,
    sector: 'Financial',
  },
];

// Mock Portfolio Data
export const portfolio: PortfolioItem[] = [
  {
    id: 'p1',
    stockId: '1',
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    quantity: 50,
    avgBuyPrice: 2350.60,
    currentPrice: 2430.75,
  },
  {
    id: 'p2',
    stockId: '2',
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    quantity: 20,
    avgBuyPrice: 3650.25,
    currentPrice: 3560.25,
  },
  {
    id: 'p3',
    stockId: '4',
    symbol: 'HDFCBANK',
    name: 'HDFC Bank',
    quantity: 40,
    avgBuyPrice: 1620.80,
    currentPrice: 1680.40,
  },
  {
    id: 'p4',
    stockId: '6',
    symbol: 'ICICIBANK',
    name: 'ICICI Bank',
    quantity: 60,
    avgBuyPrice: 950.20,
    currentPrice: 980.65,
  },
];

// Mock Timeline Data
export const timelinePosts: TimelinePost[] = [
  {
    id: 't1',
    author: 'Market Analyst',
    authorAvatar: 'https://i.pravatar.cc/150?img=1',
    content: 'Reliance Industries showing strong momentum after the recent quarterly results. Expecting further upside with the new energy initiatives. #RELIANCE #Energy',
    timestamp: '2h ago',
    likes: 124,
    comments: 18,
    stockMentions: ['RELIANCE'],
  },
  {
    id: 't2',
    author: 'Tech Investor',
    authorAvatar: 'https://i.pravatar.cc/150?img=2',
    content: 'IT sector may face headwinds due to global economic uncertainties. TCS and Infosys are likely to see pressure in the coming quarters. #TCS #INFY #ITSector',
    timestamp: '5h ago',
    likes: 87,
    comments: 32,
    stockMentions: ['TCS', 'INFY'],
  },
  {
    id: 't3',
    author: 'Financial Expert',
    authorAvatar: 'https://i.pravatar.cc/150?img=3',
    content: 'Bank Nifty technical analysis suggests a consolidation phase. HDFC Bank and ICICI Bank could be range-bound in the near term. #BankNifty #HDFCBANK #ICICIBANK',
    timestamp: '8h ago',
    likes: 156,
    comments: 24,
    stockMentions: ['HDFCBANK', 'ICICIBANK'],
  },
  {
    id: 't4',
    author: 'Sector Specialist',
    authorAvatar: 'https://i.pravatar.cc/150?img=4',
    content: 'Telecom sector outlook remains positive with Bharti Airtel leading the pack. Recent tariff hikes and 5G rollout to boost revenues. #BHARTIARTL #Telecom',
    timestamp: '1d ago',
    likes: 92,
    comments: 15,
    stockMentions: ['BHARTIARTL'],
  },
  {
    id: 't5',
    author: 'Auto Industry Watcher',
    authorAvatar: 'https://i.pravatar.cc/150?img=5',
    content: 'Tata Motors showing resilience despite global supply chain issues. EV segment growth continues to impress. #TATAMOTORS #Auto #EV',
    timestamp: '2d ago',
    likes: 118,
    comments: 22,
    stockMentions: ['TATAMOTORS'],
  },
];

// Mock Chat Messages
export const chatMessages: ChatMessage[] = [
  
  {
    id: 'c1',
    role: 'assistant',
    content: 'Hi! I am market asistant. Anything I can help you with?',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

// Generate chart data
export function generateChartData(days = 30, volatility = 0.02, startPrice = 100) {
  const data = [];
  let price = startPrice;
  
  for (let i = 0; i < days; i++) {
    // Random price movement
    const change = price * (Math.random() * volatility * 2 - volatility);
    price += change;
    
    data.push({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.max(price, 1).toFixed(2),
    });
  }
  
  return data;
}