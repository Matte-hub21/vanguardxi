'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useRole } from '@/lib/hooks/useRole'
import { Check, X, Loader, AlertCircle } from 'lucide-react'

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
      return
    }
    fetchRequests()
  }, [isCaptain, activeTab])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/join-requests?status=${activeTab}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setRequests(data.requests || [])
      setError(null)
    } catch (err) {
      setError(err.message)
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
      <div className="p-8 text-center">
        <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          👥 Richieste di Accesso
        </h1>
        <p className="text-muted-foreground">
          Approva o rifiuta le richieste di nuovi giocatori
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            ⏳ In Sospeso
            {requests.filter(r => r.status === 'pending').length > 0 && (
              <Badge className="ml-2 bg-yellow-500/20 text-yellow-400">
                {requests.filter(r => r.status === 'pending').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">
            ✅ Approvate
          </TabsTrigger>
          <TabsTrigger value="rejected">
            ❌ Rifiutate
          </TabsTrigger>
        </TabsList>

        {/* Pending Tab */}
        <TabsContent value="pending" className="mt-6">
          {loading ? (
            <div className="text-center py-12">
              <Loader className="h-8 w-8 animate-spin mx-auto text-[#D4AF37]" />
            </div>
          ) : requests.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700 text-center py-12">
              <p className="text-slate-400">Nessuna richiesta in sospeso 🎉</p>
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
        <TabsContent value="approved" className="mt-6">
          {loading ? (
            <div className="text-center py-12">
              <Loader className="h-8 w-8 animate-spin mx-auto text-[#D4AF37]" />
            </div>
          ) : requests.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700 text-center py-12">
              <p className="text-slate-400">Nessuna richiesta approvata</p>
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
        <TabsContent value="rejected" className="mt-6">
          {loading ? (
            <div className="text-center py-12">
              <Loader className="h-8 w-8 animate-spin mx-auto text-[#D4AF37]" />
            </div>
          ) : requests.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700 text-center py-12">
              <p className="text-slate-400">Nessuna richiesta rifiutata</p>
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
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              {actionType === 'approve' ? '✅ Approvare Giocatore?' : '❌ Rifiutare Giocatore?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              <p className="font-semibold text-white mb-2">{selectedRequest?.full_name}</p>
              <p>{selectedRequest?.email}</p>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-slate-200">Note (Opzionale)</Label>
              <Textarea
                value={responseNotes}
                onChange={(e) => setResponseNotes(e.target.value)}
                placeholder="Es: Benvenuto in squadra! Contattaci su Discord..."
                className="mt-2 bg-slate-700/50 border-slate-600 text-white"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <AlertDialogCancel className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600">
              Annulla
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              disabled={processing}
              className={actionType === 'approve' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
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
    <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition">
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          {/* Info */}
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-lg font-bold text-white">{request.full_name}</h3>
              <p className="text-sm text-slate-400">{request.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-400">Piattaforma</p>
                <p className="font-semibold text-white capitalize">
                  {request.platform === 'xbox' ? '🎮 Xbox' : '🎮 PlayStation'}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Ruolo</p>
                <p className="font-semibold text-white">{request.preferred_position}</p>
              </div>
              <div>
                <p className="text-slate-400">Username Sito</p>
                <p className="font-semibold text-white">{request.site_username}</p>
              </div>
              <div>
                <p className="text-slate-400">EA Gamertag</p>
                <p className="font-semibold text-white">{request.ea_gamertag}</p>
              </div>
            </div>

            {request.notes && (
              <div className="text-sm">
                <p className="text-slate-400">Note</p>
                <p className="text-white">{request.notes}</p>
              </div>
            )}

            <p className="text-xs text-slate-500">
              Richiesta inviata: {new Date(request.requested_at).toLocaleDateString('it-IT')}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 lg:justify-center">
            <Button
              onClick={onApprove}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              Approva
            </Button>
            <Button
              onClick={onReject}
              variant="outline"
              className="border-red-600 text-red-400 hover:bg-red-600/10"
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
    <Card className="bg-green-500/5 border-green-500/30">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-green-400">{request.full_name}</h3>
              <Badge className="bg-green-500/20 text-green-400">✅ Approvato</Badge>
            </div>
            <p className="text-sm text-slate-400 mb-3">{request.email}</p>
            <p className="text-xs text-slate-500">
              Approvato: {new Date(request.responded_at).toLocaleDateString('it-IT')}
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
    <Card className="bg-red-500/5 border-red-500/30">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-red-400">{request.full_name}</h3>
              <Badge className="bg-red-500/20 text-red-400">❌ Rifiutato</Badge>
            </div>
            <p className="text-sm text-slate-400 mb-3">{request.email}</p>
            {request.captain_response_notes && (
              <p className="text-sm text-slate-300 mb-2">
                <strong>Note:</strong> {request.captain_response_notes}
              </p>
            )}
            <p className="text-xs text-slate-500">
              Rifiutato: {new Date(request.responded_at).toLocaleDateString('it-IT')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
