'use client';
// import dynamic from 'next/dynamic';
import RideRequestForm from '@/components/custionUi/RideRequestForm';

// const Map = dynamic(() => import('@/components/custionUi/Map'), {
//   ssr: false,
// });

const Dashboard = () => {
  return (
    <div className='w-full'>
      <RideRequestForm />

    </div>
  );
};

export default Dashboard;
