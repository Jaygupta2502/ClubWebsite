import React from 'react';

const departments = [
  {
    id: 1,
    name: 'CSE DEPARTMENT',
    hod: 'Dr. Rajneeshkaur Sachdeo',
    faculty: 16,
    students: 450,
    events: 28,
    performance: 92,
  },
  {
    id: 2,
    name: 'IT DEPARTMENT',
    hod: 'Dr. Prashant Dhotre',
    faculty: 18,
    students: 420,
    events: 22,
    performance: 88,
  },
  {
    id: 3,
    name: 'ASH DEPARTMENT',
    hod: 'Prof. Dr.Shalini Vineet Garg',
    faculty: 14,
    students: 380,
    events: 18,
    performance: 86,
  },
];

const getBarColor = (value: number) => {
  if (value >= 90) return 'bg-green-500';
  if (value >= 80) return 'bg-blue-500';
  return 'bg-yellow-500';
};

const DeanDepartmentsPage: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6">Department Overview</h1>
    <div className="overflow-x-auto">
      <table className="min-w-full border rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            {['Department', 'HOD', 'Faculty', 'Students', 'Events', 'Performance'].map(header => (
              <th key={header} className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y">
          {departments.map((dept) => (
            <tr key={dept.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">{dept.name}</td>
              <td className="px-6 py-4">{dept.hod}</td>
              <td className="px-6 py-4">{dept.faculty}</td>
              <td className="px-6 py-4">{dept.students}</td>
              <td className="px-6 py-4">{dept.events}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-full max-w-[100px] h-2 bg-gray-200 rounded-full">
                    <div className={`h-2 rounded-full ${getBarColor(dept.performance)}`} style={{ width: `${dept.performance}%` }}></div>
                  </div>
                  <span className="text-sm">{dept.performance}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default DeanDepartmentsPage;
