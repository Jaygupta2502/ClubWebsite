import React from 'react';
import { FileText, Shield, Users, AlertTriangle, CheckCircle } from 'lucide-react';

const TermsPage: React.FC = () => {
  return (
    <div className="bg-neutral-50 min-h-screen pt-24">
      {/* Hero Section */}
      <section className="bg-primary-950 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
            Please read these terms and conditions carefully before using our platform
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <FileText size={24} className="text-primary-600 mr-3" />
                <h2 className="text-2xl font-bold">Terms of Service</h2>
              </div>
              <p className="text-neutral-600">Last updated: June 2025</p>
            </div>

            <div className="space-y-8">
              {/* Acceptance of Terms */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle size={20} className="text-success-600 mr-2" />
                  1. Acceptance of Terms
                </h3>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  By accessing and using the Campus Events Management System, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <p className="text-neutral-700 leading-relaxed">
                  These terms apply to all users of the platform, including students, faculty, administrators, and club presidents.
                </p>
              </div>

              {/* User Responsibilities */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Users size={20} className="text-primary-600 mr-2" />
                  2. User Responsibilities
                </h3>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary-500 mt-2 mr-3"></span>
                    <span>Users must provide accurate and complete information when registering for events or creating accounts.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary-500 mt-2 mr-3"></span>
                    <span>Club presidents are responsible for the accuracy of event information and timely submission of reports.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary-500 mt-2 mr-3"></span>
                    <span>Users must not misuse the platform for unauthorized activities or spam.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary-500 mt-2 mr-3"></span>
                    <span>All communications through the platform must be professional and respectful.</span>
                  </li>
                </ul>
              </div>

              {/* Event Management */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Shield size={20} className="text-primary-600 mr-2" />
                  3. Event Management
                </h3>
                <div className="space-y-4 text-neutral-700">
                  <p>
                    <strong>Event Creation:</strong> All events must be approved through the proper channels (Faculty → Venue Coordinator → HOD → Dean if required).
                  </p>
                  <p>
                    <strong>Venue Booking:</strong> Venue availability is subject to approval and may be revoked if terms are violated.
                  </p>
                  <p>
                    <strong>Event Reports:</strong> Post-event reports must be submitted within 7 days of event completion.
                  </p>
                  <p>
                    <strong>Cancellation Policy:</strong> Events may be cancelled by administration if they violate institutional policies.
                  </p>
                </div>
              </div>

              {/* Privacy and Data */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Shield size={20} className="text-success-600 mr-2" />
                  4. Privacy and Data Protection
                </h3>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-success-500 mt-2 mr-3"></span>
                    <span>We collect only necessary information for platform functionality.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-success-500 mt-2 mr-3"></span>
                    <span>User data is protected and not shared with third parties without consent.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-success-500 mt-2 mr-3"></span>
                    <span>Event registration data is used solely for event management purposes.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-success-500 mt-2 mr-3"></span>
                    <span>Users can request data deletion by contacting administration.</span>
                  </li>
                </ul>
              </div>

              {/* Prohibited Activities */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <AlertTriangle size={20} className="text-error-600 mr-2" />
                  5. Prohibited Activities
                </h3>
                <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                  <ul className="space-y-2 text-error-800">
                    <li>• Creating fake events or providing false information</li>
                    <li>• Attempting to access unauthorized areas of the platform</li>
                    <li>• Harassment or inappropriate behavior towards other users</li>
                    <li>• Using the platform for commercial purposes without permission</li>
                    <li>• Violating institutional policies or local laws</li>
                    <li>• Sharing login credentials with unauthorized persons</li>
                  </ul>
                </div>
              </div>

              {/* Limitation of Liability */}
              <div>
                <h3 className="text-xl font-semibold mb-4">6. Limitation of Liability</h3>
                <p className="text-neutral-700 leading-relaxed">
                  The Campus Events Management System is provided "as is" without warranty of any kind. We are not liable for any damages arising from the use of this platform, including but not limited to event cancellations, technical issues, or data loss.
                </p>
              </div>

              {/* Modifications */}
              <div>
                <h3 className="text-xl font-semibold mb-4">7. Modifications to Terms</h3>
                <p className="text-neutral-700 leading-relaxed">
                  We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or platform notifications. Continued use of the platform after modifications constitutes acceptance of the new terms.
                </p>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-xl font-semibold mb-4">8. Contact Information</h3>
                <p className="text-neutral-700 leading-relaxed">
                  If you have any questions about these Terms & Conditions, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-primary-50 rounded-lg">
                  <p className="text-primary-800">
                    <strong>Email:</strong> info@mituniversity.edu.in<br />
                    <strong>Phone:</strong>020- 26912901 / 02 / 03 ,
9595124234<br />
                    <strong>Address:</strong>                         MIT Art, Design and Technology University,<br />
                        Rajbaugh Loni Kalbhor, Solapur Highway, Near Bharat Petrol Pump Loni Kalbhor Railway Station, Pune - 412201, Maharashtra India.

                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;