import React from 'react';
import { motion } from 'framer-motion';

const RecommendationCard = ({ recommendation }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <h3 className="text-xl font-semibold text-gray-800">{recommendation.title}</h3>
      <p className="mt-2 text-gray-600">{recommendation.description}</p>
      <a
        href={recommendation.link}
        className="mt-4 inline-block text-blue-500 hover:underline"
      >
        Learn More
      </a>
    </motion.div>
  );
};

export default RecommendationCard;