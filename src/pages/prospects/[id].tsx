

// pages/prospects/[id].tsx
"use client";

import React, { Suspense } from 'react';
import ProspectDetail from '../../app/components/ProspectDetail';

const ProspectPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProspectDetail />
    </Suspense>
  );
};

export default ProspectPage;
