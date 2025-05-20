// import React, { useState, useEffect } from 'react';
// import { Mail, Lock, TrendingUp, ArrowLeft } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import { AnimatedButton } from '../components/AnimatedButton';
// import { login } from '../services/authServices';

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       navigate('/dashboard'); // Redirect if already logged in
//     }
//   }, [navigate]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const data = await login(email, password);
//       localStorage.setItem('token', data.token); // Store JWT token in localStorage
//       navigate('/dashboard'); // Redirect to dashboard or home page
//     } catch (err) {
//       setError('Invalid credentials');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
//       <div className="absolute top-4 left-4 md:top-8 md:left-8">
//         <AnimatedButton
//           onClick={() => navigate('/')}
//           className="w-36 md:w-40 text-base"
//           icon={<ArrowLeft className="h-4 w-4 text-black" />}
//         >
//           Back to Home
//         </AnimatedButton>
//       </div>
//       <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
//         {/* Logo and Header */}
//         <div className="text-center">
//           <div className="flex justify-center">
//             <TrendingUp className="h-12 w-12 text-indigo-600" />
//           </div>
//           <h2 className="mt-4 text-3xl font-bold text-gray-900">Welcome back</h2>
//           <p className="mt-2 text-sm text-gray-600">AI-Powered Stock Research Tool</p>
//         </div>

//         {/* Login Form */}
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {error && <p className="text-red-500 text-sm">{error}</p>}
//           <div className="space-y-4">
//             <div>
//               <label htmlFor="email" className="sr-only">
//                 Email address
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
//                   placeholder="Email address"
//                 />
//               </div>
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">
//                 Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
//                   placeholder="Password"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <input
//                 id="remember-me"
//                 name="remember-me"
//                 type="checkbox"
//                 className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//               />
//               <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
//                 Remember me
//               </label>
//             </div>
//             <div className="text-sm">
//               <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
//                 Forgot password?
//               </Link>
//             </div>
//           </div>

//           <div className="space-y-3">
//             <AnimatedButton
//               type="submit"
//               className="w-full"
//               variant="secondary"
//               icon={<Lock className="h-5 w-5 text-white" />}
//             >
//               Sign in
//             </AnimatedButton>
//             <AnimatedButton
//               onClick={() => window.location.href = '/register'}
//               className="w-full"
//               icon={<Mail className="h-5 w-5 text-black" />}
//             >
//               Create an account
//             </AnimatedButton>
//           </div>
//         </form>

//         {/* Footer */}
//         <div className="mt-4 text-center text-sm text-gray-600">
//           By signing in, you agree to our{' '}
//           <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
//             Terms
//           </Link>{' '}
//           and{' '}
//           <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500">
//             Privacy Policy
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;


import React, { useState,useEffect} from 'react';
import { motion } from 'framer-motion';
import { Link,useNavigate} from 'react-router-dom';
import { LineChart, Mail, Lock } from 'lucide-react';
import { login,verify } from '../services/authServices';



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const DASHBOARD_URL = 'http://localhost:5173/'; // 🚨 Change this if your dashboard runs elsewhere

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await verify();
        if (res.valid) {
          window.location.href = DASHBOARD_URL;
        }
      } catch {
        // Not logged in — no action needed
      }
    };

    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password); // Cookie set by backend
      window.location.href = DASHBOARD_URL; // Redirect to dashboard on another port
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen pt-16 flex items-center justify-center px-4 gradient-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card w-full max-w-md"
      >
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <LineChart className="w-12 h-12 text-primary" />
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-center mb-8"
        >
          Welcome back
        </motion.h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Enter your email"
                required
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter your password"
                required
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-between"
          >
            <label className="flex items-center">
              <input type="checkbox" className="rounded bg-gray-700 border-gray-600 text-primary focus:ring-primary" />
              <span className="ml-2 text-sm">Remember me</span>
            </label>
            <a href="#" className="text-sm text-primary hover:text-primary-dark transition-colors">
              Forgot password?
            </a>
          </motion.div>

          <motion.button
            type="submit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="w-full btn-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign in
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center text-sm text-gray-400"
        >
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:text-primary-dark transition-colors">
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;