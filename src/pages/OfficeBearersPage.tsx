import React from 'react';
import TreeNode from '../components/TreeNode';
import { Crown, Users, Award, Building2, Network, GitBranch } from 'lucide-react';

const OfficeBearersPage = () => {
  const rootData = {
    title: 'MIT SOC',
    subtitle: 'Student Associations | Chapters | Clubs',
    position: 'President',
    name: 'Ved Ganesh Acharya',
    coordinator: 'Dr. Rajendra Pawar',
    vicePresident: 'Shireesh Kumar',
    type: 'root' as const,
    icon: Crown
  };

  const associations = [
    {
      title: 'Association of Computer Engineering Students (ACES)',
      position: 'President',
      name: 'Aayush Dalvi',
      coordinator: 'Prof. Tanuja Zende',
      type: 'association' as const
    },
    {
      title: 'Innovative Global Network of I.T. Engineers (IGNITE)',
      position: 'President',
      name: 'Janmesh Raut',
      coordinator: 'Prof. Ashwini Jadhav',
      type: 'association' as const
    }
  ];

  const chapters = [
    {
      title: 'IEEE MITADT Student Branch',
      position: 'Chair',
      name: 'Roshan Warade',
      coordinator: 'Dr. Reena Pagare',
      type: 'chapter' as const
    },
    {
      title: 'IEEE Engineering in Medicine & Biology Society Student Chapter',
      position: 'Chair',
      name: 'Sujal Jadhvar',
      coordinator: 'Dr. Reena Pagare',
      type: 'chapter' as const
    },
    {
      title: 'IEEE Computational Intelligence Society Student Chapter',
      position: 'Chair',
      name: 'Piyush Bavane',
      coordinator: 'Dr. Jayashree Prasad',
      type: 'chapter' as const
    },
    {
      title: 'IEEE Computer Society Student Chapter',
      position: 'Chair',
      name: 'Kushal Vijay Patil',
      coordinator: 'Dr. Nitin More',
      type: 'chapter' as const
    }
  ];

  const clubs = [
    { title: 'AWS Cloud Club', position: 'President', name: 'Parth Shah', coordinator: 'Dr. Rajni Sajjan' },
    { title: 'Cloud Computing Club', position: 'President', name: 'Rushikesh Zope', coordinator: 'Dr. Sumit Hirve' },
    { title: 'CodeChef', position: 'President', name: 'Shreeya Phapale', coordinator: 'Prof. Chaitanya Garware' },
    { title: 'Cybersecurity and Blockchain Club', position: 'President', name: 'Anant Jain', coordinator: 'Dr. Hyder Ali Hingoliwala' },
    { title: 'ARCADE', position: 'President', name: 'Om Kulthe ', coordinator: 'Prof. Shubhra Mathur' },
    { title: 'GeeksforGeeks', position: 'President', name: 'Kunal Singh', coordinator: 'Prof. Anuja Chincholkar' },
    { title: 'IDEATE', position: 'President', name: 'Tejas Gavhane', coordinator: 'Dr. Abhishek Dhore' },
    { title: 'SynapseAI', position: 'President', name: 'Shifa Pathan', coordinator: 'Prof. Shahin Makubhai' },
    { title: 'JavaBrewers', position: 'President', name: 'Lalit Deshmukh', coordinator: 'Prof. Rahul More' },
    { title: 'Yuvarth', position: 'President', name: 'Shivam Mhamane', coordinator: 'Prof. Gurunath Waghale' },
    { title: 'Microsoft Student Learning Club', position: 'President', name: 'Rohit Khatri', coordinator: 'Prof. Abhishek Dhore' },
    { title: 'MIT Swift Coding Club', position: 'President', name: 'Sanskriti Khamkar', coordinator: 'Prof. Reetika Kerketta' },
    { title: 'Mirage', position: 'President', name: 'Meghraj Nair', coordinator: 'Prof. Rajkumar Patil' },
    { title: 'TECHNO SMART CAMPUS CLUB', position: 'President', name: 'Parissa Matey', coordinator: 'Dr. Rajni Sajjan' },
    { title: 'ASTECH', position: 'President', name: 'Yash Gutte', coordinator: 'Dr. Harshawardhan Bhatkar' },
    { title: 'Words\'Worth', position: 'President', name: 'Ziyan Jahagirdar', coordinator: 'Dr. Balasaheb Wakde' },
    { title: 'QQUEST CLUB', position: 'President', name: 'Wani Tantarpale', coordinator: 'Dr. Harshawardhan Bhatkar' }
  ].map(club => ({ ...club, type: 'club' as const }));

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full mb-6 shadow-xl">
            <Crown className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Office Bearers
          </h1>
          <p className="text-xl text-gray-600 font-medium mb-2">Academic Year 2024–25</p>
          <p className="text-lg text-gray-500">
            MIT Art, Design & Technology University - School of Computing
          </p>
        </div>

        {/* Tree Container */}
        <div className="relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, #3B82F6 2px, transparent 0), radial-gradient(circle at 75px 75px, #8B5CF6 2px, transparent 0)`,
              backgroundSize: '100px 100px'
            }}></div>
          </div>

          {/* Root Node */}
          <div className="relative flex justify-center mb-12">
            <TreeNode {...rootData} />
          </div>

          {/* Main Trunk Line */}
          <div className="relative flex justify-center mb-8">
            <div className="w-1 h-16 bg-gradient-to-b from-blue-500 to-blue-400 rounded-full shadow-lg"></div>
          </div>

          {/* Junction Point */}
          <div className="relative flex justify-center mb-8">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg border-4 border-white"></div>
          </div>

          {/* Main Horizontal Branch */}
          <div className="relative mb-8">
            <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-blue-400 via-teal-400 to-orange-400 rounded-full shadow-md"></div>
            
            {/* Branch Points */}
            <div className="absolute top-0 left-1/4 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-2 -translate-y-1.5 shadow-lg border-2 border-white"></div>
            <div className="absolute top-0 left-1/2 w-4 h-4 bg-teal-500 rounded-full transform -translate-x-2 -translate-y-1.5 shadow-lg border-2 border-white"></div>
            <div className="absolute top-0 right-1/4 w-4 h-4 bg-orange-500 rounded-full transform translate-x-2 -translate-y-1.5 shadow-lg border-2 border-white"></div>
          </div>

          {/* Vertical Branch Lines */}
          <div className="relative mb-12">
            <div className="absolute top-0 left-1/4 w-1 h-12 bg-gradient-to-b from-blue-400 to-blue-300 rounded-full transform -translate-x-0.5 shadow-md"></div>
            <div className="absolute top-0 left-1/2 w-1 h-12 bg-gradient-to-b from-teal-400 to-teal-300 rounded-full transform -translate-x-0.5 shadow-md"></div>
            <div className="absolute top-0 right-1/4 w-1 h-12 bg-gradient-to-b from-orange-400 to-orange-300 rounded-full transform translate-x-0.5 shadow-md"></div>
          </div>

          {/* Three Main Branches */}
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
            {/* Associations Branch */}
            <div className="relative">
              {/* Branch Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-bold text-lg shadow-xl transform hover:scale-105 transition-transform duration-200">
                  <Building2 className="mr-3 h-6 w-6" />
                  Associations
                </div>
              </div>
              
              {/* Vertical Connecting Line */}
              <div className="absolute left-1/2 top-20 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 to-blue-200 transform -translate-x-0.25 rounded-full"></div>
              
              <div className="space-y-8">
                {associations.map((item, index) => (
                  <div key={index} className="relative">
                    {/* Horizontal connector */}
                    <div className="absolute left-1/2 top-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-300 to-transparent transform -translate-y-0.25 -translate-x-full rounded-full"></div>
                    {/* Connection point */}
                    <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1 -translate-y-1 shadow-sm"></div>
                    <TreeNode {...item} />
                  </div>
                ))}
              </div>
            </div>

            {/* Chapters Branch */}
            <div className="relative">
              {/* Branch Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full font-bold text-lg shadow-xl transform hover:scale-105 transition-transform duration-200">
                  <Network className="mr-3 h-6 w-6" />
                  Student Chapters
                </div>
              </div>
              
              {/* Vertical Connecting Line */}
              <div className="absolute left-1/2 top-20 bottom-0 w-0.5 bg-gradient-to-b from-teal-300 to-teal-200 transform -translate-x-0.25 rounded-full"></div>
              
              <div className="space-y-8">
                {chapters.map((item, index) => (
                  <div key={index} className="relative">
                    {/* Horizontal connector */}
                    <div className="absolute left-1/2 top-1/2 w-8 h-0.5 bg-gradient-to-r from-teal-300 to-transparent transform -translate-y-0.25 -translate-x-full rounded-full"></div>
                    {/* Connection point */}
                    <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-teal-400 rounded-full transform -translate-x-1 -translate-y-1 shadow-sm"></div>
                    <TreeNode {...item} />
                  </div>
                ))}
              </div>
            </div>

            {/* Clubs Branch */}
            <div className="relative">
              {/* Branch Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-bold text-lg shadow-xl transform hover:scale-105 transition-transform duration-200">
                  <Users className="mr-3 h-6 w-6" />
                  Clubs
                </div>
              </div>
              
              {/* Scrollable Container */}
              <div className="relative max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
                {/* Vertical Connecting Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-300 to-orange-200 transform -translate-x-0.25 rounded-full"></div>
                
                <div className="space-y-6">
                  {clubs.map((item, index) => (
                    <div key={index} className="relative">
                      {/* Horizontal connector */}
                      <div className="absolute left-1/2 top-1/2 w-8 h-0.5 bg-gradient-to-r from-orange-300 to-transparent transform -translate-y-0.25 -translate-x-full rounded-full"></div>
                      {/* Connection point */}
                      <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-orange-400 rounded-full transform -translate-x-1 -translate-y-1 shadow-sm"></div>
                      <TreeNode {...item} compact />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tree Legend */}
          <div className="mt-16 flex justify-center">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-200/50">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Organization Structure</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full mx-auto mb-3 shadow-lg"></div>
                  <h4 className="font-semibold text-blue-800 mb-1">Associations</h4>
                  <p className="text-sm text-blue-600">{associations.length} Organizations</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-teal-50 border border-teal-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full mx-auto mb-3 shadow-lg"></div>
                  <h4 className="font-semibold text-teal-800 mb-1">Student Chapters</h4>
                  <p className="text-sm text-teal-600">{chapters.length} Chapters</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-orange-50 border border-orange-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full mx-auto mb-3 shadow-lg"></div>
                  <h4 className="font-semibold text-orange-800 mb-1">Clubs</h4>
                  <p className="text-sm text-orange-600">{clubs.length} Active Clubs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeBearersPage;