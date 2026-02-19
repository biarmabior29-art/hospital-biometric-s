import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBiometric } from '../context/BiometricContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  CalendarIcon,
  ClockIcon,
  UserCircleIcon,
  PlusIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  FingerPrintIcon
} from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Appointments = () => {
  const { user } = useAuth();
  const { simulateBiometricScan, isScanning } = useBiometric();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: new Date(),
    appointmentTime: '09:00',
    type: 'consultation',
    reason: '',
    symptoms: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appointmentsRes, doctorsRes, patientsRes] = await Promise.all([
        axios.get('/api/appointments'),
        axios.get('/api/users?role=doctor'),
        axios.get('/api/patients')
      ]);

      setAppointments(appointmentsRes.data.appointments);
      setDoctors(doctorsRes.data.users);
      setPatients(patientsRes.data.patients);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/appointments', formData);
      setAppointments([response.data.appointment, ...appointments]);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      appointmentDate: new Date(),
      appointmentTime: '09:00',
      type: 'consultation',
      reason: '',
      symptoms: []
    });
  };

  const handleBiometricCheckin = async (appointmentId) => {
    await simulateBiometricScan(appointmentId);
    // Update appointment status after verification
    try {
      await axios.put(`/api/appointments/${appointmentId}/verify-biometric`);
      fetchData(); // Refresh appointments
    } catch (error) {
      console.error('Error verifying biometric:', error);
    }
  };

  const handleStatusChange = async (appointmentId, status) => {
    try {
      await axios.put(`/api/appointments/${appointmentId}/status`, { status });
      fetchData(); // Refresh appointments
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const getFilteredAppointments = () => {
    const today = new Date().toDateString();
    
    switch (filter) {
      case 'today':
        return appointments.filter(
          app => new Date(app.appointmentDate).toDateString() === today
        );
      case 'upcoming':
        return appointments.filter(
          app => new Date(app.appointmentDate) > new Date() && 
          ['scheduled', 'confirmed'].includes(app.status)
        );
      case 'completed':
        return appointments.filter(app => app.status === 'completed');
      case 'cancelled':
        return appointments.filter(app => app.status === 'cancelled');
      default:
        return appointments;
    }
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

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
  ];

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

  const filteredAppointments = getFilteredAppointments();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
                <p className="text-gray-600 mt-1">
                  Schedule and manage patient appointments
                </p>
              </div>
              {user?.role !== 'patient' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  New Appointment
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filter:</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    filter === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('today')}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    filter === 'today'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setFilter('upcoming')}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    filter === 'upcoming'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    filter === 'completed'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setFilter('cancelled')}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    filter === 'cancelled'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cancelled
                </button>
              </div>
            </div>
          </div>

          {/* Appointments List */}
          <div className="space-y-4">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary-100 p-3 rounded-lg">
                        <CalendarIcon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {appointment.patientId?.userId?.firstName} {appointment.patientId?.userId?.lastName}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Doctor:</span> Dr. {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Date & Time:</span>{' '}
                            {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Type:</span> {appointment.type}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Reason:</span> {appointment.reason}
                          </p>
                          {appointment.verifiedByBiometric && (
                            <p className="text-sm text-green-600 flex items-center mt-2">
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Verified by biometric
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 flex flex-col space-y-2">
                      {appointment.status === 'scheduled' && user?.role !== 'patient' && (
                        <>
                          <button
                            onClick={() => handleBiometricCheckin(appointment._id)}
                            disabled={isScanning}
                            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50"
                          >
                            <FingerPrintIcon className="h-4 w-4 mr-2" />
                            Verify Biometric
                          </button>
                          <button
                            onClick={() => handleStatusChange(appointment._id, 'cancelled')}
                            className="inline-flex items-center px-4 py-2 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50"
                          >
                            <XCircleIcon className="h-4 w-4 mr-2" />
                            Cancel
                          </button>
                        </>
                      )}
                      {appointment.status === 'checked-in' && user?.role === 'doctor' && (
                        <button
                          onClick={() => handleStatusChange(appointment._id, 'in-progress')}
                          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                        >
                          Start Appointment
                        </button>
                      )}
                      {appointment.status === 'in-progress' && user?.role === 'doctor' && (
                        <button
                          onClick={() => handleStatusChange(appointment._id, 'completed')}
                          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                        >
                          Complete Appointment
                        </button>
                      )}
                      <Link
                        to={`/biometric-verification/${appointment._id}`}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                <p className="text-gray-600">
                  {filter !== 'all' ? 'Try changing your filter' : 'Schedule your first appointment'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Schedule New Appointment</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAddAppointment}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient
                    </label>
                    <select
                      required
                      value={formData.patientId}
                      onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select Patient</option>
                      {patients.map((patient) => (
                        <option key={patient._id} value={patient._id}>
                          {patient.userId?.firstName} {patient.userId?.lastName} - {patient.medicalRecordNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Doctor
                    </label>
                    <select
                      required
                      value={formData.doctorId}
                      onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                          Dr. {doctor.firstName} {doctor.lastName} - {doctor.department}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Appointment Type
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="consultation">Consultation</option>
                      <option value="follow-up">Follow-up</option>
                      <option value="check-up">Check-up</option>
                      <option value="procedure">Procedure</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <DatePicker
                        selected={formData.appointmentDate}
                        onChange={(date) => setFormData({...formData, appointmentDate: date})}
                        minDate={new Date()}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        dateFormat="MMMM d, yyyy"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time
                      </label>
                      <select
                        required
                        value={formData.appointmentTime}
                        onChange={(e) => setFormData({...formData, appointmentTime: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      >
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Visit
                    </label>
                    <textarea
                      required
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Describe the reason for the appointment..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Symptoms (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., fever, cough, headache"
                      value={formData.symptoms.join(', ')}
                      onChange={(e) => setFormData({
                        ...formData,
                        symptoms: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Schedule Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Appointments;