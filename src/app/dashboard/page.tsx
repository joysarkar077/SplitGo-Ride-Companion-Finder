'use client';
// import dynamic from 'next/dynamic';
import RideRequestForm from '@/components/custionUi/RideRequestForm';

// const Map = dynamic(() => import('@/components/custionUi/Map'), {
//   ssr: false,
// });

const Dashboard = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '40%' }}>
        <RideRequestForm />
      </div>
      <div style={{ width: '60%' }}>
        {/* <Map /> */}
      </div>
    </div>
  );
};

export default Dashboard;
