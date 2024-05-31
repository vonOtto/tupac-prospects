import { Suspense } from 'react';
import ProspectDetail from './ProspectDetail'; // Assuming this component uses useRouter or useSearchParams

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProspectDetail />
    </Suspense>
  );
}