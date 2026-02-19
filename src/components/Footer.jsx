import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FingerPrintIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const linkClass = "text-gray-400 hover:text-blue-500 text-sm transition-colors";

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FingerPrintIcon className="h-8 w-8 text-blue-500" />
              <span className="font-bold text-xl text-white">BioHealth</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revolutionizing healthcare with biometric technology. 
              Secure, fast, and reliable patient management system.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className={linkClass}>Home</Link>
              </li>
              <li>
                <Link to="/about" className={linkClass}>About Us</Link>
              </li>
              <li>
                <Link to="/services" className={linkClass}>Services</Link>
              </li>
              <li>
                <Link to="/contact" className={linkClass}>Contact</Link>
              </li>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Our Services</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Biometric Registration</li>
              <li>Patient Records</li>
              <li>Appointment System</li>
              <li>Emergency Care</li>
              <li>Telemedicine</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span>123 Healthcare Ave, Medical District, NY 10001</span>
              </li>
              <li className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-blue-500" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-blue-500" />
                <span>info@biohealth.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <ClockIcon className="h-5 w-5 text-blue-500" />
                <span>24/7 Emergency Services</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} BioHealth Hospital System. All rights reserved.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <Link to="/privacy" className="text-gray-400 hover:text-blue-500 text-xs">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-blue-500 text-xs">Terms of Service</Link>
            <Link to="/faq" className="text-gray-400 hover:text-blue-500 text-xs">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
