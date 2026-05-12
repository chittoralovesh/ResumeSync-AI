import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { ScoreMeter } from '../components/widgets/ScoreMeter';
import { RecommendationCard } from '../components/widgets/RecommendationCard';
import { ResumeUploader } from '../components/widgets/ResumeUploader';
import { ChartCard } from '../components/analytics/ChartCard';
import { SkillRadar } from '../components/analytics/SkillRadar';
import { AnimatedBackground } from '../animations/AnimatedBackground';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <AnimatedBackground />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}</h1>
        <ResumeUploader />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <ScoreMeter />
          <ChartCard />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <SkillRadar />
          <RecommendationCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;