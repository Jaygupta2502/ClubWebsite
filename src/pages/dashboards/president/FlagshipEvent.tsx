import React, { useState } from 'react';

const buildingsData = [
  {
    name: 'Main Building',
    venues: ['Main Auditorium', 'Conference Hall', 'Seminar Room']
  },
  {
    name: 'Engineering Block',
    venues: ['Computer Lab', 'Innovation Center', 'Workshop Area']
  },
  {
    name: 'Science Block',
    venues: ['Physics Lab', 'Chemistry Lab', 'Research Center']
  },
];

const eventCategories = ['Technical', 'Cultural', 'Sports', 'Entrepreneurship', 'Photography'];

const FlagshipEvent: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    building: '',
    venue: '',
    category: '',
    facultyCoordinator: '',
    budgetApprovalFile: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'building' ? { venue: '' } : {}), // reset venue if building changes
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        budgetApprovalFile: e.target.files![0],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Submit logic using fetch/axios
    console.log('Submitting flagship event:', formData);

    alert('Flagship Event submitted successfully!');
  };

  const availableVenues = buildingsData.find(b => b.name === formData.building)?.venues || [];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-6">Flagship Event Form</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Event Title */}
        <div>
          <label className="block mb-2 font-medium">Event Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input w-full"
            required
          />
        </div>

        {/* Dates and Times */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">End Time</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>
        </div>

        {/* Building and Venue */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">Building</label>
            <select
              name="building"
              value={formData.building}
              onChange={handleChange}
              className="input w-full"
              required
            >
              <option value="">Select building</option>
              {buildingsData.map(b => (
                <option key={b.name} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 font-medium">Venue</label>
            <select
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              className="input w-full"
              required
            >
              <option value="">Select venue</option>
              {availableVenues.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Budget Approval Upload */}
        <div>
          <label className="block mb-2 font-medium">Budget Approval Form (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="input w-full"
            required
          />
        </div>

        {/* Faculty Coordinator */}
        <div>
          <label className="block mb-2 font-medium">Faculty Coordinator</label>
          <input
            type="text"
            name="facultyCoordinator"
            value={formData.facultyCoordinator}
            onChange={handleChange}
            className="input w-full"
            required
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block mb-2 font-medium">Event Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input w-full"
            required
          >
            <option value="">Select category</option>
            {eventCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button type="submit" className="btn-primary">Submit Event</button>
        </div>
      </form>
    </div>
  );
};

export default FlagshipEvent;
