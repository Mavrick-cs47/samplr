import React from 'react';
import { assets, plans } from '../assets/assets';

const BuyCredit = () => {
  return (
    <div className='min-h-[80vh] text-center pt-14 mb-10'>
      <button className='bg-black text-white px-6 py-2 rounded-md mb-4'>Our Plans</button>
      <h1 className='text-2xl font-semibold mb-8'>Choose your favorite plan</h1>
      <div className='flex flex-wrap justify-center gap-6'>
        {plans.map((item, index) => (
          <div
            key={index}
            className='p-[2px] rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:scale-105 transition-all duration-300'
          >
            <div className='bg-white w-60 p-6 rounded-md shadow'>
              <img width={40} src={assets.logo_icon} alt="Logo" className='mx-auto mb-4' />
              <p className='text-lg font-medium mb-2'>{item.id}</p>
              <p className='text-sm text-gray-600 mb-4'>{item.desc}</p>
              <p className='text-base font-semibold'>
                <span className='text-xl text-green-600'>${item.price}</span> / {item.credits} credits
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyCredit;
