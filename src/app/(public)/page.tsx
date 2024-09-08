import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import React from 'react';

const page = () => {
  return (
    <div className='mt-auto flex flex-col justify-center items-center'>
      <section className="grid grid-cols-2 gap-4 items-center justify-center m-11">
        <div className="flex flex-col gap-4 max-w-96">
          <h1 className="text-5xl font-bold"><span className="text-white bg-purple-800 px-2 rounded">Share</span> the Ride, Split the <span className="text-white bg-purple-800 px-2 rounded">Cost</span></h1>
          <Input type="text" placeholder="Enter your pickup point" />
          <Input type="text" placeholder="Enter your destination" />
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
        <div className="flex flex-col gap-4 max-w-96">
          {/* <h1 className="text-5xl font-bold"><span className="text-white bg-purple-800 px-2 rounded">Share</span> the Ride, Split the <span className="text-white bg-purple-800 px-2 rounded">Cost</span></h1>
          <Input type="text" placeholder="Enter your pickup point" />
          <Input type="text" placeholder="Enter your destination" />
          <Button className="w-1/2">Request a Ride!</Button> */}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 items-center justify-center mx-11 my-0">

        <div className="flex flex-col gap-4 max-w-96">
          {/* <h1 className="text-5xl font-bold"><span className="text-white bg-purple-800 px-2 rounded">Share</span> the Ride, Split the <span className="text-white bg-purple-800 px-2 rounded">Cost</span></h1>
          <Input type="text" placeholder="Enter your pickup point" />
          <Input type="text" placeholder="Enter your destination" />
          <Button className="w-1/2">Request a Ride!</Button> */}
        </div>
        <div>
          <Image src="/homepage/networking2.png" alt="logo" width={500} height={500}></Image>
        </div>
      </section>
    </div>
  );
};

export default page;