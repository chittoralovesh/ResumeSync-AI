import React from 'react';

const Badge = ({ text, color = 'bg-blue-500', textColor = 'text-white' }) => {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full ${color} ${textColor} text-sm font-medium`}>
      {text}
    </span>
  );
};

export default Badge;