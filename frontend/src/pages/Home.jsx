import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  FingerPrintIcon, 
  ShieldCheckIcon, 
  ClockIcon, 
  UserGroupIcon,
  ChartBarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const features = [
    {
      icon: FingerPrintIcon,
      title: 'Biometric Authentication',
      description: 'Secure patient identification using advanced biometric technology for accurate and fraud-free healthcare services.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Records',
      description: 'HIPAA-compliant electronic health records with end-to-end encryption and multi-factor authentication.'
    },
    {
      icon: ClockIcon,
      title: 'Quick Check-in',
      description: 'Reduce waiting times with biometric quick-check-in system for appointments and emergency visits.'
    },
    {
      icon: UserGroupIcon,
      title: 'Patient Management',
      description: 'Comprehensive patient management with medical history, prescriptions, and treatment plans.'
    },
    {
      icon: ChartBarIcon,
      title: 'Analytics Dashboard',
      description: 'Real-time analytics and reporting for hospital administrators and healthcare providers.'
    },
    {
      icon: DocumentTextIcon,
      title: 'Digital Records',
      description: 'Paperless documentation with secure digital signatures and automated record keeping.'
    }
  ];

  const stats = [
    { label: 'Patients Served', value: '50,000+' },
    { label: 'Healthcare Providers', value: '500+' },
    { label: 'Daily Appointments', value: '1,000+' },
    { label: 'Years of Service', value: '15+' }
  ];

  // Reusable button styles
  const primaryBtn = "px-6 py-3 font-semibold rounded-lg transition-colors";
  const primaryBtnWhite = `${primaryBtn} bg-white text-blue-700 hover:bg-gray-100`;
  const primaryBtnOutline = `${primaryBtn} border-2 border-white text-white hover:bg-white hover:text-blue-700`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section 
        className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-20" 
        aria-label="Hero Section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Smart Healthcare with{' '}
                <span className="text-yellow-400">Biometric Technology</span>
              </h1>
              <p className="text-xl mb-8 text-gray-200 leading-relaxed">
                Experience the future of healthcare with our advanced biometric patient management system. 
                Secure, efficient, and patient-centered care.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/signup" className={primaryBtnWhite}>Get Started</Link>
                <Link to="/about" className={primaryBtnOutline}>Learn More</Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Healthcare Technology"
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50" aria-label="Statistics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white" aria-label="Features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose BioHealth?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We combine cutting-edge biometric technology with compassionate healthcare delivery.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-700" aria-label="Call to Action">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Join thousands of satisfied patients and healthcare providers using our biometric system.
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-white text-blue-700 font-semibold rounded-lg text-lg hover:bg-gray-100 transition-colors"
          >
            Register Your Hospital Today
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
