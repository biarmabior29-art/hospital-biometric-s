import React, { createContext, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import axios from 'axios';

const BiometricContext = createContext();

export const useBiometric = () => useContext(BiometricContext);

export const BiometricProvider = ({ children }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [socket, setSocket] = useState(null);

  const connectSocket = () => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    return newSocket;
  };

  const simulateBiometricScan = async (patientId) => {
    setIsScanning(true);
    setScanResult(null);
    
    try {
      // Simulate biometric scan process
      toast.loading('Scanning biometric...', { id: 'biometric-scan' });
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const response = await axios.post('/api/biometric/verify', {
        patientId,
        biometricData: 'simulated-biometric-data'
      });
      
      if (response.data.success) {
        toast.success('Biometric verified successfully!', { id: 'biometric-scan' });
        setScanResult({ success: true, patientId });
      } else {
        toast.error('Biometric verification failed', { id: 'biometric-scan' });
        setScanResult({ success: false });
      }
    } catch (error) {
      toast.error('Biometric verification failed', { id: 'biometric-scan' });
      setScanResult({ success: false });
    } finally {
      setIsScanning(false);
    }
  };

  const registerBiometric = async (patientId, biometricData) => {
    try {
      const response = await axios.post('/api/biometric/register', {
        patientId,
        biometricTemplate: biometricData
      });
      
      if (response.data.success) {
        toast.success('Biometric registered successfully!');
        return { success: true };
      }
    } catch (error) {
      toast.error('Failed to register biometric');
      return { success: false };
    }
  };

  const value = {
    isScanning,
    scanResult,
    simulateBiometricScan,
    registerBiometric,
    connectSocket
  };

  return (
    <BiometricContext.Provider value={value}>
      {children}
    </BiometricContext.Provider>
  );
};