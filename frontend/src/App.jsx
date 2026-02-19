import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { BiometricProvider } from './context/BiometricContext';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PatientRecords from './pages/PatientRecords';
import Appointments from './pages/Appointments';
import BiometricVerification from './pages/BiometricVerification';

// Components
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <BiometricProvider>
          <div className="min-h-screen bg-gray-50">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} /> 
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/patients" element={
                <PrivateRoute>
                  <PatientRecords />
                </PrivateRoute>
              } />
              <Route path="/appointments" element={
                <PrivateRoute>
                  <Appointments />
                </PrivateRoute>
              } />
              <Route path="/biometric-verification/:appointmentId" element={
                <PrivateRoute>
                  <BiometricVerification />
                </PrivateRoute>
              } />
            </Routes>
          </div>
        </BiometricProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;