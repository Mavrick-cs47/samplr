import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useUser } from '@clerk/clerk-react'

const CreditsContext = createContext({ credits: 0, setCredits: () => {}, decrement: () => {} })

const STORAGE_PREFIX = 'credits:'

export const CreditsProvider = ({ children }) => {
  const { isSignedIn, user } = useUser?.() || {}
  const userKey = useMemo(() => `${STORAGE_PREFIX}${isSignedIn ? user?.id : 'guest'}`, [isSignedIn, user?.id])
  const [credits, setCredits] = useState(0)

  // Initialize credits (10 free) per user
  useEffect(() => {
    if (!userKey) return
    const saved = localStorage.getItem(userKey)
    if (saved === null) {
      localStorage.setItem(userKey, String(10))
      setCredits(10)
    } else {
      setCredits(Number(saved) || 0)
    }
  }, [userKey])

  useEffect(() => {
    if (!userKey) return
    localStorage.setItem(userKey, String(credits))
  }, [userKey, credits])

  const decrement = () => {
    setCredits((c) => (c > 0 ? c - 1 : 0))
  }

  const value = useMemo(() => ({ credits, setCredits, decrement }), [credits])
  return <CreditsContext.Provider value={value}>{children}</CreditsContext.Provider>
}

export const useCredits = () => useContext(CreditsContext)
