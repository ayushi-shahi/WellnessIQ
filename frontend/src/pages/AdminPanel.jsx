import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../utils/api';
import { toast } from 'react-toastify';

const AdminPanel = () => {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await analyticsAPI.getAllUsersAnalytics();
      setUsersData(response.data.data);
    } catch (error) {
      toast.error('Failed to load admin data. You may not have admin access.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Panel</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">All Users Analytics</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Entries</th>
                <th className="px-4 py-2 text-left">Last Logged</th>
                <th className="px-4 py-2 text-left">Avg Sleep</th>
                <th className="px-4 py-2 text-left">Avg Steps</th>
                <th className="px-4 py-2 text-left">Avg Mood</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((user) => (
                <tr key={user.user_id} className="border-t">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.total_entries}</td>
                  <td className="px-4 py-2">{user.last_logged || 'Never'}</td>
                  <td className="px-4 py-2">{user.avg_sleep}h</td>
                  <td className="px-4 py-2">{user.avg_steps}</td>
                  <td className="px-4 py-2">{user.avg_mood}/10</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {usersData.length === 0 && (
          <p className="text-center text-gray-600 py-8">No users found</p>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
