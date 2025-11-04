import React, { useState, useEffect } from 'react';
import { trackerAPI } from '../utils/api';
import { toast } from 'react-toastify';

const Trackers = () => {
  const [trackers, setTrackers] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    steps: '',
    calories: '',
    sleep_hours: '',
    mood_score: '',
    stress_level: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrackers();
  }, []);

  const fetchTrackers = async () => {
    try {
      const response = await trackerAPI.getAll();
      setTrackers(response.data);
    } catch (error) {
      toast.error('Failed to load trackers');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await trackerAPI.create({
        ...formData,
        steps: formData.steps ? parseInt(formData.steps) : null,
        calories: formData.calories ? parseInt(formData.calories) : null,
        sleep_hours: formData.sleep_hours ? parseFloat(formData.sleep_hours) : null,
        mood_score: formData.mood_score ? parseInt(formData.mood_score) : null,
        stress_level: formData.stress_level ? parseInt(formData.stress_level) : null,
      });
      toast.success('Tracker entry created!');
      fetchTrackers();
      setFormData({
        date: new Date().toISOString().split('T')[0],
        steps: '',
        calories: '',
        sleep_hours: '',
        mood_score: '',
        stress_level: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create tracker');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Daily Trackers</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Log Today's Data</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Steps</label>
            <input
              type="number"
              value={formData.steps}
              onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="10000"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Calories</label>
            <input
              type="number"
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="2000"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Sleep Hours</label>
            <input
              type="number"
              step="0.5"
              value={formData.sleep_hours}
              onChange={(e) => setFormData({ ...formData, sleep_hours: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="8"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Mood Score (1-10)</label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.mood_score}
              onChange={(e) => setFormData({ ...formData, mood_score: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="7"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Stress Level (1-10)</label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.stress_level}
              onChange={(e) => setFormData({ ...formData, stress_level: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="5"
            />
          </div>
          
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
            >
              {loading ? 'Saving...' : 'Log Entry'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Steps</th>
                <th className="px-4 py-2 text-left">Calories</th>
                <th className="px-4 py-2 text-left">Sleep</th>
                <th className="px-4 py-2 text-left">Mood</th>
                <th className="px-4 py-2 text-left">Stress</th>
              </tr>
            </thead>
            <tbody>
              {trackers.map((tracker) => (
                <tr key={tracker.id} className="border-t">
                  <td className="px-4 py-2">{tracker.date}</td>
                  <td className="px-4 py-2">{tracker.steps || '-'}</td>
                  <td className="px-4 py-2">{tracker.calories || '-'}</td>
                  <td className="px-4 py-2">{tracker.sleep_hours || '-'}</td>
                  <td className="px-4 py-2">{tracker.mood_score || '-'}</td>
                  <td className="px-4 py-2">{tracker.stress_level || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Trackers;
