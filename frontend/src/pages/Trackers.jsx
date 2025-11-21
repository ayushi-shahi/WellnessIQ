import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { trackerAPI } from '../utils/api';
import { Card, Button, Input, Modal } from '../components/ui';

const Trackers = () => {
  const [trackers, setTrackers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    steps: '',
    calories: '',
    sleep_hours: '',
    mood_score: '',
    stress_level: '',
    water_intake: '',
    exercise_minutes: ''
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
        water_intake: formData.water_intake ? parseFloat(formData.water_intake) : null,
        exercise_minutes: formData.exercise_minutes ? parseInt(formData.exercise_minutes) : null,
      });
      toast.success('Entry added successfully!');
      fetchTrackers();
      setShowModal(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        steps: '',
        calories: '',
        sleep_hours: '',
        mood_score: '',
        stress_level: '',
        water_intake: '',
        exercise_minutes: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    
    try {
      await trackerAPI.delete(id);
      toast.success('Entry deleted');
      fetchTrackers();
    } catch (error) {
      toast.error('Failed to delete entry');
    }
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Health Trackers</h1>
            <p className="text-gray-600">Log and monitor your daily health metrics</p>
          </div>
          
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Add Entry
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trackers.map((tracker, index) => (
            <motion.div
              key={tracker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover className="relative">
                <button
                  onClick={() => handleDelete(tracker.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-lg font-semibold text-gray-900">{tracker.date}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {tracker.steps && (
                    <div>
                      <p className="text-xs text-gray-500">Steps</p>
                      <p className="text-md font-bold text-primary-600">{tracker.steps.toLocaleString()}</p>
                    </div>
                  )}
                  {tracker.calories && (
                    <div>
                      <p className="text-xs text-gray-500">Calories</p>
                      <p className="text-md font-bold text-accent-600">{tracker.calories}</p>
                    </div>
                  )}
                  {tracker.sleep_hours && (
                    <div>
                      <p className="text-xs text-gray-500">Sleep</p>
                      <p className="text-md font-bold text-purple-600">{tracker.sleep_hours}h</p>
                    </div>
                  )}
                  {tracker.mood_score && (
                    <div>
                      <p className="text-xs text-gray-500">Mood</p>
                      <p className="text-md font-bold text-secondary-600">{tracker.mood_score}/10</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
          
          {trackers.length === 0 && (
            <div className="col-span-full">
              <Card className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 mb-4">No entries yet. Start tracking your health!</p>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                  Add First Entry
                </Button>
              </Card>
            </div>
          )}
        </div>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Health Entry" size="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="date"
              label="Date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                label="Steps"
                placeholder="10000"
                value={formData.steps}
                onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
              />
              <Input
                type="number"
                label="Calories Burned"
                placeholder="2000"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
              />
              <Input
                type="number"
                step="0.5"
                label="Sleep Hours"
                placeholder="8"
                value={formData.sleep_hours}
                onChange={(e) => setFormData({ ...formData, sleep_hours: e.target.value })}
              />
              <Input
                type="number"
                step="0.1"
                label="Water Intake (L)"
                placeholder="2.5"
                value={formData.water_intake}
                onChange={(e) => setFormData({ ...formData, water_intake: e.target.value })}
              />
              <Input
                type="number"
                label="Exercise (minutes)"
                placeholder="30"
                value={formData.exercise_minutes}
                onChange={(e) => setFormData({ ...formData, exercise_minutes: e.target.value })}
              />
              <Input
                type="number"
                min="1"
                max="10"
                label="Mood (1-10)"
                placeholder="7"
                value={formData.mood_score}
                onChange={(e) => setFormData({ ...formData, mood_score: e.target.value })}
              />
            </div>

            <div className="flex space-x-4">
              <Button type="submit" variant="primary" size="lg" className="flex-1" loading={loading}>
                Save Entry
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

export default Trackers;
