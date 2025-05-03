import React from "react";

const DashboardCard = ({ 
  title, 
  icon, 
  iconColor = "text-blue-600", 
  children 
}) => {
  return (
    <div className="overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 h-full">
      <div className="p-6">
        <div className={`flex items-center gap-2 text-lg font-semibold mb-4 ${iconColor}`}>
          {icon}
          {title}
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;