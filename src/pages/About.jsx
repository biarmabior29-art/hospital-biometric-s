import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Chief Medical Officer',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      bio: '20+ years of experience in healthcare administration and patient care.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80',
      bio: 'Expert in biometric security systems and healthcare technology.'
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Head of Research',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80',
      bio: 'Pioneering research in biometric applications for healthcare.'
    }
  ];

  const milestones = [
    { year: '2009', title: 'Founded', description: 'BioHealth established with a vision for secure healthcare' },
    { year: '2013', title: 'First Biometric System', description: 'Launched our first biometric patient identification system' },
    { year: '2017', title: 'AI Integration', description: 'Integrated AI for predictive healthcare analytics' },
    { year: '2021', title: 'Global Expansion', description: 'Expanded to serve hospitals in 15 countries' },
    { year: '2024', title: 'Next Generation', description: 'Launching advanced biometric solutions' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About BioHealth
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-200">
            We're on a mission to revolutionize healthcare through secure, efficient, 
            and accessible biometric technology.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                To provide healthcare institutions with cutting-edge biometric solutions 
                that enhance patient safety, streamline operations, and improve overall 
                healthcare outcomes.
              </p>
              <p className="text-lg text-gray-700">
                We believe that every patient deserves secure, efficient, and personalized 
                healthcare. Our biometric system ensures that medical records are protected, 
                patient identity is verified, and healthcare delivery is optimized.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-blue-700 mb-2">100%</div>
                <div className="text-gray-700">Secure Verification</div>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-blue-700 mb-2">24/7</div>
                <div className="text-gray-700">Support Available</div>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-blue-700 mb-2">99.9%</div>
                <div className="text-gray-700">Uptime</div>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-blue-700 mb-2">5K+</div>
                <div className="text-gray-700">Active Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Journey
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="flex-1 md:px-8">
                    <div className={`bg-white p-6 rounded-lg shadow-lg ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                      <span className="text-blue-700 font-bold text-xl">{milestone.year}</span>
                      <h3 className="text-xl font-semibold text-gray-900 mt-2">{milestone.title}</h3>
                      <p className="text-gray-600 mt-2">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-700 rounded-full border-4 border-white"></div>
                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Meet Our Leadership Team
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Dedicated professionals committed to healthcare innovation
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-700 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
