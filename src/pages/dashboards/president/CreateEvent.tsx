// Updated CreateEvent.tsx: Require all fields before allowing 'Next'

import { CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CreateEvent = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', category: '', date: '',
    startTime: '', endTime: '', building: '', venue: '', capacity: '',
    isTicketed: 'no', ticketPrice: '', ticketQuantity: '',
    bannerImage: null, clubLogo: null, club: '',
    additionalDetails: '', registrationLink: '', attendees: '',
    schedule: [{ time: '', title: '', description: '' }],targetAudience: [],
  });

  const buildings = [
    { name: 'IT Building', venues: ['6th Floor Auditorium', 'Apple Lab', 'Seminar Hall','N506 Butterfly Lab'] },
    { name: 'Design Building', venues: ['Computer Lab', 'Innovation Center', 'Workshop Area'] },
    { name: 'ISBJ', venues: ['Auditorium', 'Main Hall', 'Other'] },
    { name: 'Sports Complex', venues: ['Indoor Stadium', 'Basketball Court', 'Swimming Pool','Ground'] },
  ];

  const getAvailableVenues = () => {
    const building = buildings.find(b => b.name === formData.building);
    return building ? building.venues : [];
  };

  const isStep1Valid = () => {
  return (
    formData.club.trim() !== '' &&
    formData.title.trim() !== '' &&
    formData.description.trim() !== '' &&
    formData.category.trim() !== ''
  );
};

