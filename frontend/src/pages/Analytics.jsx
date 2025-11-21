import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';
import { analyticsAPI } from '../utils/api';
import { Card } from '../components/ui';

const Analytics = () => {
  const [progressData, setProgressData] = useState(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsAPI.getProgress(days);
      setProgressData(response.data.data);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const activityDistribution = [
    { name: 'Active', value: 60, color: '#22c55e' },
    { name: 'Moderate', value: 25, color: '#f97316' },
    { name: 'Rest', value: 15, color: '#3b82f6' },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const dailyData = progressData?.daily_data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">Detailed insights into your wellness journey</p>
          </div>
          
          <select 
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Activity Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px' 
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="steps" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Steps" />
                <Line type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} name="Calories" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Sleep Quality</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px' 
                  }}
                />
                <Bar dataKey="sleep_hours" fill="#a855f7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Activity Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={activityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {activityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {activityDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Wellness Metrics Comparison</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyData.slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px' 
                  }}
                />
                <Legend />
                <Bar dataKey="mood_score" fill="#22c55e" name="Mood" />
                <Bar dataKey="stress_level" fill="#ef4444" name="Stress" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
