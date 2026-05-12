import React from 'react';
import { motion } from 'framer-motion';

const ScoreMeter = ({ score }) => {
  const scorePercentage = Math.min(Math.max(score, 0), 100); // Ensure score is between 0 and 100

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-lg">
      <h2 className="text-white text-2xl font-bold mb-2">Resume Score</h2>
      <div className="relative w-full h-6 bg-gray-300 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-green-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${scorePercentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <span className="text-white font-semibold mt-2">{scorePercentage}%</span>
    </div>
  );
};

export default ScoreMeter;