const isStep2Valid = () => {
  const baseFieldsFilled =
    formData.date && formData.startTime && formData.endTime &&
    formData.building && formData.venue && formData.attendees && formData.capacity;
  const isWithinAllowedTime = (time: string) => {
  return time >= '09:00' && time <= '17:30';
};

if (!isWithinAllowedTime(formData.startTime) || !isWithinAllowedTime(formData.endTime)) {
  return false;
}

  if (formData.isTicketed === 'yes') {
    return (
      baseFieldsFilled &&
      formData.ticketPrice.trim() !== '' &&
      formData.ticketQuantity.trim() !== ''
    );
  } else {
    return baseFieldsFilled;
  }
};


  const handleNext = () => {
    if (currentStep === 1 && isStep1Valid()) {
      setCurrentStep(2);
    } else if (currentStep === 2 ) {
       const isValid = isStep2Valid();
    const isTimeValid = formData.startTime >= '09:00' && formData.endTime <= '17:30';

    if (!isTimeValid) {
      toast.error("⏰ You can only schedule events between 9:00 AM and 5:30 PM");
      return;
    }

    if (isValid) {
      setCurrentStep(3);
    } else {
      toast.error("Please fill in all required fields");
    }
    }else if (currentStep === 3) {
  setCurrentStep(4);
}
  };

  const handleBack = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submission = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'bannerImage' || key === 'clubLogo') {
        if (value) submission.append(key, value);
      } else if (key === 'schedule') {
        submission.append('schedule', JSON.stringify(value));
      } else if (key === 'schedule' || key === 'targetAudience') {
  submission.append(key, JSON.stringify(value));
      } else {
        submission.append(key, value);
      }
    });

    try {
     const token = JSON.parse(localStorage.getItem("campusEventsUser"))?.token;

const res = await fetch('http://localhost:5000/api/events/create', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`, // <-- use the parsed token
  },
  body: submission,
});
      const data = await res.json();

      if (res.ok) {
        toast.success('✅ Event created successfully!');
        navigate('/dashboard/president/history');
      } else {
        toast.error(data.message || '❌ Submission failed');
      }
    } catch (err) {
      toast.error('❌ Server error');
    }
    setLoading(false);
  };

const renderStepIndicator = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                currentStep === step
                  ? 'bg-primary-600 text-white'
                  : currentStep > step
                  ? 'bg-success-600 text-white'
                  : 'bg-neutral-200 text-neutral-600'
              }`}
            >
              {currentStep > step ? <CheckCircle size={20} /> : step}
            </div>
            <div className="text-xs font-medium mt-2 text-center">
              {step === 1
                ? 'Basic Info'
                : step === 2
                ? 'Date & Venue'
                : step === 3
                ? 'Banner & Info'
                : 'Review'}
            </div>
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        <div
          className={`h-1 flex-1 ${
            currentStep > 1 ? 'bg-success-500' : 'bg-neutral-200'
          }`}
        ></div>
        <div
          className={`h-1 flex-1 ${
            currentStep > 2 ? 'bg-success-500' : 'bg-neutral-200'
          }`}
        ></div>
        <div
          className={`h-1 flex-1 ${
            currentStep > 3 ? 'bg-success-500' : 'bg-neutral-200'
          }`}
        ></div>
      </div>
    </div>
  );
};

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <ToastContainer position="top-center" autoClose={3000} />
      <form onSubmit={handleSubmit}>
      {renderStepIndicator()}

        {currentStep === 1 && (
  <div className="animate-fade-in">
    <h2 className="text-xl font-semibold mb-6">Event Basic Information</h2>
    <div className="space-y-6">
      <div>
        <label htmlFor="club" className="block text-sm font-medium text-neutral-700 mb-2">
          Club Name <span className="text-error-600">*</span>
        </label>
        <input
          type="text"
          id="club"
          name="club"
          value={formData.club}
          onChange={(e) => setFormData({ ...formData, club: e.target.value })}
          className="input"
          placeholder="Enter club name"
          required
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
          Event Title <span className="text-error-600">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="input"
          placeholder="Enter event title"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
          Event Description <span className="text-error-600">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="input"
          placeholder="Describe your event"
          required
        ></textarea>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-2">
          Event Category <span className="text-error-600">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="input"
          required
        >
          <option value="">Select a category</option>
          <option value="Technology">Technology</option>
          <option value="Cultural">Cultural</option>
          <option value="Sports">Sports</option>
          <option value="Bootcamp">Bootcamp</option>
          <option value="Social">Social</option>
          <option value="Workshop">Workshop</option>
          <option value="HandsOn">Hands On</option>
          <option value="Guest">Guest Lecture</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          className="btn-primary"
          disabled={!isStep1Valid()}
        >
          Next
        </button>
      </div>
    </div>
  </div>
)}


        {currentStep === 2 && (
  <div className="animate-fade-in">
    <h2 className="text-xl font-semibold mb-6">Date, Time & Venue</h2>

    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Event Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="input"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Start Time(Start From 9:00am to 15:30pm)</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            className="input"
            required
            min="09:00"
            max="17:30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Time(End Till 17:30pm)</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            className="input"
            required
            min="09:00"
            max="17:30"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Building</label>
        <select
          name="building"
          value={formData.building}
          onChange={(e) => setFormData({ ...formData, building: e.target.value, venue: '' })}
          className="input"
          required
        >
          <option value="">Select a building</option>
          {buildings.map((b) => (
            <option key={b.name} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Venue</label>
        <select
          name="venue"
          value={formData.venue}
          onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
          className="input"
          required
          disabled={!formData.building}
        >
          <option value="">Select a venue</option>
          {getAvailableVenues().map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Expected Attendees</label>
        <input
          type="number"
          name="attendees"
          value={formData.attendees}
          onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
          className="input"
          placeholder="Expected number of attendees"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Capacity</label>
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
          className="input"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Is Ticketed?</label>
        <select
          name="isTicketed"
          value={formData.isTicketed}
          onChange={(e) => setFormData({ ...formData, isTicketed: e.target.value })}
          className="input"
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </div>

      {formData.isTicketed === 'yes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ticket Price</label>
            <input
              type="number"
              name="ticketPrice"
              value={formData.ticketPrice}
              onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ticket Quantity</label>
            <input
              type="number"
              name="ticketQuantity"
              value={formData.ticketQuantity}
              onChange={(e) => setFormData({ ...formData, ticketQuantity: e.target.value })}
              className="input"
              required
            />
          </div>
        </div>
      )}

      <div className="flex justify-between gap-4 pt-4 border-t mt-6">
        <button type="button" onClick={handleBack} className="btn-outline">
          Back
        </button>
        <button type="button" onClick={handleNext} className="btn-primary" disabled={!isStep2Valid()}>
          Next
        </button>
      </div>
    </div>
  </div>
)}

        {currentStep === 3 && (
  <div className="animate-fade-in">
    <h2 className="text-xl font-semibold mb-6">Media, Registration & Schedule</h2>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Registration Link</label>
        <input
          type="url"
          name="registrationLink"
          value={formData.registrationLink}
          onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
          className="input"
          placeholder="Link to register (optional)"
        />
      </div>
      <div>
  <label className="block text-sm font-medium mb-1">Target Audience</label>
  <select
    multiple
    value={formData.targetAudience}
    onChange={(e) =>
      setFormData({
        ...formData,
        targetAudience: Array.from(e.target.selectedOptions, option => option.value)
      })
    }
    className="input"
  >
    <option value="FY">FY</option>
    <option value="SY">SY</option>
    <option value="TY">TY</option>
    <option value="LY">LY</option>
  </select>
  <p className="text-xs text-neutral-500 mt-1">Hold Ctrl (or Cmd) to select multiple years</p>
</div>

      <div>
        <label className="block text-sm font-medium mb-1">Banner Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && setFormData({ ...formData, bannerImage: e.target.files[0] })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Club Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && setFormData({ ...formData, clubLogo: e.target.files[0] })}
        />
      </div>

      <div>
        <h3 className="text-md font-semibold mt-4 mb-2">Event Schedule</h3>
        {formData.schedule.map((item, idx) => (
          <div key={idx} className="border rounded-md p-4 space-y-2 mb-4">
            <input
              type="text"
              className="input"
              placeholder="Time"
              value={item.time}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  schedule: formData.schedule.map((s, i) =>
                    i === idx ? { ...s, time: e.target.value } : s
                  ),
                })
              }
            />
            <input
              type="text"
              className="input"
              placeholder="Title"
              value={item.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  schedule: formData.schedule.map((s, i) =>
                    i === idx ? { ...s, title: e.target.value } : s
                  ),
                })
              }
            />
            <textarea
              className="input"
              placeholder="Description"
              value={item.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  schedule: formData.schedule.map((s, i) =>
                    i === idx ? { ...s, description: e.target.value } : s
                  ),
                })
              }
            />
          </div>
        ))}
        <button
          type="button"
          className="btn-outline"
          onClick={() =>
            setFormData({
              ...formData,
              schedule: [
                ...formData.schedule,
                { time: '', title: '', description: '' },
              ],
            })
          }
        >
          ➕ Add Schedule
        </button>
      </div>

      <div className="flex justify-between pt-6 border-t mt-8">
        <button type="button" onClick={handleBack} className="btn-outline">
          Back
        </button>
        <button type="button" onClick={handleNext} className="btn-primary">
  Next
