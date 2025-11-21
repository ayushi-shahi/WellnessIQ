import React from 'react';
import { motion } from 'framer-motion';

const ProgressRing = ({ 
  percentage = 0, 
  size = 120, 
  strokeWidth = 8, 
  color = '#3b82f6',
  label,
  value,
  unit
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-gray-800">{value || `${Math.round(percentage)}%`}</span>
        {(label || unit) && (
          <span className="text-xs text-gray-500 mt-1">{label || unit}</span>
        )}
      </div>
    </div>
  );
};

export default ProgressRing;
