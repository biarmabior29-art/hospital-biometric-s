import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FingerPrintIcon, UserGroupIcon, ClockIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const Services = () => {
  const services = [
    {
      icon: FingerPrintIcon,
      title: 'Biometric Registration',
      description: 'Secure patient identification and registration using advanced biometric technology.'
    },
    {
      icon: UserGroupIcon,
      title: 'Patient Records',
      description: 'Manage patient records efficiently with encrypted and HIPAA-compliant storage.'
    },
    {
      icon: ClockIcon,
      title: 'Appointment Scheduling',
      description: 'Easily book, track, and manage appointments with real-time availability.'
    },
    {
      icon: DocumentTextIcon,
      title: 'Digital Documentation',
      description: 'Paperless documentation with automated record keeping and digital signatures.'
    },
    {
      icon: ChartBarIcon,
      title: 'Analytics Dashboard',
      description: 'Gain insights with real-time analytics and reporting for hospital administrators.'
    },
    {
      icon: FingerPrintIcon,
      title: 'Secure Access',
      description: 'Control access to sensitive medical data with multi-factor authentication.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-lg md:text-xl text-gray-200">
            Delivering secure, efficient, and innovative healthcare services powered by biometric technology.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive services ensure patient safety, streamline operations, and enhance healthcare outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
