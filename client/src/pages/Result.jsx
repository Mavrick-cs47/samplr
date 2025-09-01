import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useCredits } from '../state/CreditsContext'
import { removeBackground, preload } from '@imgly/background-removal'
import { assets } from '../assets/assets'

const Result = () => {
  const navigate = useNavigate()
  const { credits, decrement, setCredits } = useCredits()
  const fileInputRef = useRef(null)
  const [originalSrc, setOriginalSrc] = useState(assets.image_w_bg)
  const [outputSrc, setOutputSrc] = useState(assets.image_wo_bg)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [redeemOpen, setRedeemOpen] = useState(false)
  const [code, setCode] = useState('')

  useEffect(() => {
    preload({ publicPath: 'https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/' }).catch(() => {})
  }, [])

  const handlePick = () => {
    if (credits <= 0) { setRedeemOpen(true); return }
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (credits <= 0) { setRedeemOpen(true); return }
    setError('')
    const localUrl = URL.createObjectURL(file)
    setOriginalSrc(localUrl)
    setLoading(true)

    try {
      const resultBlob = await removeBackground(file, {
        publicPath: 'https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/',
        output: { format: 'image/png' },
      })
      const url = URL.createObjectURL(resultBlob)
      setOutputSrc(url)
      decrement()
    } catch (err) {
      setError(typeof err === 'string' ? err : (err?.message || 'Background removal failed'))
    } finally {
      setLoading(false)
      e.target.value = ''
    }
  }

  return (
    <div className='mx-4 my-3 lg:mx-44 mt-14 min-h-[75vh]'>
      <input ref={fileInputRef} onChange={handleFileChange} type='file' accept='image/*' hidden />
      <div className='bg-slate-300 rounded-lg px-8 py-6 drop-shadow-sm'>
        <div className='flex justify-end text-sm text-gray-600 mb-2'>Credits left: {credits > 100000 ? 'Unlimited' : credits}</div>
        <div className=' flex flex-col sm:grid grid-cols-2 gap-8'>
          <div>
            <p className='font-semibold mb-2'>Original</p>
            <img className='rounded-md border' src={originalSrc} alt='' />
          </div>

          <div className='flex flex-col'>
            <p className='font-semibold mb-2'>Background Removed</p>
            <div className='rounded-md border border-gray-300 h-full relative bg-layer overflow-hidden min-h-[200px] flex items-center justify-center'>
              {loading ? (
                <div className='absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2'>
                  <div className='border-4 border-violet-600 rounded-full h-12 w-12 border-t-transparent animate-spin'></div>
                </div>
              ) : (
                <img src={outputSrc} alt='' />
              )}
            </div>
            {error && <p className='text-red-600 text-sm mt-2'>{error}</p>}
          </div>
        </div>
        <div className='flex justify-center sm:justify-end items-center flex-wrap gap-4 mt-6'>
          <button onClick={handlePick} className='px-8 py-2.5 text-violet-500 text-sm border border-violet-800 rounded-full hover:scale-105 transition-all duration-700'>Try another image</button>
          <a className='px-8 py-2.5 text-white text-sm bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full hover:scale-105 transition-all duration-700' href={outputSrc} download='bg-removed.png'> Download image </a>
        </div>
      </div>

      {redeemOpen && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 w-full max-w-md shadow-lg'>
            <h3 className='text-lg font-semibold mb-2'>Credits ended</h3>
            <p className='text-sm text-gray-600 mb-4'>Choose a plan or enter your access code to unlock unlimited credits.</p>
            <div className='flex flex-col gap-3'>
              <button onClick={() => navigate('/buy')} className='px-6 py-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white'>Buy a plan</button>
              <div className='flex gap-2'>
                <input value={code} onChange={(e)=>setCode(e.target.value)} placeholder='Enter code' className='flex-1 border rounded-md px-3 py-2' />
                <button onClick={()=>{
                  if (code.trim().toLowerCase()==='chirag5911') { setCredits(999999); toast.success('Unlimited credits unlocked!'); setRedeemOpen(false); setCode('') }
                  else { toast.error('Invalid code') }
                }} className='px-4 py-2 rounded-md bg-zinc-800 text-white'>Apply</button>
              </div>
              <button onClick={()=>setRedeemOpen(false)} className='text-sm text-gray-500 mt-1'>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Result
