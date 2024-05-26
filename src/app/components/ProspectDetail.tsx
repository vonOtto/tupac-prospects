"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import useTranslation from 'next-translate/useTranslation';
import { db } from '@/firebase';

const ProspectDetail = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const [prospect, setProspect] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProspect = async () => {
      try {
        const docRef = doc(db, 'prospects', Array.isArray(id) ? id[0] : id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProspect(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching prospect:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProspect();
  }, [id]);

  const handleBackClick = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="bg-gray-900 p-6 rounded shadow-md h-full overflow-y-auto">
        <button
          className="bg-blue-500 text-white p-2 rounded shadow-lg hover:bg-blue-700 mb-4"
          onClick={handleBackClick}
        >
          {t('back')}
        </button>
        <div className="space-y-4">
          <div className="h-6 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!prospect) {
    return (
      <div className="bg-gray-900 p-6 rounded shadow-md h-full overflow-y-auto">
        <button
          className="bg-blue-500 text-white p-2 rounded shadow-lg hover:bg-blue-700 mb-4"
          onClick={handleBackClick}
        >
          {t('back')}
        </button>
        <div className="text-white">{t('Prospect not found')}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded shadow-md h-full overflow-y-auto">
      <button
        className="bg-blue-500 text-white p-2 rounded shadow-lg hover:bg-blue-700 mb-4"
        onClick={handleBackClick}
      >
        {t('back')}
      </button>
      <h1 className="text-2xl mb-4 text-white">{prospect.company}</h1>
      <p className="text-white">{t('Contact Person')}: {prospect.contactPerson}</p>
      <p className="text-white">{t('Phone')}: {prospect.phone}</p>
      <p className="text-white">{t('Email')}: {prospect.email}</p>
      <p className="text-white">{t('First Contact Date')}: {new Date(prospect.firstContactDate).toLocaleDateString()}</p>
      <p className="text-white">{t('Comment')}: {prospect.comment}</p>
      <p className="text-white">{t('Status')}: {prospect.status}</p>
    </div>
  );
};

export default ProspectDetail;
