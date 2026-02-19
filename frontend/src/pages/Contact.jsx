import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for form submission logic
    alert('Message sent! Thank you for contacting us.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact BioHealth</h1>
          <p className="text-lg md:text-xl text-gray-200">
            We are here to assist you. Send us a message, and we will get back to you promptly.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="subject">Subject</label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="message">Message</label>
                <textarea
                  name="message"
                  id="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start space-x-3">
                  <MapPinIcon className="h-6 w-6 text-blue-700 flex-shrink-0" />
                  <span>123 Healthcare Ave, Medical District, NY 10001</span>
                </li>
                <li className="flex items-center space-x-3">
                  <PhoneIcon className="h-6 w-6 text-blue-700" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-6 w-6 text-blue-700" />
                  <span>info@biohealth.com</span>
                </li>
                <li className="flex items-center space-x-3">
                  <ClockIcon className="h-6 w-6 text-blue-700" />
                  <span>24/7 Emergency Services</span>
                </li>
              </ul>
            </div>

            {/* Optional Map */}
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center text-gray-500">
              Map Placeholder
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
