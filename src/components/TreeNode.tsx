import React from 'react';
import { Crown, User, GraduationCap, Building2, Network, Users, DivideIcon as LucideIcon } from 'lucide-react';

interface TreeNodeProps {
  title: string;
  subtitle?: string;
  position: string;
  name: string;
  coordinator: string;
  vicePresident?: string;
  type: 'root' | 'association' | 'chapter' | 'club';
  icon?: LucideIcon;
  compact?: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  title,
  subtitle,
  position,
  name,
  coordinator,
  vicePresident,
  type,
  icon: Icon,
  compact = false
}) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'root': return Crown;
      case 'association': return Building2;
      case 'chapter': return Network;
      case 'club': return Users;
      default: return User;
    }
  };

  const DisplayIcon = Icon || getTypeIcon();

  const getColors = () => {
    switch (type) {
      case 'root':
        return {
          bg: 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700',
          border: 'border-blue-300',
          text: 'text-white',
          accent: 'bg-white/20 text-white',
          shadow: 'shadow-2xl'
        };
      case 'association':
        return {
          bg: 'bg-white',
          border: 'border-blue-300',
          text: 'text-gray-900',
          accent: 'bg-blue-100 text-blue-800',
          shadow: 'shadow-xl hover:shadow-2xl'
        };
      case 'chapter':
        return {
          bg: 'bg-white',
          border: 'border-teal-300',
          text: 'text-gray-900',
          accent: 'bg-teal-100 text-teal-800',
          shadow: 'shadow-xl hover:shadow-2xl'
        };
      case 'club':
        return {
          bg: 'bg-white',
          border: 'border-orange-300',
          text: 'text-gray-900',
          accent: 'bg-orange-100 text-orange-800',
          shadow: 'shadow-lg hover:shadow-xl'
        };
    }
  };

  const colors = getColors();
  const isRoot = type === 'root';
  
  const cardClasses = compact 
    ? `${colors.bg} ${colors.border} border-2 rounded-xl p-4 ${colors.shadow} transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm`
    : `${colors.bg} ${colors.border} border-2 rounded-2xl p-6 ${colors.shadow} transition-all duration-300 transform hover:-translate-y-2 backdrop-blur-sm`;

  return (
    <div className={cardClasses}>
      {/* Header Section */}
      <div className="flex items-start space-x-4 mb-4">
        <div className={`p-3 ${isRoot ? 'bg-white/20' : colors.accent} rounded-xl flex-shrink-0 shadow-lg`}>
          <DisplayIcon className={`h-6 w-6 ${isRoot ? 'text-white' : ''}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold ${compact ? 'text-base' : isRoot ? 'text-2xl' : 'text-lg'} ${colors.text} leading-tight mb-1`}>
            {title}
          </h3>
          {subtitle && (
            <p className={`text-sm ${isRoot ? 'text-white/80' : 'text-gray-600'} font-medium`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Position Badge */}
      <div className="mb-4">
        <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${colors.accent} shadow-sm`}>
          {position}
        </span>
      </div>

      {/* Main Content */}
      <div className="space-y-3">
        {/* President/Chair Name */}
        <div className={`p-3 rounded-lg ${isRoot ? 'bg-white/10' : 'bg-gray-50'} border ${isRoot ? 'border-white/20' : 'border-gray-200'}`}>
          <p className={`font-bold ${compact ? 'text-sm' : 'text-base'} ${colors.text} mb-1`}>
            {name}
          </p>
          <div className="flex items-center space-x-2">
            <GraduationCap className={`h-4 w-4 ${isRoot ? 'text-white/70' : 'text-gray-500'}`} />
            <p className={`text-xs ${isRoot ? 'text-white/70' : 'text-gray-500'} font-medium`}>
              Faculty Coordinator: {coordinator}
            </p>
          </div>
        </div>

        {/* Vice President (only for root) */}
        {isRoot && vicePresident && (
          <div className="p-3 rounded-lg bg-white/10 border border-white/20">
            <div className="flex items-center space-x-2 mb-2">
              <span className="inline-flex px-2 py-1 text-xs font-bold rounded-full bg-white/20 text-white">
                Vice President
              </span>
            </div>
            <p className="font-bold text-white">{vicePresident}</p>
          </div>
        )}
      </div>

      {/* Decorative Elements for Root */}
      {isRoot && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg animate-pulse"></div>
      )}
    </div>
  );
};

export default TreeNode;