import { useEffect } from 'react';
import { ISSDashboard } from '@/components/iss/ISSDashboard';

export default function ISSPage() {
  useEffect(() => {
    document.title = 'ISS Tracker — ISS Orbit Intelligence';
  }, []);
  return (
    <div className="p-4 md:p-6">
      <ISSDashboard />
    </div>
  );
}
