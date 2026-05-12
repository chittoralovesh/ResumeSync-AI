import React from 'react';
import { useState } from 'react';
import ResumeUploader from '../components/widgets/ResumeUploader';
import ScoreMeter from '../components/widgets/ScoreMeter';
import RecommendationCard from '../components/widgets/RecommendationCard';
import { motion } from 'framer-motion';

const Upload = () => {
  const [resumeData, setResumeData] = useState(null);
  const [score, setScore] = useState(0);
  const [recommendations, setRecommendations] = useState([]);

  const handleUpload = (data) => {
    setResumeData(data);
    // Simulate score calculation and recommendations
    setScore(Math.floor(Math.random() * 100));
    setRecommendations([
      { id: 1, text: 'Add more keywords related to your industry.' },
      { id: 2, text: 'Consider using a more modern format.' },
    ]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center p-6 bg-gray-900 min-h-screen"
    >
      <h1 className="text-4xl font-bold text-white mb-6">Upload Your Resume</h1>
      <ResumeUploader onUpload={handleUpload} />
      {resumeData && (
        <div className="mt-6 w-full max-w-md">
          <ScoreMeter score={score} />
          {recommendations.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec.text} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Upload;