import React from 'react';
import { assets, plans } from '../assets/assets';
import { useCredits } from '../state/CreditsContext';
import { toast } from 'react-toastify';
import { apiFetch } from '../lib/api';

const loadScript = (src) => new Promise((resolve, reject) => {
  const s = document.createElement('script')
  s.src = src
  s.onload = () => resolve(true)
  s.onerror = () => reject(new Error('Failed to load script'))
  document.body.appendChild(s)
})

const BuyCredit = () => {
  const { setCredits, credits } = useCredits()
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID

  const startCheckout = async (plan) => {
    try {
      if (!keyId) {
        toast.error('Payment not configured. Please provide Razorpay Key ID.')
        return
      }
      await loadScript('https://checkout.razorpay.com/v1/checkout.js')
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: plan.price * 100 }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create order')
      const order = data.order
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Credits Purchase',
        description: `${plan.id} - ${plan.credits} credits`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verify = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                order_id: order.id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            })
            const v = await verify.json()
            if (v.valid) {
              setCredits(credits + plan.credits)
              toast.success('Credits added!')
            } else {
              toast.error('Payment verification failed')
            }
          } catch (e) {
            toast.error(e.message)
          }
        },
        theme: { color: '#7c3aed' },
      }
      // eslint-disable-next-line no-undef
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error(err.message)
    }
  }

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
            <div className='bg-white w-60 p-6 rounded-md shadow flex flex-col items-center'>
              <img width={40} src={assets.logo_icon} alt="Logo" className='mx-auto mb-4' />
              <p className='text-lg font-medium mb-2'>{item.id}</p>
              <p className='text-sm text-gray-600 mb-4'>{item.desc}</p>
              <p className='text-base font-semibold mb-4'>
                <span className='text-xl text-green-600'>${item.price}</span> / {item.credits} credits
              </p>
              <button onClick={() => startCheckout(item)} className='px-6 py-2 text-white bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full'>
                Choose Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyCredit;
