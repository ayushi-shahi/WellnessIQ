import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ 
  percentage = 0, 
  color = 'primary', 
  height = 'md',
  showLabel = true,
  label
}) => {
  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const colors = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    accent: 'bg-accent-600',
    purple: 'bg-purple-600',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-semibold text-gray-900">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heights[height]}`}>
        <motion.div
          className={`${heights[height]} ${colors[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
