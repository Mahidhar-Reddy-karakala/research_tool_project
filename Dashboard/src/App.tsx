import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AuthWrapper  from './AuthWrapper.tsx';
import Page  from './components/Dashboard1.tsx'
function App() {
  return (
    <Router>
      <AuthWrapper>
        {/* <div className="min-h-screen bg-gray-900">
          <Dashboard />
        </div> */}
        <Page/>
      </AuthWrapper>
    </Router>
  );
}

export default App;