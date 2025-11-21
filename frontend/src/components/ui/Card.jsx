import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -4, boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)' } : {}}
      className={`bg-white rounded-xl shadow-card p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
