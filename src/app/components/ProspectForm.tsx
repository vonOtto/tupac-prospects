"use client";

import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';

interface ProspectFormProps {
  onClose: () => void;
}

const ProspectForm: React.FC<ProspectFormProps> = ({ onClose }) => {
  const [company, setCompany] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [firstContactDate, setFirstContactDate] = useState('');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'prospects'), {
        company,
        contactPerson,
        phone,
        email,
        firstContactDate,
        comment,
        status,
      });

      // Clear form
      setCompany('');
      setContactPerson('');
      setPhone('');
      setEmail('');
      setFirstContactDate('');
      setComment('');
      setStatus('');

      setLoading(false);
      onClose();
    } catch (error) {
      console.error('Error adding document: ', error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-800 rounded">
      <h2 className="text-2xl mb-4 text-white">Add New Prospect</h2>
      <div className="mb-4">
        <label className="block text-white mb-2">Company</label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400"
          disabled={loading}
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Contact Person</label>
        <input
          type="text"
          value={contactPerson}
          onChange={(e) => setContactPerson(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400"
          disabled={loading}
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400"
          disabled={loading}
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400"
          disabled={loading}
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">First Contact Date</label>
        <input
          type="date"
          value={firstContactDate}
          onChange={(e) => setFirstContactDate(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400"
          disabled={loading}
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400"
          disabled={loading}
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Status</label>
        <input
          type="text"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400"
          disabled={loading}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="bg-red-500 text-white p-2 rounded mr-2 hover:bg-red-700"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-green-500 p-2 rounded text-white hover:bg-green-700"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Prospect'}
        </button>
      </div>
    </form>
  );
};

export default ProspectForm;
