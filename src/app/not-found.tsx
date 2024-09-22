import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


const Notfound = () => {
    return (
        <div className='pt-36 pb-20 flex flex-col justify-center  items-center'>
            <Image src="/404.svg" alt="logo" width={500} height={500}></Image>
            <h1 className='text-2xl font-bold m-7'>
                Developer is busy feeding his cat and forgot to develop the page!!!
            </h1>
            <Button className='w-52 h-10 text-base'><Link href={'/'}>Return Home</Link></Button>
            
        </div>
    );
};

export default Notfound;
