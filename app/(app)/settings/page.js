'use client'
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/common/GlassCard'
import { useUser } from '@/lib/hooks/useUser'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { listPlayers } from '@/lib/services/playerService'
import { Crown, Camera, Loader2, Save, Check } from 'lucide-react'
import { toast } from 'sonner'

const POSITIONS = ['GK','CB','LB','RB','CDM','CM','CAM','LW','RW','ST']
const ROLES = ['Captain','Vice-Captain','Player','Reserve','Coach']

export default function SettingsPage() {
  const { user } = useUser()
  const [players, setPlayers] = useState([])
  const [selectedId, setSelectedId] = useState('p1')
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const fileRef = useRef(null)

  useEffect(() => { listPlayers().then(ps => { setPlayers(ps); }) }, [])
  useEffect(() => {
    const p = players.find(x => x.id === selectedId)
    if (p) { setForm({ ...p }); setPreview(null) }
  }, [players, selectedId])

  const onField = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const onPickFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setPreview(URL.createObjectURL(f))
  }

  const uploadAvatar = async () => {
    const f = fileRef.current?.files?.[0]
    if (!f) return null
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', f); fd.append('player_id', form.id)
      const r = await fetch('/api/player/avatar', { method: 'POST', body: fd })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'upload failed')
      toast.success('Foto profilo aggiornata')
      return data.url
    } finally { setUploading(false) }
  }

  const onSave = async () => {
    if (!form) return
    setSaving(true)
    try {
      let avatar = form.avatar
      if (fileRef.current?.files?.[0]) {
        const url = await uploadAvatar()
        if (url) avatar = url
      }
      const payload = {
        id: form.id,
        gamertag: form.gamertag,
        name: form.name,
        position: form.position,
        number: form.number,
        rating: form.rating,
        role: form.role,
        avatar,
        pace: form.pace, shooting: form.shooting, passing: form.passing,
        dribbling: form.dribbling, defending: form.defending, physical: form.physical,
      }
      const r = await fetch('/api/player/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error)
      toast.success('Profilo salvato')
      // refetch
      const next = await listPlayers(); setPlayers(next)
      if (fileRef.current) fileRef.current.value = ''
      setPreview(null)
    } catch (e) { toast.error(e.message) } finally { setSaving(false) }
  }

  if (!form) return <div className="text-muted-foreground">Loading...</div>

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">Account</div>
          <h1 className="font-display text-3xl lg:text-4xl font-black mt-1">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Modifica il tuo profilo da giocatore.</p>
        </div>
        <div className="w-full md:w-72">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Editing</Label>
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="mt-1 bg-white/[0.03] border-white/5"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-[#0e0e12] border-white/10 max-h-72">
              {players.map(p => (
                <SelectItem key={p.id} value={p.id}>
                  <span className="font-mono text-xs text-muted-foreground">#{p.number}</span> {p.gamertag} <span className="text-muted-foreground">· {p.position}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Profile header with avatar upload */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-2 border-[#D4AF37]/30">
              <AvatarImage src={preview || form.avatar} />
              <AvatarFallback className="bg-[#D4AF37]/10 text-[#D4AF37] text-2xl font-bold">{(form.gamertag||'').slice(0,2)}</AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
            >
              {uploading ? <Loader2 className="h-6 w-6 text-[#D4AF37] animate-spin" /> : <Camera className="h-6 w-6 text-[#D4AF37]" />}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickFile} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="font-display text-2xl font-bold">{form.gamertag}</div>
              {form.role === 'Captain' && <Crown className="h-5 w-5 text-[#D4AF37]" />}
            </div>
            <div className="text-sm text-muted-foreground">{form.name} · #{form.number} · {form.position}</div>
            <div className="flex items-center gap-2 mt-3">
              <Button size="sm" variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10" onClick={() => fileRef.current?.click()}>
                <Camera className="h-4 w-4 mr-2" /> Cambia foto
              </Button>
              {preview && <span className="text-xs text-[#D4AF37]"><Check className="h-3 w-3 inline mr-1" />Nuova immagine pronta — premi Salva</span>}
            </div>
          </div>
          <div className="text-center sm:text-right">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Overall</div>
            <div className="font-display text-5xl font-black gold-text leading-none">{form.rating}</div>
          </div>
        </div>
      </GlassCard>

      {/* Identity */}
      <GlassCard className="p-6 space-y-4">
        <div className="font-display text-lg font-bold">Identità</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label className="text-xs">Gamertag</Label><Input value={form.gamertag||''} onChange={e => onField('gamertag', e.target.value)} className="mt-1 bg-white/[0.03] border-white/5" /></div>
          <div><Label className="text-xs">Nome completo</Label><Input value={form.name||''} onChange={e => onField('name', e.target.value)} className="mt-1 bg-white/[0.03] border-white/5" /></div>
          <div>
            <Label className="text-xs">Posizione</Label>
            <Select value={form.position||''} onValueChange={(v) => onField('position', v)}>
              <SelectTrigger className="mt-1 bg-white/[0.03] border-white/5"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#0e0e12] border-white/10">{POSITIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label className="text-xs">Numero maglia</Label><Input type="number" min={1} max={99} value={form.number||''} onChange={e => onField('number', e.target.value)} className="mt-1 bg-white/[0.03] border-white/5" /></div>
          <div>
            <Label className="text-xs">Ruolo</Label>
            <Select value={form.role||''} onValueChange={(v) => onField('role', v)}>
              <SelectTrigger className="mt-1 bg-white/[0.03] border-white/5"><SelectValue placeholder="Nessuno" /></SelectTrigger>
              <SelectContent className="bg-[#0e0e12] border-white/10">{ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label className="text-xs">Rating Overall</Label><Input type="number" min={40} max={99} value={form.rating||''} onChange={e => onField('rating', e.target.value)} className="mt-1 bg-white/[0.03] border-white/5" /></div>
        </div>
      </GlassCard>

      {/* Attributes */}
      <GlassCard className="p-6 space-y-3">
        <div className="font-display text-lg font-bold">Attributi (FC 26)</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[['PAC','pace'],['SHO','shooting'],['PAS','passing'],['DRI','dribbling'],['DEF','defending'],['PHY','physical']].map(([lbl, key]) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-xs">{lbl}</Label>
                <span className="text-xs font-bold gold-text">{form[key] || 0}</span>
              </div>
              <Input type="range" min={20} max={99} value={form[key]||50} onChange={e => onField(key, Number(e.target.value))} className="accent-[#D4AF37] bg-transparent" />
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" className="border-white/10" onClick={() => { const p = players.find(x => x.id === selectedId); setForm({ ...p }); setPreview(null); if (fileRef.current) fileRef.current.value = '' }}>Annulla</Button>
        <Button onClick={onSave} disabled={saving} className="bg-[#D4AF37] hover:bg-[#F5C518] text-black font-semibold min-w-[160px]">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          {saving ? 'Salvataggio...' : 'Salva profilo'}
        </Button>
      </div>
    </div>
  )
}
