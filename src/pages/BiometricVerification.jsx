import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBiometric } from '../context/BiometricContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import {
  FingerPrintIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const BiometricVerification = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { simulateBiometricScan, isScanning, scanResult } = useBiometric();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    fetchAppointment();
  }, [appointmentId]);

  useEffect(() => {
    if (scanResult) {
      setVerified(scanResult.success);
      if (scanResult.success && appointment) {
        updateAppointmentVerification();
      }
    }
  }, [scanResult]);

  const fetchAppointment = async () => {
    try {
      const response = await axios.get(`/api/appointments/${appointmentId}`);
      setAppointment(response.data.appointment);
      setVerified(response.data.appointment.verifiedByBiometric);
    } catch (error) {
      console.error('Error fetching appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentVerification = async () => {
    try {
      await axios.put(`/api/appointments/${appointmentId}/verify-biometric`);
      fetchAppointment();
    } catch (error) {
      console.error('Error updating verification status:', error);
    }
  };

  const handleVerification = () => {
    simulateBiometricScan(appointment?.patientId?._id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-4">
                <FingerPrintIcon className="h-10 w-10 text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Biometric Verification
              </h1>
              <p className="text-gray-600">
                Verify patient identity using biometric scan
              </p>
            </div>

            {/* Appointment Info */}
            {appointment && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Appointment Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Patient</p>
                    <p className="font-medium text-gray-900">
                      {appointment.patientId?.userId?.firstName} {appointment.patientId?.userId?.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Doctor</p>
                    <p className="font-medium text-gray-900">
                      Dr. {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(appointment.appointmentDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium text-gray-900">
                      {appointment.appointmentTime}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Verification Status */}
            {verified ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Verification Successful
                </h3>
                <p className="text-gray-600 mb-6">
                  Patient identity has been verified using biometric scan
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    <span className="font-medium">Verification Time:</span>{' '}
                    {new Date().toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/appointments')}
                  className="mt-6 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Return to Appointments
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                {isScanning ? (
                  <div>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4 biometric-scan-animation">
                      <FingerPrintIcon className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Scanning Biometric...
                    </h3>
                    <p className="text-gray-600">
                      Please place your finger on the biometric scanner
                    </p>
                    <div className="mt-6">
                      <ArrowPathIcon className="h-6 w-6 text-primary-600 animate-spin mx-auto" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <FingerPrintIcon className="h-8 w-8 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Ready to Verify
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Click the button below to start biometric verification
                    </p>
                    <button
                      onClick={handleVerification}
                      disabled={isScanning}
                      className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      Start Biometric Scan
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Failure State */}
            {scanResult && !scanResult.success && !verified && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <XCircleIcon className="h-5 w-5 text-red-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      Verification Failed
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      Unable to verify biometric data. Please try again or use alternative verification method.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleVerification}
                  className="mt-4 w-full px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BiometricVerification;