import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import React from 'react';
import 'leaflet/dist/leaflet.css';


function page() {
  return (
    <div className='mt-auto flex flex-col justify-center items-center'>
      <section className="grid grid-cols-2 gap-4 items-center justify-center m-11">
        <div className="flex flex-col gap-4 max-w-96">
          <h1 className="text-5xl font-bold leading-tight"><span className="text-white bg-purple-800 px-2 rounded">Share</span> the Ride, Split the <span className="text-white bg-purple-800 px-2 rounded">Cost!</span></h1>
          <div className='flex items-center gap-4'>
            <Image src="start.svg" alt="logo" width={20} height={20}></Image> <Input type="text" placeholder="Enter your pickup point" />
          </div>
          <div className='flex items-center gap-4'>
            <Image src="end.svg" alt="logo" width={18} height={18}></Image> <Input type="text" placeholder="Enter your pickup point" />
          </div>
          <Button className="w-1/2">Request a Ride!</Button>
        </div>
        <div>
          <Image src="/homepage/hero.png" alt="logo" width={500} height={500}></Image>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 items-center justify-center m-11 mt-2 mb-2">
        <div>
          <Image src="/homepage/networking.png" alt="logo" width={500} height={500}></Image>
        </div>
        <div className="flex flex-col gap-4 max-w-md">
          <h1 className="text-5xl font-bold leading-none"> Save your money with SplitGo.</h1>
          <div className='text-lg leading-5'>
            With SplitGo, save on every trip by sharing rides with others going your way. Choose your route, split the fare, and enjoy a smarter, more affordable way to travel—whether commuting, running errands, or heading out with friends.
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 items-center justify-center mx-11 my-0">

        <div className="flex flex-col gap-4 max-w-md">
          <h1 className="text-5xl font-bold leading-none"> Efficient Routes – Smart Planning for Faster Rides</h1>
          <div className='text-lg leading-5'>
            With SplitGo, our intelligent route planning ensures you get to your destination faster by optimizing the journey based on real-time traffic and ride-sharing opportunities. Save time while sharing the ride, making your commute both quick and hassle-free.
          </div>
        </div>
        <div>
          <Image src="/homepage/networking2.png" alt="logo" width={500} height={500}></Image>
        </div>
      </section>
    </div>
  );
}

export default page;