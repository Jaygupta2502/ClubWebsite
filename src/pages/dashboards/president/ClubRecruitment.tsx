import React, { useState } from 'react';
import { 
  UserPlus, Link as LinkIcon, Calendar, Clock, Search, Filter, 
  Plus, Eye, Edit, Trash2, ExternalLink, AlertCircle, CheckCircle 
} from 'lucide-react';

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
  createdDate: string;
};

const ClubRecruitment: React.FC = () => {
  const [showNewRecruitmentForm, setShowNewRecruitmentForm] = useState(false);
  const [selectedClub, setSelectedClub] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    club: '',
    title: '',
    description: '',
    googleFormUrl: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
  });

  // Sample clubs data
  const clubs = [
    { id: 1, name: 'Tech Club' },
    { id: 2, name: 'Cultural Club' },
    { id: 3, name: 'Sports Club' },
    { id: 4, name: 'E-Cell' },
    { id: 5, name: 'Photography Club' },
    { id: 6, name: 'Debate Society' }
  ];

  // Sample recruitment data
  const recruitments: Recruitment[] = [
    {
      id: '1',
      club: 'Tech Club',
      title: 'Technical Team Recruitment 2025',
      description: 'Join our technical team! We are looking for passionate developers, designers, and tech enthusiasts to join our club.',
      googleFormUrl: 'https://forms.google.com/tech-club-recruitment-2025',
      startDate: '2025-06-01',
      endDate: '2025-06-15',
      startTime: '09:00',
      endTime: '23:59',
      status: 'Active',
      applicants: 45,
      createdDate: '2025-05-25'
    },
    {
      id: '2',
      club: 'Cultural Club',
      title: 'Cultural Committee Recruitment',
      description: 'Calling all creative minds! Join our cultural committee and help organize amazing cultural events and festivals.',
      googleFormUrl: 'https://forms.google.com/cultural-club-recruitment',
      startDate: '2025-05-20',
      endDate: '2025-06-05',
      startTime: '10:00',
      endTime: '22:00',
      status: 'Closed',
      applicants: 32,
      createdDate: '2025-05-15'
    },
    {
      id: '3',
      club: 'Sports Club',
      title: 'Sports Coordinator Positions',
      description: 'We are recruiting sports coordinators for various sports activities and tournaments.',
      googleFormUrl: 'https://forms.google.com/sports-club-coordinators',
      startDate: '2025-06-10',
      endDate: '2025-06-25',
      startTime: '08:00',
      endTime: '20:00',
      status: 'Draft',
      applicants: 0,
      createdDate: '2025-06-01'
    },
    {
      id: '4',
      club: 'E-Cell',
      title: 'Entrepreneurship Team 2025',
      description: 'Join our entrepreneurship cell and be part of startup initiatives, business competitions, and innovation projects.',
      googleFormUrl: 'https://forms.google.com/ecell-team-recruitment',
      startDate: '2025-04-15',
      endDate: '2025-04-30',
      startTime: '09:00',
      endTime: '23:59',
      status: 'Expired',
      applicants: 28,
      createdDate: '2025-04-10'
    }
  ];

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New recruitment submitted:', formData);
    setShowNewRecruitmentForm(false);
    setFormData({
      club: '',
      title: '',
      description: '',
      googleFormUrl: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
    });
  };

  // Check if recruitment is currently active
  const isRecruitmentActive = (recruitment: Recruitment) => {
    const now = new Date();
    const startDateTime = new Date(`${recruitment.startDate}T${recruitment.startTime}`);
    const endDateTime = new Date(`${recruitment.endDate}T${recruitment.endTime}`);
    
    return now >= startDateTime && now <= endDateTime && recruitment.status === 'Active';
  };

  // Auto-update status based on dates
  const getActualStatus = (recruitment: Recruitment) => {
    if (recruitment.status === 'Draft') return 'Draft';
    
    const now = new Date();
    const startDateTime = new Date(`${recruitment.startDate}T${recruitment.startTime}`);
    const endDateTime = new Date(`${recruitment.endDate}T${recruitment.endTime}`);
    
    if (now < startDateTime) return 'Draft';
    if (now > endDateTime) return 'Expired';
    return 'Active';
  };

  // Filter recruitments
  const filteredRecruitments = recruitments.filter(recruitment => {
    const actualStatus = getActualStatus(recruitment);
    const matchesClub = selectedClub === 'all' || recruitment.club === selectedClub;
    const matchesStatus = selectedStatus === 'all' || actualStatus === selectedStatus;
    const matchesSearch = 
      recruitment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recruitment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recruitment.club.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesClub && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (recruitment: Recruitment) => {
    const actualStatus = getActualStatus(recruitment);
    
    switch (actualStatus) {
      case 'Active':
        return <span className="bg-success-100 text-success-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
          <CheckCircle size={12} className="mr-1" />
          Active
        </span>;
      case 'Closed':
        return <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs font-medium">
          Closed
        </span>;
      case 'Draft':
        return <span className="bg-warning-100 text-warning-700 px-2 py-1 rounded-full text-xs font-medium">
          Draft
        </span>;
      case 'Expired':
        return <span className="bg-error-100 text-error-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
          <AlertCircle size={12} className="mr-1" />
          Expired
        </span>;
      default:
        return <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs font-medium">{actualStatus}</span>;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Club Recruitment</h1>
          <p className="text-neutral-600">Manage club member recruitment with time-based registration</p>
        </div>
        <button 
          className="btn-primary flex items-center"
          onClick={() => setShowNewRecruitmentForm(true)}
        >
          <Plus size={18} className="mr-2" />
          <span>New Recruitment</span>
        </button>
      </div>

      {/* New Recruitment Form */}
      {showNewRecruitmentForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fade-in">
          <h2 className="text-lg font-semibold mb-4">Create New Recruitment</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="club" className="block text-sm font-medium text-neutral-700 mb-2">
                  Club <span className="text-error-600">*</span>
                </label>
                <select
                  id="club"
                  name="club"
                  value={formData.club}
                  onChange={handleFormChange}
                  className="input"
                  required
                >
                  <option value="">Select Club</option>
                  {clubs.map(club => (
                    <option key={club.id} value={club.name}>{club.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
                  Recruitment Title <span className="text-error-600">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  className="input"
                  placeholder="Enter recruitment title"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
                Description <span className="text-error-600">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows={3}
                className="input"
                placeholder="Describe the recruitment requirements and benefits"
                required
              ></textarea>
            </div>

            <div>
              <label htmlFor="googleFormUrl" className="block text-sm font-medium text-neutral-700 mb-2">
                Google Form URL <span className="text-error-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon size={18} className="text-neutral-400" />
                </div>
                <input
                  type="url"
                  id="googleFormUrl"
                  name="googleFormUrl"
                  value={formData.googleFormUrl}
                  onChange={handleFormChange}
                  className="input pl-10"
                  placeholder="https://forms.google.com/..."
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-neutral-700 mb-2">
                  Start Date <span className="text-error-600">*</span>
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleFormChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-neutral-700 mb-2">
                  End Date <span className="text-error-600">*</span>
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleFormChange}
                  className="input"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-neutral-700 mb-2">
                  Start Time <span className="text-error-600">*</span>
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleFormChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-neutral-700 mb-2">
                  End Time <span className="text-error-600">*</span>
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleFormChange}
                  className="input"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="btn-outline"
                onClick={() => setShowNewRecruitmentForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Create Recruitment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search recruitments..."
                className="input pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="input"
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
            >
              <option value="all">All Clubs</option>
              {clubs.map(club => (
                <option key={club.id} value={club.name}>{club.name}</option>
              ))}
            </select>
            <select
              className="input"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Expired">Expired</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recruitments List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Recruitment Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Club
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Registration Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Time Slot
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Applicants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {filteredRecruitments.length > 0 ? (
                filteredRecruitments.map((recruitment) => (
                  <tr key={recruitment.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium">{recruitment.title}</div>
                        <div className="text-sm text-neutral-600 max-w-xs truncate">{recruitment.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {recruitment.club}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1 text-neutral-400" />
                          <span>{recruitment.startDate}</span>
                        </div>
                        <div className="flex items-center text-neutral-500">
                          <span className="ml-4">to {recruitment.endDate}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1 text-neutral-400" />
                          <span>{recruitment.startTime}</span>
                        </div>
                        <div className="flex items-center text-neutral-500">
                          <span className="ml-4">to {recruitment.endTime}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      <div className="flex items-center">
                        <UserPlus size={14} className="mr-1 text-neutral-400" />
                        <span>{recruitment.applicants}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(recruitment)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end space-x-2">
                        <a
                          href={recruitment.googleFormUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-md hover:bg-neutral-100"
                          title="Open Form"
                        >
                          <ExternalLink size={16} className="text-neutral-600" />
                        </a>
                        <button 
                          className="p-1 rounded-md hover:bg-neutral-100" 
                          title="View Details"
                        >
                          <Eye size={16} className="text-neutral-600" />
                        </button>
                        <button 
                          className="p-1 rounded-md hover:bg-neutral-100" 
                          title="Edit"
                        >
                          <Edit size={16} className="text-neutral-600" />
                        </button>
                        <button 
                          className="p-1 rounded-md hover:bg-neutral-100" 
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-error-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-neutral-500">
                    No recruitments found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-primary-50 rounded-xl p-6 border border-primary-100">
        <h3 className="text-lg font-semibold mb-3 text-primary-900">Recruitment Management Tips</h3>
        <ul className="space-y-2 text-primary-800">
          <li className="flex items-start">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 mr-2"></span>
            <span>Set clear start and end dates/times for automatic recruitment management.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 mr-2"></span>
            <span>Recruitment forms will automatically close when the end date/time is reached.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 mr-2"></span>
            <span>Create detailed descriptions to attract the right candidates for your club.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 mr-2"></span>
            <span>Monitor applicant numbers and extend deadlines if needed before the end time.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ClubRecruitment;