'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Subscription {
  id: string
  status: string
  price_id: string
  current_period_end: string
  cancel_at_period_end: boolean
  trial_end: string | null
}

interface UseSubscriptionReturn {
  subscription: Subscription | null
  isLoading: boolean
  isPro: boolean
  isTrialing: boolean
  refetch: () => Promise<void>
}

export function useSubscription(): UseSubscriptionReturn {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchSubscription = async () => {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setIsLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['trialing', 'active'])
      .maybeSingle()

    if (!error && data) {
      setSubscription(data)
    } else {
      setSubscription(null)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    fetchSubscription()
  }, [])

  const isPro = subscription !== null
  const isTrialing = subscription?.status === 'trialing'

  return {
    subscription,
    isLoading,
    isPro,
    isTrialing,
    refetch: fetchSubscription
  }
}
