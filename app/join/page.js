'use client'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, CheckCircle2, Loader, Shield } from 'lucide-react'

const POSITIONS = [
  'Goalkeeper',
  'Left Back',
  'Center Back',
  'Right Back',
  'Left Midfield',
  'Center Midfield',
  'Right Midfield',
  'Left Wing',
  'Right Wing',
  'Striker',
  'Second Striker'
]

export default function JoinPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    platform: '',
    site_username: '',
    ea_gamertag: '',
    console_gamertag: '',
    preferred_position: '',
    notes: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/join-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Errore durante la richiesta')
        setLoading(false)
        return
      }

      setSuccess(true)
      setFormData({
        email: '',
        full_name: '',
        platform: '',
        site_username: '',
        ea_gamertag: '',
        console_gamertag: '',
        preferred_position: '',
        notes: ''
      })

      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900 opacity-90" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl opacity-20" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="border-b border-[#D4AF37]/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D4AF37]/20 border border-[#D4AF37] rounded-lg flex items-center justify-center">
                <span className="text-[#D4AF37] font-bold">V</span>
              </div>
              <div>
                <p className="text-white font-bold text-lg">VANGUARD XI</p>
                <p className="text-xs text-[#D4AF37] tracking-wider">PRO CLUBS HQ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-lg">
            {/* Hero Section */}
            <div className="text-center mb-10">
              <h1 className="text-5xl md:text-6xl font-black mb-4">
                <span className="text-white">JOIN</span>
                <br />
                <span className="bg-gradient-to-r from-[#D4AF37] to-[#FFE066] bg-clip-text text-transparent">
                  THE LEGEND
                </span>
              </h1>
              <p className="text-slate-400 text-lg mb-8">
                Unisciti al nostro roster ufficiale.
                <br />
                <span className="text-[#D4AF37] font-semibold">Forged in Gold. Built to Dominate.</span>
              </p>
            </div>

            {/* Form Card */}
            <Card className="bg-black/40 border-[#D4AF37]/30 backdrop-blur-xl shadow-2xl">
              <CardHeader className="border-b border-[#D4AF37]/20 pb-6">
                <CardTitle className="text-white text-2xl flex items-center gap-2">
                  <Shield className="h-6 w-6 text-[#D4AF37]" />
                  CANDIDATURA
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Compila il modulo per entrare nella squadra ufficiale
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                {success && (
                  <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex gap-3 items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-green-400">✅ Richiesta Inviata!</p>
                      <p className="text-sm text-green-300">Il capitano esaminerà la tua candidatura.</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex gap-3 items-start">
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-red-400">Errore</p>
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Row 1: Full Name & Email */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="text-[#D4AF37] font-semibold uppercase text-xs">
                        Nome Completo *
                      </Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="Marco Rossi"
                        required
                        className="bg-slate-900/50 border-[#D4AF37]/30 text-white placeholder-slate-500 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#D4AF37] font-semibold uppercase text-xs">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tuo@email.com"
                        required
                        className="bg-slate-900/50 border-[#D4AF37]/30 text-white placeholder-slate-500 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                      />
                    </div>
                  </div>

                  {/* Row 2: Platform & Position */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[#D4AF37] font-semibold uppercase text-xs">Piattaforma *</Label>
                      <Select value={formData.platform} onValueChange={(value) => handleSelectChange('platform', value)}>
                        <SelectTrigger className="bg-slate-900/50 border-[#D4AF37]/30 text-white focus:border-[#D4AF37]">
                          <SelectValue placeholder="Scegli..." />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-[#D4AF37]/30">
                          <SelectItem value="xbox">🎮 Xbox</SelectItem>
                          <SelectItem value="playstation">🎮 PlayStation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#D4AF37] font-semibold uppercase text-xs">Ruolo *</Label>
                      <Select 
                        value={formData.preferred_position} 
                        onValueChange={(value) => handleSelectChange('preferred_position', value)}
                      >
                        <SelectTrigger className="bg-slate-900/50 border-[#D4AF37]/30 text-white focus:border-[#D4AF37]">
                          <SelectValue placeholder="Scegli..." />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-[#D4AF37]/30">
                          {POSITIONS.map(pos => (
                            <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Row 3: Site Username & EA Gamertag */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="site_username" className="text-[#D4AF37] font-semibold uppercase text-xs">
                        Username Sito *
                      </Label>
                      <Input
                        id="site_username"
                        name="site_username"
                        value={formData.site_username}
                        onChange={handleChange}
                        placeholder="marcorossi99"
                        required
                        className="bg-slate-900/50 border-[#D4AF37]/30 text-white placeholder-slate-500 focus:border-[#D4AF37]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ea_gamertag" className="text-[#D4AF37] font-semibold uppercase text-xs">
                        EA Gamertag *
                      </Label>
                      <Input
                        id="ea_gamertag"
                        name="ea_gamertag"
                        value={formData.ea_gamertag}
                        onChange={handleChange}
                        placeholder="MarcoR99"
                        required
                        className="bg-slate-900/50 border-[#D4AF37]/30 text-white placeholder-slate-500 focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  {/* Row 4: Console Gamertag */}
                  <div className="space-y-2">
                    <Label htmlFor="console_gamertag" className="text-[#D4AF37] font-semibold uppercase text-xs">
                      Gamertag Console *
                    </Label>
                    <Input
                      id="console_gamertag"
                      name="console_gamertag"
                      value={formData.console_gamertag}
                      onChange={handleChange}
                      placeholder="MarcoRossi99"
                      required
                      className="bg-slate-900/50 border-[#D4AF37]/30 text-white placeholder-slate-500 focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Row 5: Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-[#D4AF37] font-semibold uppercase text-xs">
                      Note (Opzionale)
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Es: Anni di esperienza, titoli giocati, ecc..."
                      className="bg-slate-900/50 border-[#D4AF37]/30 text-white placeholder-slate-500 focus:border-[#D4AF37]"
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#FFE066] hover:from-[#C99A2E] hover:to-[#E6CC44] text-black font-bold text-lg py-6 rounded-lg transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader className="h-5 w-5 mr-2 animate-spin" />
                        PROCESSING...
                      </>
                    ) : (
                      '→ INVIA CANDIDATURA'
                    )}
                  </Button>

                  <p className="text-xs text-slate-500 text-center">
                    * Campi obbligatori | Protetto da Supabase Auth
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="mt-8 text-center text-slate-500 text-xs">
              <p>© 2026 Vanguard XI Esports • All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
