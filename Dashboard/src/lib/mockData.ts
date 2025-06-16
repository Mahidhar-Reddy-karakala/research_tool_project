// Mock data for the financial dashboard

import { set } from "date-fns";





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
  sales?: { month: string; sales: number }[]; // Monthly sales data
  about_id?: string; // Unique identifier for the stock's about section
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
    change: 80.15,
    changePercent: 3.41,
    marketCap: 1640.5,
    volume: 7.2,
    sector: 'Energy',
    favorite: true,
    sales : [
      { month: "Mar 2014", sales: 433521 },
      { month: "Mar 2015", sales: 374372 },
      { month: "Mar 2016", sales: 272583 },
      { month: "Mar 2017", sales: 303954 },
      { month: "Mar 2018", sales: 390823 },
      { month: "Mar 2019", sales: 568337 },
      { month: "Mar 2020", sales: 596679 },
      { month: "Mar 2021", sales: 466307 },
      { month: "Mar 2022", sales: 694673 },
      { month: "Mar 2023", sales: 876396 },
      { month: "Mar 2024", sales: 899041 },
      { month: "Mar 2025", sales: 964693 },
    ],
    about_id: "6847d80b0af93eff968da67e"
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
    sales : [
  { month: "Mar 2014", sales: 81809 },
  { month: "Mar 2015", sales: 94648 },
  { month: "Mar 2016", sales: 108646 },
  { month: "Mar 2017", sales: 117966 },
  { month: "Mar 2018", sales: 123104 },
  { month: "Mar 2019", sales: 146463 },
  { month: "Mar 2020", sales: 156949 },
  { month: "Mar 2021", sales: 164177 },
  { month: "Mar 2022", sales: 191754 },
  { month: "Mar 2023", sales: 225458 },
  { month: "Mar 2024", sales: 240893 },
  { month: "Mar 2025", sales: 255324 },
],
    about_id: "6847e127ba03d3bd151cabda"
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
    sales: [
  { month: "Mar 2014", sales: 50133 },
  { month: "Mar 2015", sales: 53319 },
  { month: "Mar 2016", sales: 62441 },
  { month: "Mar 2017", sales: 68484 },
  { month: "Mar 2018", sales: 70522 },
  { month: "Mar 2019", sales: 82675 },
  { month: "Mar 2020", sales: 90791 },
  { month: "Mar 2021", sales: 100472 },
  { month: "Mar 2022", sales: 121641 },
  { month: "Mar 2023", sales: 146767 },
  { month: "Mar 2024", sales: 153670 },
  { month: "Mar 2025", sales: 162990 },
],
    about_id: "6847deb46ee10d1ad09a977a"
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
    sales: [
  { month: "Mar 2014", sales: 42555 },
  { month: "Mar 2015", sales: 50666 },
  { month: "Mar 2016", sales: 63162 },
  { month: "Mar 2017", sales: 73271 },
  { month: "Mar 2018", sales: 85288 },
  { month: "Mar 2019", sales: 105161 },
  { month: "Mar 2020", sales: 122189 },
  { month: "Mar 2021", sales: 128552 },
  { month: "Mar 2022", sales: 135936 },
  { month: "Mar 2023", sales: 170754 },
  { month: "Mar 2024", sales: 283649 },
  { month: "Mar 2025", sales: 336367 },
],
    about_id: "6847de692eaacc3430ef15b4"
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
    sales: [
  { month: "Mar 2014", sales: 85864 },
  { month: "Mar 2015", sales: 96101 },
  { month: "Mar 2016", sales: 96532 },
  { month: "Mar 2017", sales: 95468 },
  { month: "Mar 2018", sales: 82639 },
  { month: "Mar 2019", sales: 80780 },
  { month: "Mar 2020", sales: 87539 },
  { month: "Mar 2021", sales: 100616 },
  { month: "Mar 2022", sales: 116547 },
  { month: "Mar 2023", sales: 139145 },
  { month: "Mar 2024", sales: 149982 },
  { month: "Mar 2025", sales: 172985 },
],
    about_id: "6847e06e7b415e8bc54e8f37"
    
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
    sales: [
  { month: "Mar 2014", sales: 49479 },
  { month: "Mar 2015", sales: 54964 },
  { month: "Mar 2016", sales: 59294 },
  { month: "Mar 2017", sales: 60940 },
  { month: "Mar 2018", sales: 62162 },
  { month: "Mar 2019", sales: 71982 },
  { month: "Mar 2020", sales: 84836 },
  { month: "Mar 2021", sales: 89163 },
  { month: "Mar 2022", sales: 95407 },
  { month: "Mar 2023", sales: 121067 },
  { month: "Mar 2024", sales: 159516 },
  { month: "Mar 2025", sales: 186331 },
], 
    about_id: "6847e1fff5aa7c8a67d355db"
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
    sales:[
  { month: "Mar 2014", sales: 232834 },
  { month: "Mar 2015", sales: 263159 },
  { month: "Mar 2016", sales: 273046 },
  { month: "Mar 2017", sales: 269693 },
  { month: "Mar 2018", sales: 291550 },
  { month: "Mar 2019", sales: 301938 },
  { month: "Mar 2020", sales: 261068 },
  { month: "Mar 2021", sales: 249795 },
  { month: "Mar 2022", sales: 278454 },
  { month: "Mar 2023", sales: 345967 },
  { month: "Mar 2024", sales: 434016 },
  { month: "Mar 2025", sales: 439695 },
]
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
    sales: [
  { month: "Mar 2014", sales: 43424 },
  { month: "Mar 2015", sales: 46951 },
  { month: "Mar 2016", sales: 51244 },
  { month: "Mar 2017", sales: 55448 },
  { month: "Mar 2018", sales: 54487 },
  { month: "Mar 2019", sales: 59019 },
  { month: "Mar 2020", sales: 61138 },
  { month: "Mar 2021", sales: 61935 },
  { month: "Mar 2022", sales: 79312 },
  { month: "Mar 2023", sales: 90488 },
  { month: "Mar 2024", sales: 89760 },
  { month: "Mar 2025", sales: 89088 },
]
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
    sales: [
  { month: "Mar 2014", sales: 16080 },
  { month: "Mar 2015", sales: 27392 },
  { month: "Mar 2016", sales: 28487 },
  { month: "Mar 2017", sales: 31578 },
  { month: "Mar 2018", sales: 26489 },
  { month: "Mar 2019", sales: 29066 },
  { month: "Mar 2020", sales: 32838 },
  { month: "Mar 2021", sales: 33498 },
  { month: "Mar 2022", sales: 38654 },
  { month: "Mar 2023", sales: 43886 },
  { month: "Mar 2024", sales: 48497 },
  { month: "Mar 2025", sales: 52578 },
],
    about_id: "6847d8f3db78be3ede1eb650"
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
    sales: [
  { month: "Mar 2014", sales: 11986 },
  { month: "Mar 2015", sales: 13319 },
  { month: "Mar 2016", sales: 20402 },
  { month: "Mar 2017", sales: 22324 },
  { month: "Mar 2018", sales: 25131 },
  { month: "Mar 2019", sales: 29831 },
  { month: "Mar 2020", sales: 33474 },
  { month: "Mar 2021", sales: 32820 },
  { month: "Mar 2022", sales: 33741 },
  { month: "Mar 2023", sales: 42151 },
  { month: "Mar 2024", sales: 56237 },
  { month: "Mar 2025", sales: 65669 },
]
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