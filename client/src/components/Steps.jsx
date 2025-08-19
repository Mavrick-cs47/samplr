import React from 'react';
import { assets } from '../assets/assets';

const Steps = () => {
  return (
    <div className='mx-4 lg:mx-44 py-20 xl:py-40'>
      <h1 className='text-center text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold bg-gradient-to-r from-gray-500 to-gray-300 bg-clip-text text-transparent'>
        <span className='bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent '>You can remove background from your image in <br /> 3 easy steps </span>
        
      </h1>

      <div className='flex items-start flex-wrap gap-8 mt-16 xl:mt-24 justify-center'>

        <div className='flex flex-col items-center'>
          <img className='w-12 mb-4' src={assets.upload_icon} alt="Upload" />
          <div className='bg-white border drop-shadow-md p-6 rounded hover:scale-105 transition-all duration-500 w-72 text-center'>
            <p className='text-xl font-semibold mb-2'>Upload Image</p>
            <p className='text-sm text-neutral-500'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates.
            </p>
          </div>
        </div>

         <div className='flex flex-col items-center'>
          <img className='w-12 mb-4' src={assets.remove_bg_icon} alt="" />
          <div className='bg-white border drop-shadow-md p-6 rounded hover:scale-105 transition-all duration-500 w-72 text-center'>
            <p className='text-xl font-semibold mb-2'>Remove Background</p>
            <p className='text-sm text-neutral-500'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates.
            </p>
          </div>
        </div>  

         <div className='flex flex-col items-center'>
          <img className='w-12 mb-4' src={assets.download_icon} alt="" />
          <div className='bg-white border drop-shadow-md p-6 rounded hover:scale-105 transition-all duration-500 w-72 text-center'>
            <p className='text-xl font-semibold mb-2'>Download Image</p>
            <p className='text-sm text-neutral-500'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates.
            </p>
          </div>
        </div>

        {/* You can copy this box 2 more times and change the icon + text for 3 total steps */}

      </div>
    </div>
  );
};

export default Steps;
