import React from 'react';
import { Radar } from 'react-chartjs-2';
import 'chart.js/auto';

const SkillRadar = ({ skills }) => {
  const data = {
    labels: skills.map(skill => skill.name),
    datasets: [
      {
        label: 'Skill Level',
        data: skills.map(skill => skill.level),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    scale: {
      ticks: {
        beginAtZero: true,
        max: 10,
        stepSize: 1,
        fontColor: '#ffffff',
      },
      gridLines: {
        color: 'rgba(255, 255, 255, 0.2)',
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
        },
      },
    },
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Skill Radar</h2>
      <Radar data={data} options={options} />
    </div>
  );
};

export default SkillRadar;