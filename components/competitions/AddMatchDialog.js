'use client'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Loader2, CalendarPlus } from 'lucide-react'
import { toast } from 'sonner'

const COMP_DEFAULTS = ['League', 'Cup', 'Friendly']
const VENUES = ['Home', 'Away']
const IMPORTANCES = ['low', 'medium', 'high']

export function AddMatchDialog({ trigger, onCreated }) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [comps, setComps] = useState([])
  const [form, setForm] = useState({
    opponent: '', opponent_tag: '', opponent_logo: '🏆',
    scheduled_at: defaultDateTime(),
    competition: 'League', venue: 'Home', importance: 'medium',
    status: 'upcoming', score_us: '', score_them: '',
  })

  useEffect(() => {
    if (open) fetch('/api/competitions').then(r => r.json()).then(d => setComps(d.competitions || []))
  }, [open])

  const onSave = async () => {
    if (!form.opponent || !form.scheduled_at) { toast.error('Avversario e data richiesti'); return }
    setSaving(true)
    try {
      const payload = { ...form }
      if (payload.status === 'upcoming') { delete payload.score_us; delete payload.score_them }
      else { payload.score_us = Number(payload.score_us)||0; payload.score_them = Number(payload.score_them)||0 }
      const r = await fetch('/api/matches/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error)
      toast.success('Partita aggiunta al calendario')
      setOpen(false)
      setForm(prev => ({ ...prev, opponent: '', opponent_tag: '', score_us: '', score_them: '' }))
      onCreated?.(data.match)
    } catch (e) { toast.error(e.message) } finally { setSaving(false) }
  }

  const allCompetitions = [
    ...COMP_DEFAULTS,
    ...comps.map(c => c.name).filter(n => !COMP_DEFAULTS.includes(n)),
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <span onClick={() => setOpen(true)}>{trigger}</span> : (
        <Button onClick={() => setOpen(true)} className="bg-[#D4AF37] hover:bg-[#F5C518] text-black font-semibold">
          <CalendarPlus className="h-4 w-4 mr-2" /> Aggiungi partita
        </Button>
      )}
      <DialogContent className="bg-[#0e0e12] border-white/10 max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-display">Aggiungi partita manualmente</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2"><Label className="text-xs">Avversario</Label><Input value={form.opponent} onChange={e => setForm({...form, opponent: e.target.value})} placeholder="Phoenix Reign" className="mt-1 bg-white/[0.03] border-white/5" /></div>
            <div><Label className="text-xs">Logo (emoji)</Label><Input value={form.opponent_logo} onChange={e => setForm({...form, opponent_logo: e.target.value})} className="mt-1 bg-white/[0.03] border-white/5" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Tag</Label><Input value={form.opponent_tag} onChange={e => setForm({...form, opponent_tag: e.target.value.toUpperCase()})} placeholder="PHX" maxLength={4} className="mt-1 bg-white/[0.03] border-white/5 uppercase" /></div>
            <div><Label className="text-xs">Data e ora</Label><Input type="datetime-local" value={form.scheduled_at} onChange={e => setForm({...form, scheduled_at: e.target.value})} className="mt-1 bg-white/[0.03] border-white/5" /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><Label className="text-xs">Competizione</Label>
              <Select value={form.competition} onValueChange={(v) => setForm({...form, competition: v})}>
                <SelectTrigger className="mt-1 bg-white/[0.03] border-white/5"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#0e0e12] border-white/10">{allCompetitions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Venue</Label>
              <Select value={form.venue} onValueChange={(v) => setForm({...form, venue: v})}>
                <SelectTrigger className="mt-1 bg-white/[0.03] border-white/5"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#0e0e12] border-white/10">{VENUES.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Importanza</Label>
              <Select value={form.importance} onValueChange={(v) => setForm({...form, importance: v})}>
                <SelectTrigger className="mt-1 bg-white/[0.03] border-white/5"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#0e0e12] border-white/10">{IMPORTANCES.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div><Label className="text-xs">Stato</Label>
            <Select value={form.status} onValueChange={(v) => setForm({...form, status: v})}>
              <SelectTrigger className="mt-1 bg-white/[0.03] border-white/5"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#0e0e12] border-white/10">
                <SelectItem value="upcoming">Programmata</SelectItem>
                <SelectItem value="completed">Già giocata</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {form.status === 'completed' && (
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Vanguard XI</Label><Input type="number" min={0} value={form.score_us} onChange={e => setForm({...form, score_us: e.target.value})} className="mt-1 bg-white/[0.03] border-white/5" placeholder="0" /></div>
              <div><Label className="text-xs">Avversario</Label><Input type="number" min={0} value={form.score_them} onChange={e => setForm({...form, score_them: e.target.value})} className="mt-1 bg-white/[0.03] border-white/5" placeholder="0" /></div>
            </div>
          )}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" className="border-white/10" onClick={() => setOpen(false)}>Annulla</Button>
            <Button onClick={onSave} disabled={saving} className="bg-[#D4AF37] hover:bg-[#F5C518] text-black font-semibold min-w-[140px]">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />} Salva partita
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function defaultDateTime() {
  const d = new Date(Date.now() + 24*3600*1000)
  d.setMinutes(0, 0, 0)
  return d.toISOString().slice(0, 16)
}
