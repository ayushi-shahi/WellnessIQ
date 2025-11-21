import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';
import { analyticsAPI, trackerAPI } from '../utils/api';
import { Card, StatCard, ProgressRing } from '../components/ui';

const Dashboard = () => {
  const [progressData, setProgressData] = useState(null);
  const [wellnessScore, setWellnessScore] = useState(null);
  const [todayStats, setTodayStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [progressRes, scoreRes, trackersRes] = await Promise.all([
        analyticsAPI.getProgress(7),
        analyticsAPI.getWellnessScore().catch(() => null),
        trackerAPI.getAll({ limit: 1 }).catch(() => null)
      ]);
      
      setProgressData(progressRes.data.data);
      if (scoreRes) setWellnessScore(scoreRes.data);
      
      if (trackersRes?.data?.length > 0) {
        const latest = trackersRes.data[0];
        setTodayStats({
          steps: latest.steps || 0,
          calories: latest.calories || 0,
          sleep: latest.sleep_hours || 0,
          water: latest.water_intake || 0,
        });
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse-slow">
          <div className="w-16 h-16 bg-primary-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  const weeklyData = progressData?.daily_data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-600">Here's your wellness summary for today</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Steps"
            value={todayStats?.steps?.toLocaleString() || '0'}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            color="primary"
            subtitle="Daily goal: 10,000"
            trend="up"
            trendValue="+12%"
          />
          
          <StatCard
            title="Calories"
            value={todayStats?.calories?.toLocaleString() || '0'}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            }
            color="accent"
            subtitle="Burned today"
          />
          
          <StatCard
            title="Sleep"
            value={`${todayStats?.sleep || '0'}h`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            }
            color="purple"
            subtitle="Goal: 8h"
          />
          
          <StatCard
            title="Water"
            value={`${todayStats?.water || '0'}L`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            color="secondary"
            subtitle="Goal: 2.5L"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Weekly Activity</h2>
              <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
            
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
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
                  <Bar dataKey="steps" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No activity data yet
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Today's Progress</h2>
            
            <div className="flex justify-center mb-6">
              <ProgressRing
                percentage={wellnessScore?.score || 0}
                size={140}
                strokeWidth={10}
                color="#3b82f6"
                label="Wellness Score"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Steps</span>
                  <span className="font-semibold">{((todayStats?.steps || 0) / 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((todayStats?.steps || 0) / 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Sleep</span>
                  <span className="font-semibold">{((todayStats?.sleep || 0) / 8 * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-purple-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((todayStats?.sleep || 0) / 8 * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Water</span>
                  <span className="font-semibold">{((todayStats?.water || 0) / 2.5 * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-secondary-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((todayStats?.water || 0) / 2.5 * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Sleep Trends</h2>
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weeklyData}>
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
                  <Line 
                    type="monotone" 
                    dataKey="sleep_hours" 
                    stroke="#a855f7" 
                    strokeWidth={3}
                    dot={{ fill: '#a855f7', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No sleep data yet
              </div>
            )}
          </Card>

          {wellnessScore && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Recommendations</h2>
              <div className="space-y-3">
                {wellnessScore.recommendations?.map((rec, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start space-x-3 p-3 bg-primary-50 rounded-lg"
                  >
                    <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-gray-700">{rec}</p>
                  </motion.div>
                ))}
                {(!wellnessScore.recommendations || wellnessScore.recommendations.length === 0) && (
                  <p className="text-gray-500 text-center py-4">Keep logging your data for personalized recommendations!</p>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
