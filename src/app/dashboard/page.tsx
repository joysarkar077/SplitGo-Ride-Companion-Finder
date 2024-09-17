// dashboard/page.js
'use client';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/custionUi/Map'), {
  ssr: false, // This will disable server-side rendering for the Map component
});

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <Map />
    </div>
  );
};

export default Dashboard;
