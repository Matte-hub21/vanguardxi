'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useRole } from '@/lib/hooks/useRole'
import { Check, X, Loader, AlertCircle, Users, Clock, CheckCircle2, XCircle } from 'lucide-react'

export default function JoinRequestsPage() {
  const { isCaptain } = useRole()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [responseNotes, setResponseNotes] = useState('')
  const [actionType, setActionType] = useState(null) // 'approve' or 'reject'
  const [processing, setProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState('pending')

  useEffect(() => {
    if (!isCaptain()) {
      setError('Solo i capitani possono approvare le richieste')
      setLoading(false)
      return
    }
    fetchRequests()
  }, [activeTab])

  const fetchRequests = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/join-requests?status=${activeTab}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('API non trovata. Verifica di essere deployato su Vercel.')
          setRequests([])
          return
        }
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      
      if (!Array.isArray(data.requests)) {
        console.warn('Expected requests to be array, got:', typeof data.requests)
        setRequests([])
        return
      }

      setRequests(data.requests)
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err.message || 'Errore nel caricamento delle richieste')
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  const handleApproveClick = (request) => {
    setSelectedRequest(request)
    setActionType('approve')
    setResponseNotes('')
  }

  const handleRejectClick = (request) => {
    setSelectedRequest(request)
    setActionType('reject')
    setResponseNotes('')
  }

  const handleConfirmAction = async () => {
    setProcessing(true)
    try {
      const response = await fetch(
        `/api/join-requests?id=${selectedRequest.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: actionType === 'approve' ? 'approved' : 'rejected',
            captain_response_notes: responseNotes || null
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      // Aggiorna lista
      setRequests(prev => prev.filter(r => r.id !== selectedRequest.id))
      setSelectedRequest(null)
      setActionType(null)
      
      // Ricarica se ritorniamo a pending
      if (activeTab === 'pending') {
        fetchRequests()
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  if (error && !isCaptain()) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900 opacity-90" />
        <div className="relative z-10 p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-400 text-lg font-semibold">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900 opacity-90" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-8 w-8 text-[#D4AF37]" />
            <div>
              <h1 className="text-5xl font-black text-white">RICHIESTE</h1>
              <p className="text-[#D4AF37] tracking-wider text-sm font-semibold">Gestisci i candidati</p>
            </div>
          </div>
          <p className="text-slate-400 text-lg">
            Approva o rifiuta le richieste di nuovi giocatori per entrare nella squadra
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/40 border border-[#D4AF37]/30 rounded-lg p-1">
            <TabsTrigger value="pending" className="text-[#D4AF37] transition-all">
              <Clock className="h-4 w-4 mr-2" />
              In Sospeso
              {requests.filter(r => r.status === 'pending').length > 0 && (
                <Badge className="ml-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                  {requests.filter(r => r.status === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved" className="text-[#D4AF37] transition-all">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approvate
            </TabsTrigger>
            <TabsTrigger value="rejected" className="text-[#D4AF37] transition-all">
              <XCircle className="h-4 w-4 mr-2" />
              Rifiutate
            </TabsTrigger>
          </TabsList>

        {/* Pending Tab */}
        <TabsContent value="pending" className="mt-8">
          {loading ? (
            <div className="text-center py-20">
              <Loader className="h-10 w-10 animate-spin mx-auto text-[#D4AF37] mb-4" />
              <p className="text-slate-400">Caricamento richieste...</p>
            </div>
          ) : requests.length === 0 ? (
            <Card className="bg-black/40 border-[#D4AF37]/20 text-center py-16">
              <CardContent>
                <Clock className="h-12 w-12 mx-auto mb-4 text-[#D4AF37]/50" />
                <p className="text-slate-400 text-lg">Nessuna richiesta in sospeso 🎉</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {requests.map(req => (
                <RequestCard
                  key={req.id}
                  request={req}
                  onApprove={() => handleApproveClick(req)}
                  onReject={() => handleRejectClick(req)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Approved Tab */}
        <TabsContent value="approved" className="mt-8">
          {loading ? (
            <div className="text-center py-20">
              <Loader className="h-10 w-10 animate-spin mx-auto text-[#D4AF37] mb-4" />
              <p className="text-slate-400">Caricamento richieste...</p>
            </div>
          ) : requests.length === 0 ? (
            <Card className="bg-black/40 border-[#D4AF37]/20 text-center py-16">
              <CardContent>
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-[#D4AF37]/50" />
                <p className="text-slate-400 text-lg">Nessuna richiesta approvata</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {requests.map(req => (
                <ApprovedRequestCard key={req.id} request={req} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Rejected Tab */}
        <TabsContent value="rejected" className="mt-8">
          {loading ? (
            <div className="text-center py-20">
              <Loader className="h-10 w-10 animate-spin mx-auto text-[#D4AF37] mb-4" />
              <p className="text-slate-400">Caricamento richieste...</p>
            </div>
          ) : requests.length === 0 ? (
            <Card className="bg-black/40 border-[#D4AF37]/20 text-center py-16">
              <CardContent>
                <XCircle className="h-12 w-12 mx-auto mb-4 text-[#D4AF37]/50" />
                <p className="text-slate-400 text-lg">Nessuna richiesta rifiutata</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {requests.map(req => (
                <RejectedRequestCard key={req.id} request={req} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <AlertDialogContent className="bg-black/90 border-[#D4AF37]/30 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-2xl">
              {actionType === 'approve' ? '✅ Approvare Giocatore?' : '❌ Rifiutare Giocatore?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              <p className="font-semibold text-[#D4AF37] mb-1">{selectedRequest?.full_name}</p>
              <p className="text-slate-400">{selectedRequest?.email}</p>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 my-4">
            <div>
              <Label className="text-[#D4AF37] font-semibold">Note (Opzionale)</Label>
              <Textarea
                value={responseNotes}
                onChange={(e) => setResponseNotes(e.target.value)}
                placeholder="Es: Benvenuto in squadra! Contattaci su Discord..."
                className="mt-2 bg-slate-900/50 border-[#D4AF37]/30 text-white placeholder-slate-500 focus:border-[#D4AF37]"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <AlertDialogCancel className="bg-slate-800 hover:bg-slate-700 text-white border-slate-700">
              Annulla
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              disabled={processing}
              className={actionType === 'approve' 
                ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white' 
                : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white'
              }
            >
              {processing ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Elaborazione...
                </>
              ) : (
                actionType === 'approve' ? '✅ Approva' : '❌ Rifiuta'
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

/**
 * Request Card (Pending)
 */
function RequestCard({ request, onApprove, onReject }) {
  return (
    <Card className="bg-black/40 border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-all backdrop-blur-xl">
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          {/* Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{request.full_name}</h3>
              <p className="text-sm text-[#D4AF37]">{request.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                <p className="text-slate-400 text-xs uppercase tracking-wider">Piattaforma</p>
                <p className="font-semibold text-white mt-1">
                  {request.platform === 'xbox' ? '🎮 Xbox' : '🎮 PlayStation'}
                </p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                <p className="text-slate-400 text-xs uppercase tracking-wider">Ruolo</p>
                <p className="font-semibold text-white mt-1">{request.preferred_position}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                <p className="text-slate-400 text-xs uppercase tracking-wider">Username</p>
                <p className="font-semibold text-white mt-1">{request.site_username}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                <p className="text-slate-400 text-xs uppercase tracking-wider">EA Tag</p>
                <p className="font-semibold text-white mt-1">{request.ea_gamertag}</p>
              </div>
            </div>

            {request.notes && (
              <div className="bg-slate-900/30 rounded-lg p-3 border border-slate-800">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Note</p>
                <p className="text-white text-sm">{request.notes}</p>
              </div>
            )}

            <p className="text-xs text-slate-500">
              📅 Richiesta: {new Date(request.requested_at).toLocaleDateString('it-IT')}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 lg:justify-center lg:w-40">
            <Button
              onClick={onApprove}
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold"
            >
              <Check className="h-4 w-4 mr-2" />
              Approva
            </Button>
            <Button
              onClick={onReject}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold"
            >
              <X className="h-4 w-4 mr-2" />
              Rifiuta
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Approved Request Card
 */
function ApprovedRequestCard({ request }) {
  return (
    <Card className="bg-black/40 border-green-500/30 hover:border-green-500/60 transition-all backdrop-blur-xl">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-green-400">{request.full_name}</h3>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Approvato
              </Badge>
            </div>
            <p className="text-sm text-slate-400 mb-4">{request.email}</p>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-sm">
                <p className="text-slate-400 text-xs uppercase">Piattaforma</p>
                <p className="text-white font-semibold">{request.platform === 'xbox' ? '🎮 Xbox' : '🎮 PlayStation'}</p>
              </div>
              <div className="text-sm">
                <p className="text-slate-400 text-xs uppercase">Ruolo</p>
                <p className="text-white font-semibold">{request.preferred_position}</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-500">
              ✅ Approvato: {new Date(request.responded_at).toLocaleDateString('it-IT')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Rejected Request Card
 */
function RejectedRequestCard({ request }) {
  return (
    <Card className="bg-black/40 border-red-500/30 hover:border-red-500/60 transition-all backdrop-blur-xl">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-red-400">{request.full_name}</h3>
              <Badge className="bg-red-500/20 text-red-300 border-red-500/50">
                <XCircle className="h-3 w-3 mr-1" />
                Rifiutato
              </Badge>
            </div>
            <p className="text-sm text-slate-400 mb-4">{request.email}</p>
            
            {request.captain_response_notes && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">📝 Note del Capitano</p>
                <p className="text-red-200 text-sm">{request.captain_response_notes}</p>
              </div>
            )}
            
            <p className="text-xs text-slate-500">
              ❌ Rifiutato: {new Date(request.responded_at).toLocaleDateString('it-IT')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
