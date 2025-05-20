import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AuthWrapper  from './AuthWrapper.tsx';

function App() {
  return (
    <Router>
      <AuthWrapper>
        <div className="min-h-screen bg-gray-900">
          <Dashboard />
        </div>
      </AuthWrapper>
    </Router>
  );
}

export default App;