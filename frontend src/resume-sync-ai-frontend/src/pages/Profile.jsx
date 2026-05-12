import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">User Profile</h1>
      <Card className="p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Welcome, {user.name}</h2>
        <p className="mb-2">Email: {user.email}</p>
        <p className="mb-4">Role: {user.role}</p>
        <Button onClick={logout} className="mt-4 bg-red-600 hover:bg-red-700">
          Logout
        </Button>
      </Card>
    </div>
  );
};

export default Profile;