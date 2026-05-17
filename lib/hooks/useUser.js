'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sb = createClient()
    let mounted = true
    sb.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setUser(data.session?.user || null)
      setLoading(false)
    })
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      setLoading(false)
    })
    return () => { mounted = false; subscription?.unsubscribe() }
  }, [])

  return { user, loading }
}
