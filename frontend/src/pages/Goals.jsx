import React, { useState, useEffect } from 'react';
import { goalAPI } from '../utils/api';
import { toast } from 'react-toastify';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    goal_type: '',
    target_value: '',
    deadline: ''
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await goalAPI.getAll();
      setGoals(response.data);
    } catch (error) {
      toast.error('Failed to load goals');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await goalAPI.create({
        ...formData,
        target_value: parseFloat(formData.target_value)
      });
      toast.success('Goal created!');
      fetchGoals();
      setShowForm(false);
      setFormData({ goal_type: '', target_value: '', deadline: '' });
    } catch (error) {
      toast.error('Failed to create goal');
    }
  };

  const calculateProgress = (goal) => {
    return Math.min(100, (goal.current_value / goal.target_value) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Goals</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : 'Add Goal'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Goal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Goal Type</label>
              <input
                type="text"
                value={formData.goal_type}
                onChange={(e) => setFormData({ ...formData, goal_type: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Weight Loss, Sleep Improvement"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Target Value</label>
              <input
                type="number"
                step="0.1"
                value={formData.target_value}
                onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., 70 (kg), 8 (hours)"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Deadline (Optional)</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Create Goal
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">{goal.goal_type}</h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{goal.current_value} / {goal.target_value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-primary h-4 rounded-full transition-all"
                  style={{ width: `${calculateProgress(goal)}%` }}
                ></div>
              </div>
            </div>
            {goal.deadline && (
              <p className="text-sm text-gray-600">
                Deadline: {new Date(goal.deadline).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>
      
      {goals.length === 0 && !showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <p className="text-gray-600">No goals yet. Create your first goal!</p>
        </div>
      )}
    </div>
  );
};

export default Goals;
