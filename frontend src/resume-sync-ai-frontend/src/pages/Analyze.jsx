import React from 'react';
import { useEffect } from 'react';
import AnimatedBackground from '../animations/AnimatedBackground';
import ResumeUploader from '../components/widgets/ResumeUploader';
import ScoreMeter from '../components/widgets/ScoreMeter';
import RecommendationCard from '../components/widgets/RecommendationCard';
import { useAuth } from '../hooks/useAuth';

const Analyze = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Fetch analysis data when the component mounts
    // This could be an API call to get analysis results based on the user's uploaded resume
  }, [user]);

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <AnimatedBackground />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">Resume Analysis</h1>
        <ResumeUploader />
        <ScoreMeter />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RecommendationCard />
          <RecommendationCard />
        </div>
      </div>
    </div>
  );
};

export default Analyze;