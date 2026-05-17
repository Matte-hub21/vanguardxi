'use client'
import { useEffect, useState } from 'react'
import { subscribePresence } from '@/lib/services/presenceService'

export function usePresence() {
  const [list, setList] = useState([])
  useEffect(() => subscribePresence(setList), [])
  const byId = list.reduce((acc, p) => (acc[p.player_id] = p, acc), {})
  const online = list.filter(p => p.status === 'online' || p.status === 'in_match')
  return { list, byId, online, onlineCount: online.length }
}
