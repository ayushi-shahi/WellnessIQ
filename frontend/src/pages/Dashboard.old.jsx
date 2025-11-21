import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyticsAPI } from '../utils/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [progressData, setProgressData] = useState(null);
  const [wellnessScore, setWellnessScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [progressRes, scoreRes] = await Promise.all([
        analyticsAPI.getProgress(30),
        analyticsAPI.getWellnessScore().catch(() => null)
      ]);
      setProgressData(progressRes.data.data);
      if (scoreRes) setWellnessScore(scoreRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      
      {wellnessScore && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Wellness Score</h2>
          <div className="text-5xl font-bold text-primary mb-4">
            {wellnessScore.score}/100
          </div>
          <div className="space-y-2">
            {wellnessScore.recommendations?.map((rec, idx) => (
              <p key={idx} className="text-gray-600">{rec}</p>
            ))}
          </div>
        </div>
      )}
      
      {progressData?.daily_data && progressData.daily_data.length > 0 ? (
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Sleep Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData.daily_data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sleep_hours" stroke="#3B82F6" name="Sleep (hours)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Activity Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressData.daily_data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="steps" fill="#10B981" name="Steps" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <p className="text-gray-600">No data yet. Start logging your wellness data!</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
