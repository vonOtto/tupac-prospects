import React, { useState, useEffect, useRef } from 'react';

interface StatusDropdownProps {
  onSelectStatus: (status: string) => void;
  onClose: () => void;
  position: { top: number, left: number }; // Lägg till position props
}

const initialStatuses = [
  'Lead', 'Proposal/Tender', 'Won Contracts', 'Negotiation',
  'Contact Made', 'Meeting/Presentation', 'Lost Contracts'
];

const StatusDropdown: React.FC<StatusDropdownProps> = ({ onSelectStatus, onClose, position }) => {
  const [statuses, setStatuses] = useState(initialStatuses);
  const [newStatus, setNewStatus] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef, onClose]);

  const handleAddStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStatus && !statuses.includes(newStatus)) {
      setStatuses([...statuses, newStatus]);
      setNewStatus('');
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute bg-white p-6 rounded shadow-lg w-full max-w-md z-50 border border-gray-300"
      style={{ top: position.top, left: position.left }}
    >
      <div className="absolute top-[-10px] left-[20px] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-white"></div>
      <h3 className="text-gray-700 mb-4">Select Stage</h3>
      <ul className="text-gray-700 mb-4">
        {statuses.map((status) => (
          <li
            key={status}
            className="cursor-pointer py-1 px-2 hover:bg-gray-100 rounded"
            onClick={() => {
              onSelectStatus(status);
              onClose();
            }}
          >
            {status}
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddStatus} className="mt-4 flex items-center">
        <input
          type="text"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          placeholder="Add new status"
          className="p-2 rounded border border-gray-300 flex-grow text-gray-900"
        />
        <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">Create</button>
      </form>
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
        &times;
      </button>
    </div>
  );
};

export default StatusDropdown;

