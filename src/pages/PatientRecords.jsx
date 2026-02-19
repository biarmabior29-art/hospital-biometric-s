import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  ArrowPathIcon,
  UserCircleIcon,
  DocumentTextIcon,
  BeakerIcon,
  HeartIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const PatientRecords = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    bloodType: '',
    allergies: [],
    emergencyContact: {
      name: '',
      relationship: '',
      phoneNumber: ''
    }
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('/api/patients');
      setPatients(response.data.patients);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.userId?.firstName} ${patient.userId?.lastName}`.toLowerCase();
    const mrn = patient.medicalRecordNumber?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || mrn.includes(search);
  });

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      // First create user
      const userResponse = await axios.post('/api/auth/register', {
        ...formData,
        password: 'defaultPassword123', // Should be changed by user
        role: 'patient'
      });

      // Then create patient record
      const patientResponse = await axios.post('/api/patients', {
        userId: userResponse.data.user.id,
        medicalRecordNumber: `MRN${Date.now()}`,
        bloodType: formData.bloodType,
        allergies: formData.allergies,
        emergencyContact: formData.emergencyContact
      });

      setPatients([...patients, patientResponse.data.patient]);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      bloodType: '',
      allergies: [],
      emergencyContact: {
        name: '',
        relationship: '',
        phoneNumber: ''
      }
    });
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
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Patient Records</h1>
                <p className="text-gray-600 mt-1">
                  Manage and view all patient information
                </p>
              </div>
              {user?.role !== 'patient' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add New Patient
                </button>
              )}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or medical record number..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <button className="mt-3 md:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filter
              </button>
              <button className="mt-3 md:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Patients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <div
                key={patient._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary-100 p-3 rounded-full">
                      <UserCircleIcon className="h-8 w-8 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {patient.userId?.firstName} {patient.userId?.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        MRN: {patient.medicalRecordNumber}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <HeartIcon className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-gray-600">Blood Type: </span>
                      <span className="ml-1 font-medium text-gray-900">
                        {patient.bloodType || 'Unknown'}
                      </span>
                    </div>
                    
                    {patient.allergies && patient.allergies.length > 0 && (
                      <div className="flex items-start text-sm">
                        <BeakerIcon className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                        <div>
                          <span className="text-gray-600">Allergies: </span>
                          <span className="text-gray-900">
                            {patient.allergies.join(', ')}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center text-sm">
                      <ClipboardDocumentListIcon className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-gray-600">Biometric: </span>
                      <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                        patient.biometricEnabled
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {patient.biometricEnabled ? 'Registered' : 'Not Registered'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <button
                      onClick={() => setSelectedPatient(patient)}
                      className="flex-1 px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      View Details
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                      <DocumentTextIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <UserCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding a new patient'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add New Patient</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAddPatient}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Type
                    </label>
                    <select
                      value={formData.bloodType}
                      onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select Blood Type</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Allergies (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Penicillin, Peanuts, Latex"
                      value={formData.allergies.join(', ')}
                      onChange={(e) => setFormData({
                        ...formData,
                        allergies: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Name
                        </label>
                        <input
                          type="text"
                          value={formData.emergencyContact.name}
                          onChange={(e) => setFormData({
                            ...formData,
                            emergencyContact: {...formData.emergencyContact, name: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Relationship
                        </label>
                        <input
                          type="text"
                          value={formData.emergencyContact.relationship}
                          onChange={(e) => setFormData({
                            ...formData,
                            emergencyContact: {...formData.emergencyContact, relationship: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Emergency Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.emergencyContact.phoneNumber}
                          onChange={(e) => setFormData({
                            ...formData,
                            emergencyContact: {...formData.emergencyContact, phoneNumber: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
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
                    Add Patient
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-100 p-3 rounded-full">
                    <UserCircleIcon className="h-12 w-12 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedPatient.userId?.firstName} {selectedPatient.userId?.lastName}
                    </h2>
                    <p className="text-gray-600">
                      MRN: {selectedPatient.medicalRecordNumber}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Email:</span>
                      <p className="text-gray-900">{selectedPatient.userId?.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Phone:</span>
                      <p className="text-gray-900">{selectedPatient.userId?.phoneNumber}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Date of Birth:</span>
                      <p className="text-gray-900">
                        {selectedPatient.userId?.dateOfBirth
                          ? new Date(selectedPatient.userId.dateOfBirth).toLocaleDateString()
                          : 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Blood Type:</span>
                      <p className="text-gray-900">{selectedPatient.bloodType || 'Unknown'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Allergies:</span>
                      <div className="mt-1">
                        {selectedPatient.allergies && selectedPatient.allergies.length > 0 ? (
                          selectedPatient.allergies.map((allergy, index) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full mr-2 mb-2"
                            >
                              {allergy}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-900">No known allergies</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Biometric Status:</span>
                      <p className="text-gray-900">
                        {selectedPatient.biometricEnabled ? 'Registered' : 'Not Registered'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                  {selectedPatient.emergencyContact ? (
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Name:</span>
                        <p className="text-gray-900">{selectedPatient.emergencyContact.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Relationship:</span>
                        <p className="text-gray-900">{selectedPatient.emergencyContact.relationship}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Phone:</span>
                        <p className="text-gray-900">{selectedPatient.emergencyContact.phoneNumber}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">No emergency contact information</p>
                  )}
                </div>

                {selectedPatient.insuranceInfo && (
                  <div className="col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Information</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Provider:</span>
                        <p className="text-gray-900">{selectedPatient.insuranceInfo.provider}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Policy Number:</span>
                        <p className="text-gray-900">{selectedPatient.insuranceInfo.policyNumber}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Group Number:</span>
                        <p className="text-gray-900">{selectedPatient.insuranceInfo.groupNumber}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Edit Patient
                </button>
                <button
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Medical Records
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PatientRecords;