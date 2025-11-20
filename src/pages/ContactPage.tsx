import React from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const ContactPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent! We will get back to you soon.');
  };

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#1f2937] mb-8">Contact Us</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-[#1f2937] mb-4">Get in Touch</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-[#d10000] mt-1" />
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">info@mituniversity.edu.in</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-[#d10000] mt-1" />
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">020- 26912901 / 02 / 03 ,
9595124234</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-[#d10000] mt-1" />
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Address</p>
                      <p className="text-gray-600 "style={{ textAlign: 'justify' }}>
                         MIT Art, Design and Technology University,<br />
                        Rajbaugh Loni Kalbhor, Solapur Highway, Near Bharat Petrol Pump Loni Kalbhor Railway Station, Pune - 412201, Maharashtra India.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-6 w-6 text-[#d10000] mt-1" />
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Office Hours</p>
                      <p className="text-gray-600">
                        Except Weekdays: 9:00 AM - 4:30 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#d10000] rounded-lg shadow-sm p-6 text-white">
                <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
                <p className="mb-4">
                  Our support team is here to help you with any questions about events, 
                  venue bookings, or technical assistance.
                </p>
                <p className="text-sm">
                  Average response time: <span className="font-semibold">2-3 hours</span>
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#1f2937] mb-6">Send us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d10000] focus:border-[#d10000]"
                    placeholder="Ovi Gupta"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d10000] focus:border-[#d10000]"
                    placeholder="idea@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d10000] focus:border-[#d10000]"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d10000] focus:border-[#d10000]"
                    placeholder="Your message here..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-white bg-[#d10000] hover:bg-[#b30000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d10000]"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
