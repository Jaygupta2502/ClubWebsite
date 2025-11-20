import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Shield, Award, Star, Globe, Heart } from 'lucide-react';
import ganeshImage from '../components/home/ganesh.jpg'; 
import poojaImage from '../components/home/pooja.jpg'; 
import nandiniImage from '../components/home/nandini.jpg'; 
import jayImage from '../components/home/jay.jpg'; 

const team = [
  {
    name: 'Prof Dr Ganesh Pathak',
    role: 'Mentor',
    type: 'Professor',
    bio: 'Experienced faculty guiding the team with valuable insights.',
    image: ganeshImage,
  },
  {
    name: 'Dr Pooja Oza',
    role: 'Mentor',
    type: 'Assistant Professor',
    bio: 'Expert in event management and campus collaboration.',
    image: poojaImage,
  },
  {
    name: 'Nandini Gupta',
    role: 'Frontend Developer',
    type: 'Student',
    bio: 'Passionate about crafting seamless user experiences.',
    image: nandiniImage,
  },
  {
    name: 'Jay Gupta',
    role: 'Backend Developer',
    type: 'Student',
    bio: 'Builds robust and scalable backend services for our platform.',
    image: jayImage,
  },
];

const AboutPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Full width image banner with darker transparent gradient overlay */}
      <div className="relative w-full h-96 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80"
          alt="Campus event"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark transparent overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-gray-900/70 to-transparent"></div>

        {/* About Us Text on Image */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-6 sm:px-12">
          <h1 className="text-5xl font-bold text-white drop-shadow-xl mb-4 max-w-3xl">
            About Campus Events
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl drop-shadow-md">
            We're revolutionizing how campus events are organized, managed, and experienced.
            Our platform brings together students, clubs, and faculty to create memorable, impactful events.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            { icon: <Calendar className="h-6 w-6 text-blue-600" />, title: '500+', desc: 'Events Hosted' },
            { icon: <Users className="h-6 w-6 text-blue-600" />, title: '50+', desc: 'Active Clubs' },
            { icon: <Award className="h-6 w-6 text-blue-600" />, title: '98%', desc: 'Satisfaction Rate' },
            { icon: <Shield className="h-6 w-6 text-blue-600" />, title: '100%', desc: 'Secure Platform' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                {item.icon}
              </div>
              <h3 className="text-3xl font-bold text-blue-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              To streamline campus event management and create a vibrant community where ideas, 
              talents, and opportunities converge. We’re committed to making event organization 
              accessible, efficient, and enjoyable for everyone involved.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Our Vision</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              To be the cornerstone of campus event management, fostering a dynamic environment 
              where every event becomes an opportunity for learning, networking, and growth. 
              We envision a connected campus community thriving through shared experiences.
            </p>
          </div>
        </div>

        {/* Features with very light grey gradient */}
        <div className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded-xl shadow-lg p-10 mb-20 text-gray-800">
          <h2 className="text-3xl font-extrabold mb-10 text-center border-b-4 border-gray-300 pb-3 max-w-xs mx-auto text-gray-900">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { icon: <Calendar className="h-7 w-7 text-gray-700" />, title: 'Easy Scheduling', desc: 'Effortless planning and management.' },
              { icon: <Shield className="h-7 w-7 text-gray-700" />, title: 'Secure Platform', desc: 'Protected data and safe transactions.' },
              { icon: <Users className="h-7 w-7 text-gray-700" />, title: 'Community Focus', desc: 'Built to connect and collaborate.' },
              { icon: <Star className="h-7 w-7 text-gray-700" />, title: 'Recognized Success', desc: 'Celebrate accomplishments across campus.' },
              { icon: <Heart className="h-7 w-7 text-gray-700" />, title: 'User Satisfaction', desc: 'Optimized for students and faculty.' },
              { icon: <Globe className="h-7 w-7 text-gray-700" />, title: 'Anywhere Access', desc: 'Mobile-friendly and location-agnostic.' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
                className="bg-white rounded-xl p-6 text-center cursor-pointer transition-shadow shadow-sm"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-200 rounded-full mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <section className="py-20 bg-gradient-to-b from-blue-100 to-white rounded-xl shadow-md px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Meet Our Team</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                transition={{ type: 'spring', stiffness: 150 }}
                className="bg-white rounded-xl text-center shadow-lg p-6"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto border-4 border-blue-200 mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-blue-800">{member.name}</h3>
                <p className="text-blue-600 text-sm mb-1">{member.role} ({member.type})</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-blue-900 rounded-xl p-10 text-center text-white mt-20">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-blue-200 mb-6">
            Join our platform and start creating amazing campus events today.
          </p>
          <button className="inline-flex items-center px-6 py-3 rounded-lg text-base font-medium text-blue-900 bg-white hover:bg-blue-100 transition-colors">
            Create Your First Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
