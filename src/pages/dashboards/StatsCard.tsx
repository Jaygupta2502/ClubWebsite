import React from 'react';

interface StatsCardProps {
  title: string;
  icon: React.ReactNode;
  value: number | string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, icon, value }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-xl font-semibold">{value}</p>
      </div>
      <div className="text-blue-500 bg-blue-100 p-2 rounded-full">
        {icon}
      </div>
    </div>
  );
};

export default StatsCard;
