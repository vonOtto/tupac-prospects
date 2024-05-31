"use client";

import React, { ReactNode } from 'react';


interface ModalProps {
  show: boolean;
  children: ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ show, children, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded shadow-lg w-full max-w-lg relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
