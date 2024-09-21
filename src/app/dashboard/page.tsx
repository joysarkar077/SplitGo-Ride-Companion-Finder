'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import the RideRequestForm component with SSR disabled
const RideRequestForm = dynamic(() => import('@/components/custionUi/RideRequestForm'), {
  ssr: false,
});

export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Component only mounts when on the client
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Render nothing during SSR
    return null;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Render the component only on the client */}
      <RideRequestForm />
    </div>
  );
}
