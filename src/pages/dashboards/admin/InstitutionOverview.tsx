import React from 'react';
import {
  Building,
  BookOpen,
  Users,
  Award,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const colleges = [
  {
    id: 1,
    name: 'College of Engineering',
    dean: 'Dr. Jordan Chen',
    departments: 6,
    faculty: 86,
    students: 2450,
    performance: 92,
  },
  {
    id: 2,
    name: 'College of Business',
    dean: 'Dr. Taylor Wright',
    departments: 4,
    faculty: 62,
    students: 1820,
    performance: 89,
  },
  {
    id: 3,
    name: 'College of Science',
    dean: 'Dr. Morgan Lee',
    departments: 5,
    faculty: 75,
    students: 2100,
    performance: 90,
  },
  {
    id: 4,
    name: 'College of Arts & Humanities',
    dean: 'Dr. Casey Kim',
    departments: 8,
    faculty: 95,
    students: 3200,
    performance: 86,
  },
  {
    id: 5,
    name: 'College of Medicine',
    dean: 'Dr. Alex Johnson',
    departments: 5,
    faculty: 110,
    students: 2880,
    performance: 94,
  },
];

const getPerformanceColor = (performance: number) => {
  if (performance >= 90) return 'bg-success-500';
  if (performance >= 80) return 'bg-primary-500';
  if (performance >= 70) return 'bg-warning-500';
  return 'bg-error-500';
};

const InstitutionOverview: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Institution Overview</h1>

      {/* College Performance Overview Table */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">College Performance Overview</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  College
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Dean
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Departments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {colleges.map((college) => (
                <tr key={college.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{college.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{college.dean}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{college.departments}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{college.students}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-neutral-200 rounded-full h-2 mr-2 flex-grow max-w-[100px]">
                        <div
                          className={`h-2 rounded-full ${getPerformanceColor(college.performance)}`}
                          style={{ width: `${college.performance}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{college.performance}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* You can add more institution-level details here */}

    </div>
  );
};

export default InstitutionOverview;
