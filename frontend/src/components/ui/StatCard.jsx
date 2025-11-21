import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = 'primary',
  subtitle 
}) => {
  const colors = {
    primary: 'bg-primary-50 text-primary-600',
    secondary: 'bg-secondary-50 text-secondary-600',
    accent: 'bg-accent-50 text-accent-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl p-6 shadow-card hover:shadow-hover transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${trend === 'up' ? 'text-secondary-600' : 'text-red-600'}`}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </span>
              <span className="text-xs text-gray-500 ml-2">vs last week</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${colors[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
