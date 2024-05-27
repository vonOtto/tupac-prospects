// page.tsx
"use client";

import React, { Suspense } from 'react';
import ProspectList from './components/ProspectList';

export default function Home() {
  return (
    <div className="h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <ProspectList />
      </Suspense>
    </div>
  );
}

