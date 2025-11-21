import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { goalAPI } from '../utils/api';
import { Card, Button, Input, Modal, ProgressBar } from '../components/ui';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
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
      setShowModal(false);
      setFormData({ goal_type: '', target_value: '', deadline: '' });
    } catch (error) {
      toast.error('Failed to create goal');
    }
  };

  const calculateProgress = (goal) => {
    return Math.min(100, (goal.current_value / goal.target_value) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Goals</h1>
            <p className="text-gray-600">Track your wellness goals and progress</p>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add Goal
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{goal.goal_type}</h3>
                    {goal.deadline && (
                      <p className="text-sm text-gray-500">Deadline: {goal.deadline}</p>
                    )}
                  </div>
                  <div className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    {Math.round(calculateProgress(goal))}%
                  </div>
                </div>
                
                <ProgressBar
                  percentage={calculateProgress(goal)}
                  color="primary"
                  showLabel={false}
                />
                
                <div className="mt-4 flex justify-between text-sm">
                  <span className="text-gray-600">Current: {goal.current_value}</span>
                  <span className="font-semibold text-gray-900">Target: {goal.target_value}</span>
                </div>
              </Card>
            </motion.div>
          ))}
          
          {goals.length === 0 && (
            <div className="col-span-full">
              <Card className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <p className="text-gray-600 mb-4">No goals yet. Set your first wellness goal!</p>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                  Create First Goal
                </Button>
              </Card>
            </div>
          )}
        </div>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Goal">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              label="Goal Type"
              placeholder="e.g., Weight Loss, Daily Steps, Sleep Hours"
              value={formData.goal_type}
              onChange={(e) => setFormData({ ...formData, goal_type: e.target.value })}
              required
            />
            
            <Input
              type="number"
              step="0.1"
              label="Target Value"
              placeholder="e.g., 70 (kg), 10000 (steps)"
              value={formData.target_value}
              onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
              required
            />
            
            <Input
              type="date"
              label="Deadline (Optional)"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
            
            <div className="flex space-x-4">
              <Button type="submit" variant="primary" size="lg" className="flex-1">
                Create Goal
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Goals;
