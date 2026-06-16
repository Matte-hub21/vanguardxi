'use client'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, CheckCircle2, Loader } from 'lucide-react'

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

      // Reset success dopo 5 secondi
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-slate-800/50 border-slate-700">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-[#D4AF37]">
            🏆 Unisciti a Vanguard XI
          </CardTitle>
          <CardDescription className="text-slate-300">
            Compila il modulo per entrare nella squadra. Il capitano esaminerà la tua richiesta.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-400">Richiesta inviata!</p>
                <p className="text-sm text-green-300">Il capitano esaminerà la tua candidatura.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex gap-3 items-start">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-400">Errore</p>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-slate-200">
                Nome Completo *
              </Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Es: Marco Rossi"
                required
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tuo.email@example.com"
                required
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            {/* Platform */}
            <div className="space-y-2">
              <Label className="text-slate-200">Piattaforma *</Label>
              <Select value={formData.platform} onValueChange={(value) => handleSelectChange('platform', value)}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Seleziona piattaforma" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="xbox">🎮 Xbox</SelectItem>
                  <SelectItem value="playstation">🎮 PlayStation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Site Username */}
            <div className="space-y-2">
              <Label htmlFor="site_username" className="text-slate-200">
                Username Sito *
              </Label>
              <Input
                id="site_username"
                name="site_username"
                value={formData.site_username}
                onChange={handleChange}
                placeholder="Es: marcorossi99"
                required
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            {/* EA Gamertag */}
            <div className="space-y-2">
              <Label htmlFor="ea_gamertag" className="text-slate-200">
                Gamertag EA Sports *
              </Label>
              <Input
                id="ea_gamertag"
                name="ea_gamertag"
                value={formData.ea_gamertag}
                onChange={handleChange}
                placeholder="Es: MarcoR99"
                required
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            {/* Console Gamertag */}
            <div className="space-y-2">
              <Label htmlFor="console_gamertag" className="text-slate-200">
                Gamertag Console *
              </Label>
              <Input
                id="console_gamertag"
                name="console_gamertag"
                value={formData.console_gamertag}
                onChange={handleChange}
                placeholder="Es: MarcoRossi99"
                required
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            {/* Preferred Position */}
            <div className="space-y-2">
              <Label className="text-slate-200">Ruolo Preferito *</Label>
              <Select 
                value={formData.preferred_position} 
                onValueChange={(value) => handleSelectChange('preferred_position', value)}
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Seleziona ruolo" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {POSITIONS.map(pos => (
                    <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-slate-200">
                Note (Opzionale)
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Es: Ultimi titoli giocati, esperienza, ecc..."
                className="bg-slate-700/50 border-slate-600 text-white"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] hover:bg-[#C99A2E] text-slate-900 font-bold"
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Invio in corso...
                </>
              ) : (
                '✉️ Invia Richiesta'
              )}
            </Button>

            <p className="text-xs text-slate-400 text-center">
              I campi con * sono obbligatori
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
