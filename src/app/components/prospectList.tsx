"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useTranslation from 'next-translate/useTranslation';
import { db } from '@/firebase'; // Rätt import
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { FaPlus, FaSort, FaSortUp, FaSortDown, FaArchive } from 'react-icons/fa';
import Modal from './Modal';
import ProspectForm from './ProspectForm';
import ProspectDetails from './ProspectDetails'; // Importera ProspectDetails

type Prospect = {
  id: string;
  company: string;
  contactPerson: string;
  phone: string;
  email: string;
  firstContactDate: string;
  comment: string;
  status: string;
  archived?: boolean;
};

const ProspectList = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false); // State för detaljvyn
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null); // Vald prospekt
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [prospectToArchive, setProspectToArchive] = useState<Prospect | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({
    company: '',
    contactPerson: '',
    status: '',
  });
  const [sortConfig, setSortConfig] = useState<{ key: keyof Prospect | '', direction: 'ascending' | 'descending' }>({ key: '', direction: 'ascending' });

  useEffect(() => {
    console.log('Subscribing to prospects collection');
    const unsubscribe = onSnapshot(collection(db, 'prospects'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Prospect[];
      console.log('Prospects data:', data);
      setProspects(data);
    });

    return () => {
      console.log('Unsubscribing from prospects collection');
      unsubscribe();
    };
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenDetailsModal = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedProspect(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value,
    });
  };

  const handleSort = (key: keyof Prospect) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleArchiveClick = (prospect: Prospect) => {
    setProspectToArchive(prospect);
    setShowConfirmModal(true);
  };

  const handleArchiveConfirm = async () => {
    if (!prospectToArchive) return;
    const prospectRef = doc(db, 'prospects', prospectToArchive.id);
    await updateDoc(prospectRef, {
      archived: true
    });
    setShowConfirmModal(false);
    setProspectToArchive(null);
  };

  const handleArchiveCancel = () => {
    setShowConfirmModal(false);
    setProspectToArchive(null);
  };

  const sortedProspects = [...prospects].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'ascending'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortConfig.direction === 'ascending'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      return sortConfig.direction === 'ascending' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue);
    }

    return 0;
  });

  const filteredProspects = sortedProspects.filter((prospect) =>
    !prospect.archived &&
    (prospect.company.toLowerCase().includes(search.toLowerCase()) ||
      prospect.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      prospect.status.toLowerCase().includes(search.toLowerCase())) &&
    prospect.company.toLowerCase().includes(filter.company.toLowerCase()) &&
    prospect.contactPerson.toLowerCase().includes(filter.contactPerson.toLowerCase()) &&
    prospect.status.toLowerCase().includes(filter.status.toLowerCase())
  );

  const getSortIcon = (key: keyof Prospect) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        return <FaSortUp className="ml-1" />;
      } else {
        return <FaSortDown className="ml-1" />;
      }
    } else {
      return <FaSort className="ml-1" />;
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded shadow-md h-full overflow-y-auto relative">
      <h2 className="text-2xl mb-4 text-white">{t('Prospect List')}</h2>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder={t('Search...')}
          value={search}
          onChange={handleSearchChange}
          className="p-2 rounded bg-gray-700 text-white"
        />
        <button
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
          onClick={handleOpenModal}
        >
          <FaPlus />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          name="company"
          placeholder={t('Filter by Company')}
          value={filter.company}
          onChange={handleFilterChange}
          className="p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          name="contactPerson"
          placeholder={t('Filter by Contact Person')}
          value={filter.contactPerson}
          onChange={handleFilterChange}
          className="p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          name="status"
          placeholder={t('Filter by Status')}
          value={filter.status}
          onChange={handleFilterChange}
          className="p-2 rounded bg-gray-700 text-white"
        />
      </div>
      <table className="min-w-full bg-gray-800 text-white rounded">
        <thead>
          <tr>
            {['company', 'contactPerson', 'phone', 'email', 'firstContactDate', 'comment', 'status', ''].map((key) => (
              key ? (
                <th key={key} className="py-2 px-4 border-b border-gray-600">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort(key as keyof Prospect)}>
                    {t(key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim())} {getSortIcon(key as keyof Prospect)}
                  </div>
                </th>
              ) : <th key={key} className="py-2 px-4 border-b border-gray-600"></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredProspects.map((prospect, index) => (
            <tr
              key={prospect.id}
              className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'} cursor-pointer`}
              onClick={() => router.push(`/prospects/${prospect.id}`)}
            >
              <td className="py-2 px-4 border-b border-gray-600">{prospect.company}</td>
              <td className="py-2 px-4 border-b border-gray-600">{prospect.contactPerson}</td>
              <td className="py-2 px-4 border-b border-gray-600">{prospect.phone}</td>
              <td className="py-2 px-4 border-b border-gray-600">{prospect.email}</td>
              <td className="py-2 px-4 border-b border-gray-600">{new Date(prospect.firstContactDate).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b border-gray-600">{prospect.comment}</td>
              <td className="py-2 px-4 border-b border-gray-600">{prospect.status}</td>
              <td className="py-2 px-4 border-b border-gray-600 text-center">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArchiveClick(prospect);
                  }}
                >
                  <FaArchive />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={showModal} onClose={handleCloseModal}>
        <ProspectForm onClose={handleCloseModal} />
      </Modal>
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-full max-w-lg relative">
            <h2 className="text-2xl mb-4 text-white">Är du säker på att du vill arkivera det här prospektet?</h2>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white p-2 rounded mr-2 hover:bg-red-700"
                onClick={handleArchiveCancel}
              >
                Nej
              </button>
              <button
                className="bg-green-500 p-2 rounded text-white hover:bg-green-700"
                onClick={handleArchiveConfirm}
              >
                Ja
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProspectList;
