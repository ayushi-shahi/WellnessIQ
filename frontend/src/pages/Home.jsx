import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            AI-Powered Health & Wellness Tracker
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            Track your wellness journey with AI-powered insights
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition"
            >
              Login
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">Track Your Health</h3>
            <p className="text-gray-600">
              Monitor sleep, activity, nutrition, mood, and stress levels daily.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">AI Insights</h3>
            <p className="text-gray-600">
              Get personalized recommendations powered by AI to improve your wellness.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">Set Goals</h3>
            <p className="text-gray-600">
              Create and track wellness goals with progress monitoring.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
