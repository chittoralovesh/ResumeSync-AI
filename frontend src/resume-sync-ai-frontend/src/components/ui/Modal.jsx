import React from 'react';
import { motion } from 'framer-motion';

const Modal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6 z-10 max-w-md w-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>
              &times;
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Modal;