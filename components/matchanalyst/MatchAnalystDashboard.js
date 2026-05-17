'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VideoUploader } from '@/components/matchanalyst/VideoUploader'
import { VideoPlayer } from '@/components/matchanalyst/VideoPlayer'
import { EventMarker } from '@/components/matchanalyst/EventMarker'
import { MatchAnalytics } from '@/components/matchanalyst/MatchAnalytics'
import { useMatchAnalysis } from '@/lib/hooks/useMatchAnalysis'
import { PLAYERS, MATCHES } from '@/lib/supabase/mock-data'
import { BarChart3, Video, Settings, Download } from 'lucide-react'

/**
 * MatchAnalystDashboard - Analizza partite dai video
 */
export function MatchAnalystDashboard({ matchId = 'm1' }) {
  const analysis = useMatchAnalysis(matchId)
  const [selectedMatch, setSelectedMatch] = useState(MATCHES.find(m => m.id === matchId))
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)

  // Calcola statistiche
  const allPlayerStats = PLAYERS.map(p => analysis.getPlayerStats(p.id))
  const team1Stats = analysis.getTeamStats('team_a')
  const team2Stats = analysis.getTeamStats('team_b')
  const possessionData = analysis.getPossession('team_a', 'team_b')
  const timelineData = analysis.getTimeline()

  const handleExport = () => {
    const data = analysis.exportAnalysis()
    const jsonStr = JSON.stringify(data, null, 2)
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr))
    element.setAttribute('download', `match_analysis_${matchId}.json`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleSaveToDatabase = async () => {
    setIsSaving(true)
    setSaveStatus('Salvando...')
    const result = await analysis.saveToDatabase(
      selectedMatch?.team || 'vanguard-xi',
      selectedMatch?.opponent || 'Unknown'
    )
    setSaveStatus(result.message)
    setIsSaving(false)
    setTimeout(() => setSaveStatus(null), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-[#D4AF37]" />
          Match Analyst
        </h1>
        <p className="text-muted-foreground">
          {selectedMatch ? `${selectedMatch.opponent_logo} ${selectedMatch.opponent}` : 'Analizza le tue partite'}
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">Upload</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" disabled={!analysis.videoUrl} className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Tracker</span>
          </TabsTrigger>
          <TabsTrigger value="stats" disabled={analysis.events.length === 0} className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Statistiche</span>
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="mt-6 space-y-6">
          <VideoUploader onVideoUpload={analysis.handleVideoUpload} videoUrl={analysis.videoUrl} />

          {analysis.videoUrl && (
            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-sm">ℹ️ Come Usare</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <ol className="space-y-2 list-decimal list-inside">
                    <li>🎬 Video caricato con successo</li>
                    <li>📍 Vai al tab "Tracker" per marcare gli eventi</li>
                    <li>🎯 Usa il player: play/pause, velocità, volume</li>
                    <li>➕ Clicca "Marca Evento" quando accade un'azione</li>
                    <li>📊 Vai a "Statistiche" per visualizzare i risultati</li>
                  </ol>
                  <p className="font-semibold text-[#D4AF37] pt-2">
                    Supportati: Passaggi, Tiri, Intercetti, Tackle, Dribbling, Falli, Gol, Parate
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <VideoPlayer
                videoUrl={analysis.videoUrl}
                currentTime={analysis.currentTime}
                duration={analysis.duration}
                isPlaying={analysis.isPlaying}
                onTimeUpdate={analysis.setCurrentTime}
                onDurationChange={analysis.setDuration}
                onPlayPause={analysis.setIsPlaying}
                onEventMark={time => {
                  // Ready to mark event
                }}
              />
            </div>

            {/* Event Marker */}
            <div>
              <EventMarker
                currentTime={analysis.currentTime}
                onAddEvent={analysis.addEvent}
                events={analysis.events}
              />
            </div>
          </div>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="mt-6 space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Analisi della Partita</h2>
                <p className="text-sm text-muted-foreground">{analysis.events.length} eventi tracciati</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveToDatabase}
                  disabled={analysis.events.length === 0 || isSaving}
                >
                  {isSaving ? '💾 Salvando...' : '💾 Salva su DB'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleExport}
                  disabled={analysis.events.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Esporta JSON
                </Button>
              </div>
            </div>

            {saveStatus && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-500 text-sm">
                ✅ {saveStatus}
              </div>
            )}
          </div>

          <MatchAnalytics
            team1Stats={team1Stats}
            team2Stats={team2Stats}
            allPlayerStats={allPlayerStats}
            possessionData={possessionData}
            timelineData={timelineData}
          />
        </TabsContent>
      </Tabs>

      {/* Summary Stats */}
      {analysis.events.length > 0 && (
        <Card className="bg-gradient-to-r from-[#D4AF37]/10 to-white/5 border-white/20">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[#D4AF37]">{analysis.events.length}</div>
                <div className="text-xs text-muted-foreground">Totale Eventi</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{team1Stats?.passes || 0}</div>
                <div className="text-xs text-muted-foreground">Passaggi Totali</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{team1Stats?.goals || 0}</div>
                <div className="text-xs text-muted-foreground">Gol Segnati</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">{possessionData?.team1 || 0}%</div>
                <div className="text-xs text-muted-foreground">Possesso Palla</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
