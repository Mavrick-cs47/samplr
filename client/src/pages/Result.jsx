import React from 'react'
import { useEffect, useRef, useState } from 'react'
import { removeBackground, preload } from '@imgly/background-removal'
import { assets } from '../assets/assets'

const Result = () => {
  const fileInputRef = useRef(null)
  const [originalSrc, setOriginalSrc] = useState(assets.image_w_bg)
  const [outputSrc, setOutputSrc] = useState(assets.image_wo_bg)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    preload({
      // Use CDN path to ensure assets load under dev server
      publicPath: 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@latest/dist/',
    }).catch(() => {})
  }, [])

  const handlePick = () => fileInputRef.current?.click()

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    const localUrl = URL.createObjectURL(file)
    setOriginalSrc(localUrl)
    setLoading(true)

    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 90000))
      const run = removeBackground(file, {
        output: { format: 'image/png' },
        progress: (_key, current, total) => {
          if (total) setProgress(Math.round((current / total) * 100))
        },
        publicPath: 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@latest/dist/',
      })
      const resultBlob = await Promise.race([run, timeoutPromise])
      const url = URL.createObjectURL(resultBlob)
      setOutputSrc(url)
    } catch (err) {
      setError(typeof err === 'string' ? err : (err?.message || 'Background removal failed'))
    } finally {
      setLoading(false)
      setProgress(0)
      e.target.value = ''
    }
  }

  return (
    <div className='mx-4 my-3 lg:mx-44 mt-14 min-h-[75vh]'>
      <input ref={fileInputRef} onChange={handleFileChange} type='file' accept='image/*' hidden />
      <div className='bg-slate-300 rounded-lg px-8 py-6 drop-shadow-sm'>
        <div className=' flex flex-col sm:grid grid-cols-2 gap-8'>
          <div>
            <p className='font-semibold mb-2'>Original</p>
            <img className='rounded-md border' src={originalSrc} alt='' />
          </div>

          <div className='flex flex-col'>
            <p className='font-semibold mb-2'>Background Removed</p>
            <div className='rounded-md border border-gray-300 h-full relative bg-layer overflow-hidden min-h-[200px] flex items-center justify-center'>
              {loading ? (
                <div className='absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2 flex flex-col items-center gap-2'>
                  <div className='border-4 border-violet-600 rounded-full h-12 w-12 border-t-transparent animate-spin'></div>
                  {progress > 0 && <p className='text-xs text-gray-600'>{progress}%</p>}
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
    </div>
  )
}

export default Result
