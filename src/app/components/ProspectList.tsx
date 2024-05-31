import React, { useState, useEffect, useRef, Suspense } from 'react';
import { db } from '@/firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FaPlus, FaSort, FaSortUp, FaSortDown, FaArchive, FaTrash } from 'react-icons/fa';
import Modal from './Modal';
import ProspectForm from './ProspectForm';
import StatusDropdown from './StatusDropdown';
import withTranslation from '@/app/withTranslation';

type Prospect = {
  id: string;
  company: string;
  contactPerson: string;
  firstContactDate: string;
  comment: string;
  status: string;
  archived?: boolean;
};

type ProspectListProps = {
  t: (key: string) => string;
};

const ProspectList: React.FC<ProspectListProps> = ({ t }) => {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [prospectToArchive, setProspectToArchive] = useState<Prospect | null>(null);
  const [prospectToDelete, setProspectToDelete] = useState<Prospect | null>(null);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({
    company: '',
    contactPerson: '',
    status: '',
  });
  const [sortConfig, setSortConfig] = useState<{ key: keyof Prospect | '', direction: 'ascending' | 'descending' }>({ key: '', direction: 'ascending' });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'prospects'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Prospect[];
      setProspects(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleOpenModal = () => {
    console.log("Opening modal...");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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

  const handleArchiveClick = (prospect: Prospect, event: React.MouseEvent) => {
    event.stopPropagation();
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

  const handleDeleteClick = (prospect: Prospect, event: React.MouseEvent) => {
    event.stopPropagation();
    setProspectToDelete(prospect);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!prospectToDelete) return;
    const prospectRef = doc(db, 'prospects', prospectToDelete.id);
    await deleteDoc(prospectRef);
    setShowDeleteModal(false);
    setProspectToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setProspectToDelete(null);
  };

  const handleStatusClick = (prospect: Prospect, event: React.MouseEvent, element: HTMLTableCellElement) => {
    event.stopPropagation();
    setSelectedProspect(prospect);
    setIsDropdownOpen(true);
    const rect = element.getBoundingClientRect();
    setDropdownPosition({ top: rect.bottom, left: rect.left });
  };

  const handleStatusChange = async (newStatus: string) => {
    if (selectedProspect) {
      const prospectRef = doc(db, 'prospects', selectedProspect.id);
      await updateDoc(prospectRef, { status: newStatus });
      setIsDropdownOpen(false);
      setSelectedProspect(null);
    }
  };

  const isDate = (value: any): value is Date => {
    return value instanceof Date;
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

      if (isDate(aValue) && isDate(bValue)) {
        return sortConfig.direction === 'ascending'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
      }

      return 0;
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

  const handleRowClick = (id: string) => {
    window.location.href = `/prospects/${id}`;
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
      <Suspense fallback={<div>Loading...</div>}>
        <table className="min-w-full bg-gray-800 text-white rounded">
          <thead>
            <tr>
              {['company', 'contactPerson', 'firstContactDate', 'status', 'comment'].map((key) => (
                <th key={key} className="py-2 px-4 border-b border-gray-600">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort(key as keyof Prospect)}>
                    {t(key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim())} {getSortIcon(key as keyof Prospect)}
                  </div>
                </th>
              ))}
              <th className="py-2 px-4 border-b border-gray-600">{t('Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredProspects.map((prospect, index) => (
              <tr
                key={prospect.id}
                className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'} cursor-pointer`}
                onClick={() => handleRowClick(prospect.id)}
              >
                <td className="py-2 px-4 border-b border-gray-600">{prospect.company}</td>
                <td className="py-2 px-4 border-b border-gray-600">{prospect.contactPerson}</td>
                <td className="py-2 px-4 border-b border-gray-600">{prospect.firstContactDate}</td>
                <td 
                  className="py-2 px-4 border-b border-gray-600 relative" 
                  onClick={(e) => handleStatusClick(prospect, e, e.currentTarget)}
                >
                  {prospect.status}
                </td>
                <td className="py-2 px-4 border-b border-gray-600">{prospect.comment}</td>
                <td className="py-2 px-4 border-b border-gray-600">
                  <div className="flex justify-center items-center space-x-2">
                    <FaArchive
                      className="cursor-pointer"
                      onClick={(event) => handleArchiveClick(prospect, event)}
                    />
                    <FaTrash
                      className="cursor-pointer"
                      onClick={(event) => handleDeleteClick(prospect, event)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Suspense>

      {/* Add Prospect Modal */}
      <Modal show={showModal} onClose={handleCloseModal}>
        <ProspectForm onClose={handleCloseModal} />
      </Modal>

      {/* Confirm Archive Modal */}
      {showConfirmModal && (
        <Modal show={showConfirmModal} onClose={handleArchiveCancel}>
          <h2 className="text-lg mb-4">{t('Are you sure you want to archive this prospect?')}</h2>
          <div className="flex justify-end space-x-4">
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded"
              onClick={handleArchiveCancel}
            >
              {t('No')}
            </button>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={handleArchiveConfirm}
            >
              {t('Yes')}
            </button>
          </div>
        </Modal>
      )}

      {/* Confirm Delete Modal */}
      {showDeleteModal && (
        <Modal show={showDeleteModal} onClose={handleDeleteCancel}>
          <h2 className="text-lg mb-4">{t('Are you sure you want to delete this prospect?')}</h2>
          <div className="flex justify-end space-x-4">
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded"
              onClick={handleDeleteCancel}
            >
              {t('No')}
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded"
              onClick={handleDeleteConfirm}
            >
              {t('Yes')}
            </button>
          </div>
        </Modal>
      )}

      {/* Status Dropdown */}
      {isDropdownOpen && selectedProspect && (
        <StatusDropdown
          onSelectStatus={handleStatusChange}
          onClose={() => setIsDropdownOpen(false)}
          position={dropdownPosition}
        />
      )}
    </div>
  );
};

export default withTranslation(ProspectList);
