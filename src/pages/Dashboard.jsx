import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBiometric } from '../context/BiometricContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  UserGroupIcon,
  CalendarIcon,
  ClockIcon,
  FingerPrintIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const { simulateBiometricScan, isScanning } = useBiometric();
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingVerifications: 0,
    completedAppointments: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appointmentsRes, patientsRes] = await Promise.all([
        axios.get('/api/appointments'),
        axios.get('/api/patients')
      ]);

      const appointments = appointmentsRes.data.appointments;
      const patients = patientsRes.data.patients;

      const today = new Date().toDateString();
      const todayAppointments = appointments.filter(
        app => new Date(app.appointmentDate).toDateString() === today
      );

      setStats({
        totalPatients: patients.length,
        todayAppointments: todayAppointments.length,
        pendingVerifications: appointments.filter(app => app.status === 'scheduled').length,
        completedAppointments: appointments.filter(app => app.status === 'completed').length
      });

      setRecentAppointments(appointments.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricCheckin = async (appointmentId) => {
    await simulateBiometricScan(appointmentId);
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      'checked-in': 'bg-green-100 text-green-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      'no-show': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.firstName} {user?.lastName}!
                </h1>
                <p className="text-gray-600 mt-1">
                  {user?.role === 'doctor' && "Here's your patient schedule and updates"}
                  {user?.role === 'nurse' && "Here's your daily tasks and patient assignments"}
                  {user?.role === 'patient' && "Here's your upcoming appointments and health records"}
                  {user?.role === 'admin' && "Here's your hospital overview and analytics"}
                  {user?.role === 'receptionist' && "Here's today's appointments and check-ins"}
                </p>
              </div>
              {user?.role === 'patient' && !user?.biometricRegistered && (
                <Link
                  to="/biometric-registration"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <FingerPrintIcon className="h-5 w-5 mr-2" />
                  Register Biometric
                </Link>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalPatients}</p>
                </div>
                <div className="bg-primary-100 p-3 rounded-lg">
                  <UserGroupIcon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="mt-4">
                <Link to="/patients" className="text-sm text-primary-600 hover:text-primary-700">
                  View all patients →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.todayAppointments}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CalendarIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <Link to="/appointments" className="text-sm text-green-600 hover:text-green-700">
                  View schedule →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingVerifications}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <FingerPrintIcon className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-yellow-600">
                  Awaiting biometric check-in
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Today</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completedAppointments}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-blue-600">
                  Successfully completed
                </span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Appointments */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
                  <Link
                    to="/appointments"
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    View all
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {recentAppointments.length > 0 ? (
                    recentAppointments.map((appointment) => (
                      <div
                        key={appointment._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="bg-primary-100 p-2 rounded-lg">
                              <ClockIcon className="h-5 w-5 text-primary-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {appointment.patientId?.userId?.firstName} {appointment.patientId?.userId?.lastName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 ml-11">
                            {appointment.reason}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                          {appointment.status === 'scheduled' && (
                            <button
                              onClick={() => handleBiometricCheckin(appointment._id)}
                              disabled={isScanning}
                              className="px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50"
                            >
                              Check-in
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No appointments found</p>
                      {user?.role === 'patient' && (
                        <Link
                          to="/appointments/new"
                          className="inline-block mt-4 text-primary-600 hover:text-primary-700"
                        >
                          Schedule an appointment →
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions & Stats */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  {user?.role !== 'patient' && (
                    <>
                      <Link
                        to="/patients/new"
                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <UserGroupIcon className="h-5 w-5 text-primary-600 mr-3" />
                        <span className="text-sm font-medium text-gray-700">Register New Patient</span>
                      </Link>
                      <Link
                        to="/appointments/new"
                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <CalendarIcon className="h-5 w-5 text-green-600 mr-3" />
                        <span className="text-sm font-medium text-gray-700">Schedule Appointment</span>
                      </Link>
                    </>
                  )}
                  <Link
                    to="/biometric-verification"
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FingerPrintIcon className="h-5 w-5 text-yellow-600 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Biometric Verification</span>
                  </Link>
                  <Link
                    to="/records"
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Medical Records</span>
                  </Link>
                </div>
              </div>

              {/* Biometric Status */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Biometric System Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">System Status</span>
                    <span className="flex items-center text-sm text-green-600">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Today's Verifications</span>
                    <span className="text-sm font-medium text-gray-900">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Success Rate</span>
                    <span className="text-sm font-medium text-gray-900">99.8%</span>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '99.8%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Stats (for admins) */}
              {user?.role === 'admin' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Overview</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Emergency</span>
                      <span className="text-sm font-medium text-gray-900">12 patients</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Cardiology</span>
                      <span className="text-sm font-medium text-gray-900">8 patients</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Pediatrics</span>
                      <span className="text-sm font-medium text-gray-900">15 patients</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Orthopedics</span>
                      <span className="text-sm font-medium text-gray-900">6 patients</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;