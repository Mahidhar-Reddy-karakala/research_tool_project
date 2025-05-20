import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'nav-blur py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <LineChart className="w-14 h-14 text-primary transform group-hover:scale-110 transition-transform duration-300" />
            <span className="text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">StockVision</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="btn-secondary"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="btn-primary"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;