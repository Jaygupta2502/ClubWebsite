import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Link as LinkIcon,
  Calendar,
  Clock,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Extend type to match backend
type Recruitment = {
  _id: string;
  id?: string;
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
  clubLogoUrl?: string;
  attachments?: { fileName: string; fileUrl: string }[];
};

const ClubRecruitment: React.FC = () => {
  const [showNewRecruitmentForm, setShowNewRecruitmentForm] = useState(false);
  const [selectedClub, setSelectedClub] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRecruitment, setEditingRecruitment] = useState<Recruitment | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);

  const initialFormData = {
    club: '',
    title: '',
    description: '',
    googleFormUrl: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    clubLogo: null as File | null,
    attachments: [] as File[]
  };

  const [formData, setFormData] = useState<any>(initialFormData);

  // Sample clubs data (keep for dropdown UI)
  const clubs = [
    { id: 1, name: 'Tech Club' },
    { id: 2, name: 'Cultural Club' },
    { id: 3, name: 'Sports Club' },
    { id: 4, name: 'E-Cell' },
    { id: 5, name: 'Photography Club' },
    { id: 6, name: 'Debate Society' }
  ];

  // Fetch recruitments from backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/recruitments`)
      .then((res) => res.json())
      .then((data) => setRecruitments(data))
      .catch((err) => console.error('Error loading recruitments:', err));
  }, []);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      // Prepare FormData
      const form = new FormData();

      // Append text fields except files
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'attachments' && key !== 'clubLogo') {
          form.append(key, value);
        }
      });

      // Append single club logo
      if (formData.clubLogo) {
        form.append('clubLogo', formData.clubLogo);
      }

      // Append multiple attachments
      if (formData.attachments && formData.attachments.length > 0) {
        formData.attachments.forEach((file: File) => {
          form.append('attachments', file);
        });
      }

      // Determine endpoint based on create vs edit
      let endpoint = `${API_BASE_URL}/api/recruitments`;
      let method: 'POST' | 'PATCH' = 'POST';

      if (isEditing && editingRecruitment) {
        const id = editingRecruitment._id || editingRecruitment.id;
        endpoint = `${API_BASE_URL}/api/recruitments/${id}`;
        method = 'PATCH';
      }

      const res = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: form
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Failed to submit recruitment');
        return;
      }

      if (method === 'PATCH') {
        // Update existing recruitment in list
        const updated = data.recruitment;
        setRecruitments((prev) =>
          prev.map((r) =>
            (r._id || r.id) === (updated._id || updated.id) ? updated : r
          )
        );
        alert('Recruitment updated successfully!');
      } else {
        // Add new recruitment to table
        setRecruitments((prev) => [data.recruitment, ...prev]);
        alert('Recruitment created successfully!');
      }

      // Reset states
      setShowNewRecruitmentForm(false);
      setIsEditing(false);
      setEditingRecruitment(null);
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error submitting recruitment:', error);
      alert('Something went wrong while submitting recruitment');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recruitment?')) return;

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_BASE_URL}/api/recruitments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Delete failed');
        return;
      }

      setRecruitments((prev) => prev.filter((r) => (r._id || r.id) !== id));
      alert('Recruitment deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete recruitment');
    }
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
  const filteredRecruitments = recruitments.filter((recruitment) => {
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
        return (
          <span className="bg-success-100 text-success-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <CheckCircle size={12} className="mr-1" />
            Active
          </span>
        );
      case 'Closed':
        return (
          <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs font-medium">
            Closed
          </span>
        );
      case 'Draft':
        return (
          <span className="bg-warning-100 text-warning-700 px-2 py-1 rounded-full text-xs font-medium">
            Draft
          </span>
        );
      case 'Expired':
        return (
          <span className="bg-error-100 text-error-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <AlertCircle size={12} className="mr-1" />
            Expired
          </span>
        );
      default:
        return (
          <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs font-medium">
            {actualStatus}
          </span>
        );
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Club Recruitment</h1>
          <p className="text-neutral-600">
            Manage club member recruitment with time-based registration
          </p>
        </div>
        <button
          className="btn-primary flex items-center"
          onClick={() => {
            setIsEditing(false);
            setEditingRecruitment(null);
            setFormData(initialFormData);
            setShowNewRecruitmentForm(true);
          }}
        >
          <Plus size={18} className="mr-2" />
          <span>New Recruitment</span>
        </button>
      </div>

      {/* New Recruitment Form */}
      {showNewRecruitmentForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fade-in">
          <h2 className="text-lg font-semibold mb-4">
            {isEditing ? 'Edit Recruitment' : 'Create New Recruitment'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="club"
                  className="block text-sm font-medium text-neutral-700 mb-2"
                >
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
                  {clubs.map((club) => (
                    <option key={club.id} value={club.name}>
                      {club.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-neutral-700 mb-2"
                >
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
              <label
                htmlFor="description"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
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
              <label
                htmlFor="googleFormUrl"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
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
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-neutral-700 mb-2"
                >
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
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-neutral-700 mb-2"
                >
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
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium text-neutral-700 mb-2"
                >
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
                <label
                  htmlFor="endTime"
                  className="block text-sm font-medium text-neutral-700 mb-2"
                >
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

            {/* File uploads (logo + attachments) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Club Logo (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setFormData((prev: any) => ({ ...prev, clubLogo: file }));
                }}
                className="input"
              />
              {formData.clubLogo && (
                <p className="text-sm text-neutral-600 mt-1">
                  Selected Logo: {formData.clubLogo.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Attachments (PDF, Docs, Images)
              </label>
              <input
                type="file"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setFormData((prev: any) => ({ ...prev, attachments: files }));
                }}
                className="input"
              />
              {formData.attachments.length > 0 && (
                <ul className="text-sm text-neutral-600 mt-1">
                  {formData.attachments.map((f: File, idx: number) => (
                    <li key={idx}>📎 {f.name}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="btn-outline"
                onClick={() => {
                  setShowNewRecruitmentForm(false);
                  setIsEditing(false);
                  setEditingRecruitment(null);
                  setFormData(initialFormData);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {isEditing ? 'Update Recruitment' : 'Create Recruitment'}
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
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
              />
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
              {clubs.map((club) => (
                <option key={club.id} value={club.name}>
                  {club.name}
                </option>
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
                  <tr
                    key={recruitment._id || recruitment.id}
                    className="hover:bg-neutral-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium">{recruitment.title}</div>
                        <div className="text-sm text-neutral-600 max-w-xs truncate">
                          {recruitment.description}
                        </div>
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
                          onClick={() => {
                            setEditingRecruitment(recruitment);
                            setFormData({
                              ...initialFormData,
                              club: recruitment.club,
                              title: recruitment.title,
                              description: recruitment.description,
                              googleFormUrl: recruitment.googleFormUrl,
                              startDate: recruitment.startDate,
                              endDate: recruitment.endDate,
                              startTime: recruitment.startTime,
                              endTime: recruitment.endTime
                            });
                            setIsEditing(true);
                            setShowNewRecruitmentForm(true);
                          }}
                        >
                          <Edit size={16} className="text-neutral-600" />
                        </button>
                        <button
                          className="p-1 rounded-md hover:bg-neutral-100"
                          title="Delete"
                          onClick={() =>
                            handleDelete(recruitment._id || recruitment.id!)
                          }
                        >
                          <Trash2 size={16} className="text-error-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-sm text-neutral-500"
                  >
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
        <h3 className="text-lg font-semibold mb-3 text-primary-900">
          Recruitment Management Tips
        </h3>
        <ul className="space-y-2 text-primary-800">
          <li className="flex items-start">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 mr-2"></span>
            <span>
              Set clear start and end dates/times for automatic recruitment
              management.
            </span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 mr-2"></span>
            <span>
              Recruitment forms will automatically close when the end date/time is
              reached.
            </span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 mr-2"></span>
            <span>
              Create detailed descriptions to attract the right candidates for your
              club.
            </span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 mr-2"></span>
            <span>
              Monitor applicant numbers and extend deadlines if needed before the end
              time.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ClubRecruitment;
