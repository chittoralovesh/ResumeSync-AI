import React from 'react';
import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { AnimatedBackground } from '../animations/AnimatedBackground';
import { useAuth } from '../hooks/useAuth';

const InterviewPrep = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    // Simulate fetching questions from an API
    setTimeout(() => {
      setQuestions([
        { id: 1, question: 'Tell me about yourself.' },
        { id: 2, question: 'What are your strengths and weaknesses?' },
        { id: 3, question: 'Why do you want to work here?' },
      ]);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <AnimatedBackground />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">Interview Preparation</h1>
        <p className="mb-4">Prepare for your upcoming interviews with our AI-powered tools.</p>
        <Button onClick={fetchQuestions} className="mb-6">
          {loading ? 'Loading...' : 'Fetch Interview Questions'}
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questions.map((q) => (
            <Card key={q.id} className="p-4 bg-gray-800 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold">{q.question}</h2>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;