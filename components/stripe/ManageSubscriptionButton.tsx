'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ManageSubscriptionButtonProps {
  children: React.ReactNode
  className?: string
}

export function ManageSubscriptionButton({
  children,
  className
}: ManageSubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleManage = async () => {
    if (isLoading) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ redirectPath: '/settings' }),
      })

      const { url, error } = await response.json()

      if (error) {
        console.error('Portal error:', error)
        return
      }

      // Redirect to Stripe Customer Portal
      window.location.href = url
    } catch (error) {
      console.error('Portal error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleManage}
      disabled={isLoading}
      className={cn(
        'transition-all',
        isLoading && 'opacity-70 cursor-not-allowed',
        className
      )}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  )
}
