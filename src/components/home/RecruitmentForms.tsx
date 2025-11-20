import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, ExternalLink, ArrowRight } from 'lucide-react';

type Recruitment = {
  id: string;
  club: string;
  title: string;
  description: string;
  googleFormUrl: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  status: 'Active' | 'Closed' | 'Draft' | 'Expired';
  applicants: number;
  clubLogo: string;
};

const RecruitmentForms: React.FC = () => {
  // Sample active recruitment data
  const activeRecruitments: Recruitment[] = [
    {
      id: '1',
      club: 'Tech Club',
      title: 'Technical Team Recruitment 2025',
      description: 'Join our technical team! We are looking for passionate developers, designers, and tech enthusiasts.',
      googleFormUrl: 'https://forms.google.com/tech-club-recruitment-2025',
      startDate: '2025-06-01',
      endDate: '2025-06-15',
      startTime: '09:00',
      endTime: '23:59',
      status: 'Active',
      applicants: 45,
      clubLogo: 'https://images.pexels.com/photos/57007/pexels-photo-57007.jpeg',
    },
    {
      id: '2',
      club: 'Cultural Club',
      title: 'Cultural Committee Recruitment',
      description: 'Calling all creative minds! Join our cultural committee and help organize amazing cultural events.',
      googleFormUrl: 'https://forms.google.com/cultural-club-recruitment',
      startDate: '2025-06-05',
      endDate: '2025-06-20',
      startTime: '10:00',
      endTime: '22:00',
      status: 'Active',
      applicants: 32,
      clubLogo: 'https://images.pexels.com/photos/1313814/pexels-photo-1313814.jpeg?auto=compress&cs=tinysrgb&w=1440&h=150&dpr=1',
    },
    {
      id: '3',
      club: 'E-Cell',
      title: 'Entrepreneurship Team 2025',
      description: 'Join our entrepreneurship cell and be part of startup initiatives and business competitions.',
      googleFormUrl: 'https://forms.google.com/ecell-team-recruitment',
      startDate: '2025-06-10',
      endDate: '2025-06-25',
      startTime: '09:00',
      endTime: '23:59',
      status: 'Active',
      applicants: 28,
      clubLogo: 'https://images.pexels.com/photos/6224/hands-people-woman-working.jpg',
    },
    {
      id: '4',
      club: 'Photography Club',
      title: 'Photography Team Recruitment',
      description: 'Capture moments with us! Looking for photography enthusiasts to join our creative team.',
      googleFormUrl: 'https://forms.google.com/photo-club-recruitment',
      startDate: '2025-06-08',
      endDate: '2025-06-22',
      startTime: '08:00',
      endTime: '20:00',
      status: 'Active',
      applicants: 18,
      clubLogo: 'https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="bg-success-100 text-success-700 px-2 py-1 rounded-full text-xs font-medium">Active</span>;
      case 'Closed':
        return <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs font-medium">Closed</span>;
      case 'Draft':
        return <span className="bg-warning-100 text-warning-700 px-2 py-1 rounded-full text-xs font-medium">Draft</span>;
      case 'Expired':
        return <span className="bg-error-100 text-error-700 px-2 py-1 rounded-full text-xs font-medium">Expired</span>;
      default:
        return <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  return (
    <section className="pt-16 pb-6 bg-neutral-50 -translate-y-8">
  <div className="max-w-7xl mx-auto px-4 md:px-6">
    {/* Header */}
    <div className="flex flex-wrap items-center justify-between mb-10">
      <div
        className="text-3xl font-extrabold text-neutral-900 font-poppins"
        style={{
          textShadow:
            '0 0 4px rgba(255, 255, 255, 0.1), 0 0 8px rgba(0, 123, 255, 0.2), 0 0 12px rgba(0, 123, 255, 0.3)',
          marginLeft: '500px',
        }}
      >
        <h2 className="text-3xl font-bold text-neutral-900">Club Recruitments</h2>
      </div>
      <Link
        to="/clubs"
        className="mt-4 md:mt-0 flex items-center text-[#d10000] hover:text-[#b30000] font-medium"
      >
        <span>View All Clubs</span>
        <ArrowRight size={18} className="ml-1" />
      </Link>
    </div>

    {/* Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {activeRecruitments.map((recruitment) => (
        <div
          key={recruitment.id}
          className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in"
        >
          <div className="relative">
            <img
              src={recruitment.clubLogo}
              alt={recruitment.club}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-3 left-3">
              <div className="bg-white rounded-full p-1 shadow-md">
                <img
                  src={recruitment.clubLogo}
                  alt={recruitment.club}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
            </div>
            <div className="absolute top-3 right-3">
              {getStatusBadge(recruitment.status)}
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold text-neutral-900 line-clamp-1 mb-2 group-hover:text-primary-600">
              {recruitment.title}
            </h3>

            <div className="text-sm text-gray-600 mb-1 font-medium">
              {recruitment.club}
            </div>

            <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
              {recruitment.description}
            </p>

            <div className="flex items-center text-sm text-neutral-600 mb-1">
              <Calendar size={16} className="mr-2 text-[#d10000]" />
              <span>{recruitment.startDate} - {recruitment.endDate}</span>
            </div>

            <div className="flex items-center text-sm text-neutral-600 mb-4">
              <Clock size={16} className="mr-2 text-[#d10000]" />
              <span>{recruitment.startTime} - {recruitment.endTime}</span>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img
                  src={recruitment.clubLogo}
                  alt={recruitment.club}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-xs text-gray-500">{recruitment.club}</span>
              </div>

              <Link
                to={`/clubs/${recruitment.id}`}
                className="text-sm font-medium text-[#d10000] hover:text-[#b30000] transition-colors"
              >
                View Details
              </Link>
            </div>

            {/* Apply Button */}
            <div className="mt-4">
              <a
                href={recruitment.googleFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center text-white bg-[#d10000] hover:bg-[#b30000] font-semibold px-4 py-2 rounded-full text-sm w-full"
              >
                <span>Apply Now</span>
                <ExternalLink size={14} className="ml-2" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Footer Button */}
    <div className="mt-10 text-center">
      <Link
        to="/clubs"
        className="inline-flex items-center text-white bg-[#d10000] hover:bg-[#b30000] font-semibold px-6 py-3 rounded-full transition-colors"
      >
        <span>See All Recruitments</span>
        <ArrowRight size={18} className="ml-2" />
      </Link>
    </div>
  </div>
</section>

  );
};

export default RecruitmentForms;