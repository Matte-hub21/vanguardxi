'use client'
import { useEffect, useRef } from 'react'
import { subscribeTable } from '@/lib/services/realtimeService'

export function useRealtimeTable(table, onChange, { event = '*', enabled = true } = {}) {
  const cbRef = useRef(onChange)
  cbRef.current = onChange
  useEffect(() => {
    if (!enabled) return
    const unsub = subscribeTable({ table, event, onChange: (p) => cbRef.current(p) })
    return unsub
  }, [table, event, enabled])
}
