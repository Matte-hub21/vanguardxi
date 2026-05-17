'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { GlassCard } from '@/components/common/GlassCard'
import { Upload, Sparkles, Loader2, Check, X, Plus, Edit3, Trash2, Trophy, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'

async function fileToBase64(file) {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res({ base64: r.result.split(',')[1], mime: file.type }); r.onerror = rej; r.readAsDataURL(file) })
}

export function StandingsCard({ competition, ourTeamName = 'Vanguard XI' }) {
  const [open, setOpen] = useState(false)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [uploadDialog, setUploadDialog] = useState(false)
  const [preview, setPreview] = useState(null)
  const [extracted, setExtracted] = useState(null)
  const [ocrLoading, setOcrLoading] = useState(false)
  const fileRef = useRef(null)

  const fetchRows = async () => {
    setLoading(true)
    try {
      const r = await fetch(`/api/standings?competition_id=${competition.id}`)
      const data = await r.json()
      setRows(data.standings || [])
    } finally { setLoading(false) }
  }
  useEffect(() => { if (open) fetchRows() }, [open, competition.id])

  const save = async (next) => {
    const payload = { competition_id: competition.id, standings: next, our_team: ourTeamName }
    const r = await fetch('/api/standings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await r.json()
    if (!r.ok) { toast.error(data.error || 'errore'); return }
    toast.success(`Classifica salvata (${data.inserted} squadre)`)
    await fetchRows(); setEditMode(false)
  }

  const onFile = (e) => { const f = e.target.files?.[0]; if (f) setPreview({ file: f, url: URL.createObjectURL(f) }) }

  const extract = async () => {
    if (!preview) return
    setOcrLoading(true)
    try {
      const { base64, mime } = await fileToBase64(preview.file)
      const r = await fetch('/api/standings/extract', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageBase64: base64, mimeType: mime }) })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error)
      setExtracted(data)
      toast.success(`Estratte ${data.standings?.length || 0} squadre`)
    } catch (e) { toast.error(e.message) } finally { setOcrLoading(false) }
  }

  const onAddRow = () => setRows(prev => [...prev, { position: prev.length + 1, team: '', played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, points: 0 }])
  const onDelRow = (i) => setRows(prev => prev.filter((_, j) => j !== i))
  const onChange = (i, k, v) => setRows(prev => { const next = [...prev]; next[i] = { ...next[i], [k]: k==='team' ? v : Number(v) || 0 }; return next })

  return (
    <GlassCard className="p-0 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 p-4 hover:bg-white/[0.02] transition">
        <div className="h-9 w-9 rounded-lg flex items-center justify-center text-lg" style={{ background: `${competition.color}20`, border: `1px solid ${competition.color}40` }}>{competition.logo || '🏆'}</div>
        <div className="flex-1 text-left">
          <div className="font-display font-bold">Classifica {competition.name}</div>
          <div className="text-[10px] text-muted-foreground">{rows.length > 0 ? `${rows.length} squadre • ${ourTeamName} #${rows.find(r=>r.is_us)?.position || '?'}` : 'Nessuna classifica ancora'}</div>
        </div>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="p-4 border-t border-white/5">
              <div className="flex items-center justify-end gap-2 mb-3">
                <Button size="sm" variant="outline" className="border-white/10" onClick={() => { setUploadDialog(true); setPreview(null); setExtracted(null) }}>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5 text-[#D4AF37]" /> Importa da screenshot
                </Button>
                <Button size="sm" variant={editMode ? 'default' : 'outline'} className={editMode ? 'bg-[#D4AF37] hover:bg-[#F5C518] text-black' : 'border-white/10'} onClick={() => editMode ? save(rows) : setEditMode(true)}>
                  {editMode ? <><Check className="h-3.5 w-3.5 mr-1.5" /> Salva</> : <><Edit3 className="h-3.5 w-3.5 mr-1.5" /> Modifica</>}
                </Button>
              </div>
              {loading ? <div className="text-xs text-muted-foreground py-8 text-center">Caricamento...</div> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="text-[10px] uppercase text-muted-foreground border-b border-white/10">
                      <th className="p-2 text-left">#</th><th className="p-2 text-left">Squadra</th>
                      <th className="p-2">G</th><th className="p-2">V</th><th className="p-2">N</th><th className="p-2">P</th>
                      <th className="p-2">GF</th><th className="p-2">GS</th><th className="p-2 text-right">Pt</th>
                      {editMode && <th className="p-2"></th>}
                    </tr></thead>
                    <tbody>
                      {rows.map((r, i) => (
                        <tr key={i} className={`border-b border-white/5 ${r.is_us ? 'bg-[#D4AF37]/10' : ''}`}>
                          <td className="p-1.5 font-display font-bold gold-text">{r.position}</td>
                          <td className="p-1.5">
                            {editMode ? <Input value={r.team} onChange={e => onChange(i, 'team', e.target.value)} className="h-7 bg-white/[0.03] border-white/5 text-xs" /> : <span className={r.is_us ? 'font-bold text-[#D4AF37]' : ''}>{r.team} {r.is_us && <Trophy className="inline h-3 w-3 ml-1" />}</span>}
                          </td>
                          {['played','wins','draws','losses','gf','ga','points'].map(k => (
                            <td key={k} className="p-1 text-center">
                              {editMode ? <Input type="number" value={r[k]||0} onChange={e => onChange(i, k, e.target.value)} className="h-7 w-12 bg-white/[0.03] border-white/5 text-xs text-center" /> : <span className={k==='points' ? 'font-bold' : 'text-muted-foreground'}>{r[k]||0}</span>}
                            </td>
                          ))}
                          {editMode && <td className="p-1"><Button size="icon" variant="ghost" className="h-7 w-7 text-red-400" onClick={() => onDelRow(i)}><Trash2 className="h-3 w-3" /></Button></td>}
                        </tr>
                      ))}
                      {editMode && (
                        <tr><td colSpan={editMode ? 10 : 9} className="p-2"><Button size="sm" variant="outline" className="w-full border-dashed border-white/10" onClick={onAddRow}><Plus className="h-3 w-3 mr-1" /> Aggiungi squadra</Button></td></tr>
                      )}
                      {!rows.length && !editMode && (
                        <tr><td colSpan={9} className="text-center text-muted-foreground py-8 text-xs">Nessuna classifica. Importa da screenshot o clicca Modifica per inserirla manualmente.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OCR import dialog */}
      <Dialog open={uploadDialog} onOpenChange={(o) => { setUploadDialog(o); if (!o) { setPreview(null); setExtracted(null) } }}>
        <DialogContent className="bg-[#0e0e12] border-white/10 max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display flex items-center gap-2"><Sparkles className="h-5 w-5 text-[#D4AF37]" /> Importa classifica da screenshot</DialogTitle></DialogHeader>
          {!preview && !extracted && (
            <div onClick={() => fileRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) setPreview({ file: f, url: URL.createObjectURL(f) }) }} className="border-2 border-dashed border-[#D4AF37]/30 rounded-xl p-10 text-center cursor-pointer hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5">
              <Upload className="h-10 w-10 mx-auto text-[#D4AF37]" />
              <div className="mt-3 font-display font-semibold">Trascina lo screenshot della classifica</div>
              <div className="text-xs text-muted-foreground mt-1">VPG, Eludo, NSCV — funziona con qualsiasi tabella</div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
            </div>
          )}
          {preview && !extracted && (
            <div className="space-y-3">
              <img src={preview.url} className="w-full max-h-80 object-contain rounded-lg bg-black" />
              <div className="flex gap-2">
                <Button onClick={extract} disabled={ocrLoading} className="flex-1 bg-[#D4AF37] hover:bg-[#F5C518] text-black font-semibold">
                  {ocrLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Lettura tabella...</> : <><Sparkles className="h-4 w-4 mr-2" /> Estrai con AI</>}
                </Button>
                <Button variant="outline" className="border-white/10" onClick={() => setPreview(null)}>Annulla</Button>
              </div>
            </div>
          )}
          {extracted && (
            <div className="space-y-3">
              <Badge variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37]">Confidence {Math.round((extracted.confidence||0.9)*100)}% • {extracted.standings?.length || 0} squadre</Badge>
              <div className="max-h-96 overflow-y-auto scrollbar-thin border border-white/5 rounded-lg">
                <table className="w-full text-xs">
                  <thead><tr className="text-[10px] uppercase text-muted-foreground border-b border-white/10 sticky top-0 bg-[#0e0e12]"><th className="p-2 text-left">#</th><th className="p-2 text-left">Team</th><th className="p-2">G</th><th className="p-2">V/N/P</th><th className="p-2">GF/GS</th><th className="p-2 text-right">Pt</th></tr></thead>
                  <tbody>{(extracted.standings||[]).map((s, i) => (<tr key={i} className="border-b border-white/5"><td className="p-1.5 font-bold gold-text">{s.position}</td><td className="p-1.5">{s.team}</td><td className="p-1.5 text-center text-muted-foreground">{s.played}</td><td className="p-1.5 text-center text-muted-foreground">{s.wins}/{s.draws}/{s.losses}</td><td className="p-1.5 text-center text-muted-foreground">{s.gf}/{s.ga}</td><td className="p-1.5 text-right font-bold">{s.points}</td></tr>))}</tbody>
                </table>
              </div>
              <div className="flex gap-2">
                <Button onClick={async () => { await save(extracted.standings || []); setUploadDialog(false); setPreview(null); setExtracted(null) }} className="flex-1 bg-[#D4AF37] hover:bg-[#F5C518] text-black font-semibold"><Check className="h-4 w-4 mr-2" /> Salva classifica</Button>
                <Button variant="outline" className="border-white/10" onClick={() => { setExtracted(null); setPreview(null) }}>Riprova</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </GlassCard>
  )
}
