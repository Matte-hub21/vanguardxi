'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/common/GlassCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { listCompetitions, upsertCompetition, syncCompetition, deleteCompetition } from '@/lib/services/competitionService'
import { formatDistanceToNow } from 'date-fns'
import { Plus, RefreshCw, Trash2, Link as LinkIcon, Calendar as CalendarIcon, Loader2, Check, Trophy, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { StandingsCard } from '@/components/competitions/StandingsCard'
import { AddMatchDialog } from '@/components/competitions/AddMatchDialog'

const PRESETS = [
  { id: 'vpg',   name: 'VPG',         slug: 'vpg',   logo: '🎮', color: '#9333ea', desc: 'Virtual Pro Gaming — international Pro Clubs leagues' },
  { id: 'eludo', name: 'Eludo',       slug: 'eludo', logo: '🔴', color: '#ef4444', desc: 'Eludo — Italian Pro Clubs competitive league' },
  { id: 'nscv',  name: 'NSCV',        slug: 'nscv',  logo: '⚔️', color: '#3b82f6', desc: 'NSCV — Italian Serie A esports' },
  { id: 'eafc',  name: 'EAFC Clubs',  slug: 'eafc',  logo: '⚽', color: '#10b981', desc: 'EA Sports official Pro Clubs ladder' },
]

export default function CompetitionsPage() {
  const [comps, setComps] = useState([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(null)
  const [dialog, setDialog] = useState(null) // preset or 'custom'
  const [form, setForm] = useState({ id: '', name: '', slug: '', logo: '', color: '#D4AF37', ical_url: '', sync_enabled: true })

  const fetchAll = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/competitions')
      const data = await r.json()
      if (data.ok) setComps(data.competitions || [])
    } finally { setLoading(false) }
  }
  useEffect(() => { fetchAll() }, [])

  const openPreset = (preset) => {
    const existing = comps.find(c => c.id === preset.id)
    if (existing) setForm({ ...existing })
    else setForm({ ...preset, ical_url: '', sync_enabled: true })
    setDialog(preset.id)
  }
  const openCustom = () => {
    setForm({ id: '', name: '', slug: '', logo: '🏆', color: '#D4AF37', ical_url: '', sync_enabled: true })
    setDialog('custom')
  }

  const onSave = async () => {
    if (!form.id || !form.name) { toast.error('Inserisci ID e nome'); return }
    const res = await upsertCompetition(form)
    if (!res.ok) { toast.error(res.error || 'Errore salvataggio'); return }
    toast.success('Competizione salvata')
    setDialog(null)
    await fetchAll()
  }

  const onSync = async (id) => {
    setSyncing(id)
    try {
      const res = await syncCompetition(id)
      if (!res.ok) throw new Error(res.error || 'sync fallita')
      toast.success(`Importate ${res.imported} partite`)
      await fetchAll()
    } catch (e) { toast.error(e.message) } finally { setSyncing(null) }
  }

  const onDelete = async (id) => {
    if (!confirm('Scollegare questa competizione?')) return
    const r = await deleteCompetition(id)
    if (r.ok) { toast.success('Scollegata'); await fetchAll() } else toast.error(r.error)
  }

  const connectedById = comps.reduce((acc, c) => (acc[c.id] = c, acc), {})

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">Calendari esterni</div>
          <h1 className="font-display text-3xl lg:text-4xl font-black mt-1">Competizioni</h1>
          <p className="text-sm text-muted-foreground mt-1">Collega VPG, Eludo, NSCV o qualsiasi altra lega via feed iCal. Le partite vengono importate automaticamente nel calendario.</p>
        </div>
        <Button onClick={openCustom} variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10">
          <Plus className="h-4 w-4 mr-2" /> Aggiungi personalizzata
        </Button>
        <AddMatchDialog onCreated={() => toast.success('Partita aggiunta')} />
      </div>

      {/* Standings section */}
      {comps.length > 0 && (
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Classifiche</div>
          <div className="space-y-3">
            {comps.map(c => <StandingsCard key={`st-${c.id}`} competition={c} />)}
          </div>
        </div>
      )}

      {/* Connected competitions */}
      {comps.length > 0 && (
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Collegate ({comps.length})</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comps.map(c => (
              <GlassCard key={c.id} className="p-5">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-lg flex items-center justify-center text-2xl" style={{ background: `${c.color}20`, border: `1px solid ${c.color}40` }}>{c.logo || '🏆'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-lg font-bold">{c.name}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {c.last_synced_at ? <>Sync {formatDistanceToNow(new Date(c.last_synced_at), { addSuffix: true })}</> : 'Mai sincronizzato'}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px]" style={{ borderColor: `${c.color}50`, color: c.color }}>
                    <Check className="h-3 w-3 mr-1" /> Live
                  </Badge>
                </div>
                {c.ical_url ? (
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <LinkIcon className="h-3 w-3" /> <span className="truncate">{c.ical_url}</span>
                  </div>
                ) : (
                  <div className="mt-3 text-[10px] text-amber-400">⚠️ URL iCal non impostato</div>
                )}
                <div className="mt-4 flex items-center gap-2">
                  <Button size="sm" onClick={() => onSync(c.id)} disabled={syncing === c.id || !c.ical_url} className="bg-[#D4AF37] hover:bg-[#F5C518] text-black font-semibold">
                    {syncing === c.id ? <Loader2 className="h-3 w-3 mr-1.5 animate-spin" /> : <RefreshCw className="h-3 w-3 mr-1.5" />}
                    Sync
                  </Button>
                  <Button size="sm" variant="outline" className="border-white/10" onClick={() => { setForm({ ...c }); setDialog(c.id) }}>Modifica</Button>
                  <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-500 ml-auto" onClick={() => onDelete(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Presets */}
      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Leghe disponibili</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESETS.map((p, i) => {
            const connected = !!connectedById[p.id]
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.05 }} whileHover={{ y: -3 }}>
                <div className="glass rounded-xl p-5 relative overflow-hidden hover:border-[#D4AF37]/40 transition-colors">
                  <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full blur-2xl" style={{ background: `${p.color}30` }} />
                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 rounded-xl flex items-center justify-center text-3xl" style={{ background: `${p.color}20`, border: `1px solid ${p.color}50` }}>{p.logo}</div>
                      {connected && <Badge variant="outline" className="text-[10px] ml-auto" style={{ borderColor: `${p.color}80`, color: p.color }}>Collegata</Badge>}
                    </div>
                    <div className="font-display text-xl font-bold mt-3">{p.name}</div>
                    <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</div>
                    <Button size="sm" onClick={() => openPreset(p)} variant={connected ? 'outline' : 'default'} className={`mt-4 w-full ${connected ? 'border-white/10' : 'bg-[#D4AF37] hover:bg-[#F5C518] text-black font-semibold'}`}>
                      {connected ? 'Configura' : <><Plus className="h-3.5 w-3.5 mr-1.5" /> Collega</>}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Help card */}
      <GlassCard className="p-5 border-[#D4AF37]/15">
        <div className="flex items-start gap-3">
          <CalendarIcon className="h-5 w-5 text-[#D4AF37] mt-0.5" />
          <div className="text-sm">
            <div className="font-semibold mb-1">Dove trovo l’URL iCal?</div>
            <div className="text-muted-foreground text-xs leading-relaxed">
              VPG, Eludo, NSCV e la maggior parte delle leghe espongono un feed iCal/.ics dalla pagina del tuo team o del campionato. Cerca opzioni come “<span className="text-[#D4AF37]">Subscribe to calendar</span>”, “<span className="text-[#D4AF37]">Export schedule</span>” o “<span className="text-[#D4AF37]">.ics URL</span>”. Copia quel link e incollalo qui sopra. La sincronizzazione importà automaticamente tutte le partite con orario, avversario e tipo competizione.
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Edit dialog */}
      <Dialog open={!!dialog} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent className="bg-[#0e0e12] border-white/10 max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <span className="text-2xl">{form.logo || '🏆'}</span> Collega {form.name || 'competizione'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Nome</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="mt-1 bg-white/[0.03] border-white/5" /></div>
              <div><Label className="text-xs">ID</Label><Input value={form.id} onChange={e => setForm({...form, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})} className="mt-1 bg-white/[0.03] border-white/5" placeholder="vpg" /></div>
              <div><Label className="text-xs">Logo (emoji)</Label><Input value={form.logo || ''} onChange={e => setForm({...form, logo: e.target.value})} className="mt-1 bg-white/[0.03] border-white/5" placeholder="🎮" /></div>
              <div><Label className="text-xs">Colore</Label><div className="mt-1 flex gap-2"><Input type="color" value={form.color || '#D4AF37'} onChange={e => setForm({...form, color: e.target.value})} className="w-12 h-9 p-1 bg-white/[0.03] border-white/5" /><Input value={form.color || '#D4AF37'} onChange={e => setForm({...form, color: e.target.value})} className="flex-1 bg-white/[0.03] border-white/5 font-mono text-xs" /></div></div>
            </div>
            <div>
              <Label className="text-xs">Feed iCal URL</Label>
              <Input value={form.ical_url || ''} onChange={e => setForm({...form, ical_url: e.target.value})} className="mt-1 bg-white/[0.03] border-white/5 font-mono text-xs" placeholder="https://vpg.gg/teams/.../schedule.ics" />
              <div className="text-[10px] text-muted-foreground mt-1">Incolla l’URL del feed .ics esportato dalla lega. Lascia vuoto per aggiungere il link in seguito.</div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Switch checked={form.sync_enabled !== false} onCheckedChange={(v) => setForm({...form, sync_enabled: v})} />
                <Label className="text-xs">Sync abilitata</Label>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-white/10" onClick={() => setDialog(null)}>Annulla</Button>
                <Button onClick={onSave} className="bg-[#D4AF37] hover:bg-[#F5C518] text-black font-semibold">Salva</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
