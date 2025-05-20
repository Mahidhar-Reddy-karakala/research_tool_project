// import React, { useState } from 'react';
// import { Mail, Lock, User, ArrowLeft, TrendingUp } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import { AnimatedButton } from '../components/AnimatedButton';
// import { register } from '../services/authServices';

// function Register() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [termsAccepted, setTermsAccepted] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validate password and confirm password
//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     // Validate password length
//     if (formData.password.length < 8) {
//       setError('Password must be at least 8 characters long');
//       return;
//     }

//     // Validate terms acceptance
//     if (!termsAccepted) {
//       setError('You must accept the Terms of Service and Privacy Policy');
//       return;
//     }

//     try {
//       // Send data to the backend to register the user
//       const data = await register(formData.fullName, formData.email, formData.password);
//       localStorage.setItem('token', data.token);
//       // If successful, navigate to the login page
//       navigate('/login');
//     } catch (error: any) {
//       if (error.response && error.response.data && error.response.data.message) {
//         setError(error.response.data.message); // Display backend error message
//       } else {
//         setError('Registration failed. Please try again.');
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
//       {/* Back Button */}
//       <div className="absolute top-4 left-4 md:top-8 md:left-8">
//         <AnimatedButton
//           onClick={() => navigate('/login')}
//           className="w-36 md:w-40 text-base"
//           icon={<ArrowLeft className="h-4 w-4 text-black" />}
//         >
//           Back to Login
//         </AnimatedButton>
//       </div>

//       <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
//         {/* Logo and Header */}
//         <div className="text-center">
//           <div className="flex justify-center">
//             <TrendingUp className="h-12 w-12 text-indigo-600" />
//           </div>
//           <h2 className="mt-4 text-3xl font-bold text-gray-900">Create an Account</h2>
//           <p className="mt-2 text-sm text-gray-600">AI-Powered Stock Research Tool</p>
//         </div>

//         {/* Registration Form */}
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {error && <p className="text-red-500 text-sm">{error}</p>}
//           <div className="space-y-4">
//             <div>
//               <label htmlFor="fullName" className="sr-only">
//                 Full Name
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <User className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="fullName"
//                   name="fullName"
//                   type="text"
//                   required
//                   value={formData.fullName}
//                   onChange={handleChange}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
//                   placeholder="Full Name"
//                 />
//               </div>
//             </div>

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
//                   value={formData.email}
//                   onChange={handleChange}
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
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
//                   placeholder="Password"
//                 />
//               </div>
//               <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters long</p>
//             </div>

//             <div>
//               <label htmlFor="confirmPassword" className="sr-only">
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type="password"
//                   required
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
//                   placeholder="Confirm Password"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center">
//             <input
//               id="terms"
//               name="terms"
//               type="checkbox"
//               required
//               checked={termsAccepted}
//               onChange={(e) => setTermsAccepted(e.target.checked)}
//               className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//             />
//             <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
//               I agree to the{' '}
//               <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
//                 Terms of Service
//               </Link>{' '}
//               and{' '}
//               <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500">
//                 Privacy Policy
//               </Link>
//             </label>
//           </div>

//           <div>
//             <AnimatedButton
//               type="submit"
//               className="w-full"
//               variant="secondary"
//               icon={<Lock className="h-5 w-5 text-white" />}
//             >
//               Create Account
//             </AnimatedButton>
//           </div>
//         </form>

//         {/* Footer */}
//         <div className="mt-4 text-center text-sm text-gray-600">
//           Already have an account?{' '}
//           <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
//             Sign in
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;







import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link,useNavigate } from 'react-router-dom';
import { LineChart, Mail, Lock, User } from 'lucide-react';
import { register } from '../services/authServices';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const DASHBOARD_URL = 'http://localhost:5173/'; // Update this if needed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      const data = await register(name, email, password); // Assume backend sets cookie or returns token

      // If token returned and needed for future logic:
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Redirect to dashboard running on different port
      window.location.href = DASHBOARD_URL;
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
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
          Create your account
        </motion.h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Enter your name"
                required
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
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
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Create a password"
                required
              />
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Must be at least 8 characters long
            </p>
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
            Create Account
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center text-sm text-gray-400"
        >
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary-dark transition-colors">
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Register;