'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AuthGuard({ children }) {
  const [ready, setReady] = useState(false)
  const [authed, setAuthed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const sb = createClient()
    sb.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setAuthed(true)
        setReady(true)
      } else {
        router.replace('/login')
      }
    })
  }, [router])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="h-3 w-3 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="font-display tracking-widest text-sm">LOADING VANGUARD HQ</span>
        </div>
      </div>
    )
  }
  if (!authed) return null
  return children
}
