// page.tsx
"use client";


import React, { Suspense } from 'react';
import ProspectList from './components/ProspectList';

const HomePage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProspectList />
    </Suspense>
  );
};

export default HomePage;
