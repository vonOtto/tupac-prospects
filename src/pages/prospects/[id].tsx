"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { usePathname } from 'next/navigation';

type Prospect = {
  company: string;
  contactPerson: string;
  phone: string;
  email: string;
  firstContactDate: string;
  comment: string;
  status: string;
};

const ProspectDetails = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Current pathname:', pathname);
    if (pathname) {
      const id = pathname.split('/').pop();
      console.log('Extracted ID:', id);
      if (id) {
        const fetchProspect = async () => {
          console.log('Fetching prospect with ID:', id);
          const docRef = doc(db, 'prospects', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            console.log('Document data:', docSnap.data());
            setProspect(docSnap.data() as Prospect);
          } else {
            console.log('No such document!');
          }
          setLoading(false);
        };

        fetchProspect();
      } else {
        setLoading(false);
      }
    }
  }, [pathname]);

  if (loading) {
    console.log('Loading...');
    return <div className="text-white">Loading...</div>;
  }

  if (!prospect) {
    console.log('No prospect found');
    return <div className="text-white">No prospect found</div>;
  }

  console.log('Prospect details loaded:', prospect);

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <button
        onClick={() => {
          console.log('Navigating back to prospect list');
          router.push('/');
        }}
        className="bg-blue-500 text-white p-2 rounded mb-4 hover:bg-blue-700"
      >
        Tillbaka
      </button>
      <h2 className="text-2xl mb-4 text-white">Prospektdetaljer</h2>
      <div className="bg-gray-800 p-6 rounded shadow-md text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-bold">Företag:</p>
            <p>{prospect.company}</p>
          </div>
          <div>
            <p className="font-bold">Kontaktperson:</p>
            <p>{prospect.contactPerson}</p>
          </div>
          <div>
            <p className="font-bold">Telefon:</p>
            <p>{prospect.phone}</p>
          </div>
          <div>
            <p className="font-bold">E-post:</p>
            <p>{prospect.email}</p>
          </div>
          <div>
            <p className="font-bold">Datum för första kontakt:</p>
            <p>{new Date(prospect.firstContactDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-bold">Kommentar:</p>
            <p>{prospect.comment}</p>
          </div>
          <div>
            <p className="font-bold">Status:</p>
            <p>{prospect.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProspectDetails;
