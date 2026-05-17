'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Loader2, Sparkles, Check, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { GlassCard } from '@/components/common/GlassCard'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

async function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = () => { const s = r.result.split(',')[1]; res({ base64: s, mime: file.type }) }
    r.onerror = rej
    r.readAsDataURL(file)
  })
}

export function StatsUpload({ matchId, onSaved }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [extracted, setExtracted] = useState(null)
  const [score, setScore] = useState({ us: 0, them: 0 })
  const inputRef = useRef(null)

  const onFile = (f) => {
    if (!f || !f.type.startsWith('image/')) return
    setFile(f); setPreview(URL.createObjectURL(f))
  }

  const onDrop = (e) => { e.preventDefault(); onFile(e.dataTransfer.files?.[0]) }

  const analyse = async () => {
    if (!file) return
    setLoading(true)
    try {
      const { base64, mime } = await fileToBase64(file)
      const r = await fetch('/api/ocr/extract', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageBase64: base64, mimeType: mime }) })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'OCR failed')
      setExtracted(data)
      if (data.raw_result) setScore({ us: data.raw_result.score_us ?? 0, them: data.raw_result.score_them ?? 0 })
      toast.success(`Extracted ${data.players?.length || 0} player rows`)
    } catch (e) {
      toast.error(e.message)
    } finally { setLoading(false) }
  }

  const updateField = (i, k, v) => {
    setExtracted(prev => {
      const ps = [...prev.players]; ps[i] = { ...ps[i], [k]: v }; return { ...prev, players: ps }
    })
  }

  const save = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/match/save-stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ match_id: matchId, players: extracted.players, score_us: Number(score.us), score_them: Number(score.them) }) })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error)
      toast.success('Match stats saved • MVP auto-selected')
      setExtracted(null); setFile(null); setPreview(null)
      onSaved?.()
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">AI Vision · GPT-4o</div>
          <div className="font-display text-lg font-bold">Upload Match Stats Screenshot</div>
        </div>
        <Badge variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37]"><Sparkles className="h-3 w-3 mr-1" /> Auto-extract</Badge>
      </div>

      {!preview && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="border-2 border-dashed border-[#D4AF37]/30 rounded-xl p-10 text-center cursor-pointer hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5 transition"
        >
          <Upload className="h-10 w-10 mx-auto text-[#D4AF37]" />
          <div className="mt-3 font-display font-semibold">Drop your post-match screenshot here</div>
          <div className="text-xs text-muted-foreground mt-1">EA FC 26 stats screen · PNG or JPG</div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => onFile(e.target.files?.[0])} />
        </div>
      )}

      {preview && !extracted && (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden border border-white/10">
            <img src={preview} alt="preview" className="w-full max-h-96 object-contain bg-black" />
          </div>
          <div className="flex gap-2">
            <Button onClick={analyse} disabled={loading} className="bg-[#D4AF37] hover:bg-[#F5C518] text-black font-semibold flex-1">
              {loading ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing match data...</>) : (<><Sparkles className="h-4 w-4 mr-2" /> Extract Stats with AI</>)}
            </Button>
            <Button variant="outline" className="border-white/10" onClick={() => { setFile(null); setPreview(null) }}>Cancel</Button>
          </div>
        </div>
      )}

      <Dialog open={!!extracted} onOpenChange={(o) => !o && setExtracted(null)}>
        <DialogContent className="max-w-4xl bg-[#0e0e12] border-white/10 max-h-[90vh] overflow-y-auto scrollbar-thin">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#D4AF37]" /> Review Extracted Stats
              {extracted && <Badge variant="outline" className="ml-auto border-[#D4AF37]/30 text-[#D4AF37]">Confidence {Math.round((extracted.confidence||0.9)*100)}%</Badge>}
            </DialogTitle>
          </DialogHeader>
          {extracted && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Vanguard XI</label><Input type="number" value={score.us} onChange={e => setScore({...score, us: e.target.value})} className="mt-1 bg-white/[0.03] border-white/5" /></div>
                <div><label className="text-xs text-muted-foreground">Opponent</label><Input type="number" value={score.them} onChange={e => setScore({...score, them: e.target.value})} className="mt-1 bg-white/[0.03] border-white/5" /></div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-[10px] uppercase text-muted-foreground border-b border-white/10">
                      <th className="text-left p-2">Player</th>
                      <th className="p-2">Rating</th><th className="p-2">G</th><th className="p-2">A</th><th className="p-2">Tkl</th><th className="p-2">Pass</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extracted.players.map((p, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="p-1.5">
                          <div className="font-semibold">{p.matched_to || p.name}</div>
                          <div className="text-[10px] text-muted-foreground">{p.matched_to ? `→ ${p.name}` : 'no match'}</div>
                        </td>
                        {['rating','goals','assists','tackles','passes'].map(k => (
                          <td key={k} className="p-1"><Input type="number" step={k==='rating'?'0.1':'1'} value={p[k] ?? 0} onChange={e => updateField(i, k, e.target.value)} className="h-8 w-16 text-xs bg-white/[0.03] border-white/5" /></td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-2">
                <Button onClick={save} disabled={loading} className="bg-[#D4AF37] hover:bg-[#F5C518] text-black font-semibold flex-1">
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />} Save & Auto-MVP
                </Button>
                <Button variant="outline" className="border-white/10" onClick={() => setExtracted(null)}><X className="h-4 w-4 mr-1" /> Discard</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </GlassCard>
  )
}
