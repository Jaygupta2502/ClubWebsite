import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

type Hod = {
  _id: string;
  name: string;
  email: string;
  department: string;
};

const ManageHods: React.FC = () => {
  const { user } = useAuth();
  const [hods, setHods] = useState<Hod[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', department: '' });
  const [editId, setEditId] = useState<string | null>(null);

  const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const fetchHods = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/dean/hods`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const data = await res.json();
      setHods(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch HODs:', err);
    }
  };

  useEffect(() => {
    fetchHods();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editId ? 'PUT' : 'POST';
    const endpoint = editId ? `/api/dean/hod/${editId}` : '/api/dean/hod';

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
  method,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${user?.token}`,
  },
  body: JSON.stringify(formData),
});

const data = await res.json();  // 👈 get the response body

if (!res.ok) {
  console.error("🛑 Save HOD error response:", data);  // 👈 log server error message
  throw new Error(data.message || 'Failed to save HOD');
}


      if (!res.ok) throw new Error('Failed to save HOD');

      setFormData({ name: '', email: '', password: '', department: '' });
      setEditId(null);
      fetchHods();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (hod: Hod) => {
    setFormData({ name: hod.name, email: hod.email, password: '', department: hod.department });
    setEditId(hod._id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this HOD?')) return;

    try {
      await fetch(`${API_BASE}/api/dean/hod/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      fetchHods();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-4">Manage HODs</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded shadow mb-6">
        <input
          className="input input-bordered"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          className="input input-bordered"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          className="input input-bordered"
          placeholder="Password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required={!editId}
        />
        <input
          className="input input-bordered"
          placeholder="Department"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          required
        />
        <button type="submit" className="btn btn-primary col-span-1 md:col-span-2">
          {editId ? 'Update HOD' : 'Create HOD'}
        </button>
      </form>

      <table className="table-auto w-full border bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Department</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {hods.map((hod) => (
            <tr key={hod._id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{hod.name}</td>
              <td className="px-4 py-2">{hod.email}</td>
              <td className="px-4 py-2">{hod.department}</td>
              <td className="px-4 py-2">
                <button onClick={() => handleEdit(hod)} className="btn btn-sm btn-outline mr-2">Edit</button>
                <button onClick={() => handleDelete(hod._id)} className="btn btn-sm btn-error text-white">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageHods;
