"use client";

import '../app/globals.css';
import { AppProps } from 'next/app';
import { Suspense } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...pageProps} />
    </Suspense>
  );
}

export default MyApp;
