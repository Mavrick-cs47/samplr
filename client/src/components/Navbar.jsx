import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'

const Navbar = () => {
  const KEY = (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '').trim()
  const ENABLE_CLERK = /^pk_(test|live)_[A-Za-z0-9]+$/.test(KEY)

  return (
    <div className='flex items-center justify-between mx-4 py-3 lg:mx-44'>
     <Link to="/"> <img className='w-32 sm:w-44' src={assets.logo_icon} alt="" /> </Link>
     {ENABLE_CLERK ? (
      <div>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode='modal'>
            <button className='bg-zinc-800 text-white flex items-center gap-4 px-4 py-2 sm:px-8 sm:py-3 text-sm rounded-full'>
              Get Started <img className='w-3 sm:w-4' src={assets.arrow_icon} alt="" />
            </button>
          </SignInButton>
        </SignedOut>
      </div>
     ) : (
      <Link to="/buy">
        <button className='bg-zinc-800 text-white flex items-center gap-4 px-4 py-2 sm:px-8 sm:py-3 text-sm rounded-full'>
          Get Started <img className='w-3 sm:w-4' src={assets.arrow_icon} alt="" />
        </button>
      </Link>
     )}
    </div>
  )
}

export default Navbar
