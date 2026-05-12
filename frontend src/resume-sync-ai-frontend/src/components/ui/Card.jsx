import React from 'react';

const Card = ({ title, content, image, className }) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 ${className}`}>
      {image && <img src={image} alt={title} className="w-full h-32 object-cover rounded-t-lg" />}
      <h3 className="text-xl font-semibold text-gray-800 mt-4">{title}</h3>
      <p className="text-gray-600 mt-2">{content}</p>
    </div>
  );
};

export default Card;