</button>
      </div>
    </div>
  </div>
)}

{currentStep === 4 && (
  <div className="animate-fade-in">
    <h2 className="text-xl font-semibold mb-6">Review & Submit</h2>
    <div className="space-y-4">
      <p><strong>Club:</strong> {formData.club}</p>
      <p><strong>Title:</strong> {formData.title}</p>
      <p><strong>Description:</strong> {formData.description}</p>
      <p><strong>Category:</strong> {formData.category}</p>
      <p><strong>Date:</strong> {formData.date}</p>
      <p><strong>Time:</strong> {formData.startTime} to {formData.endTime}</p>
      <p><strong>Venue:</strong> {formData.venue} ({formData.building})</p>
      <p><strong>Expected Attendees:</strong> {formData.attendees}</p>
      <p><strong>Ticketed:</strong> {formData.isTicketed}</p>
      <p><strong>Target Audience:</strong> {formData.targetAudience.join(', ') || 'None selected'}</p>
      {formData.isTicketed === 'yes' && (
        <>
          <p><strong>Ticket Price:</strong> ₹{formData.ticketPrice}</p>
          <p><strong>Ticket Quantity:</strong> {formData.ticketQuantity}</p>
        </>
      )}
      <p><strong>Registration Link:</strong> {formData.registrationLink || 'N/A'}</p>
      {formData.bannerImage && (
  <div>
    <p><strong>Banner Image:</strong></p>
    <img
      src={URL.createObjectURL(formData.bannerImage)}
      alt="Banner Preview"
      className="mt-2 h-40 rounded border"
    />
  </div>
)}

{formData.clubLogo && (
  <div>
    <p><strong>Club Logo:</strong></p>
    <img
      src={URL.createObjectURL(formData.clubLogo)}
      alt="Logo Preview"
      className="mt-2 h-24 w-24 object-contain border rounded"
    />
  </div>
)}

      <div className="flex justify-between pt-6 border-t mt-6">
  <button type="button" onClick={handleBack} className="btn-outline">
    Back
  </button>
  <button type="submit" disabled={loading} className="btn-primary">
    {loading ? 'Submitting...' : 'Submit Event'}
  </button>
</div>
    </div>
  </div>
)}

      </form>
    </div>
  );
};

export default CreateEvent;
