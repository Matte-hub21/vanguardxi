'use client'
import { useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, Volume2 } from 'lucide-react'

/**
 * VideoPlayer - Player con timeline e controlli
 */
export function VideoPlayer({
  videoUrl,
  currentTime,
  duration,
  isPlaying,
  onTimeUpdate,
  onDurationChange,
  onPlayPause,
  onEventMark,
}) {
  const videoRef = useRef(null)

  // Sincronizza video con state
  useEffect(() => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.play()
    } else {
      videoRef.current.pause()
    }
  }, [isPlaying])

  // Aggiorna currentTime quando cambia
  useEffect(() => {
    if (videoRef.current && videoRef.current.currentTime !== currentTime) {
      videoRef.current.currentTime = currentTime
    }
  }, [currentTime])

  const handleTimeChange = e => {
    const time = parseFloat(e.target.value)
    onTimeUpdate(time)
  }

  const handleVideoTimeUpdate = () => {
    onTimeUpdate(videoRef.current.currentTime)
  }

  const handleDurationLoad = () => {
    onDurationChange(videoRef.current.duration)
  }

  const formatTime = seconds => {
    if (!seconds) return '0:00'
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : `${m}:${s.toString().padStart(2, '0')}`
  }

  const progressPercent = duration ? (currentTime / duration) * 100 : 0

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle>Video Partita</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {videoUrl ? (
          <>
            {/* Video */}
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                src={videoUrl}
                onTimeUpdate={handleVideoTimeUpdate}
                onLoadedMetadata={handleDurationLoad}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Controlli */}
            <div className="space-y-3">
              {/* Timeline */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleTimeChange}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer hover:bg-white/20 transition-colors"
                  style={{
                    background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${progressPercent}%, rgba(255,255,255,0.1) ${progressPercent}%, rgba(255,255,255,0.1) 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control buttons */}
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPlayPause(!isPlaying)}
                  className="w-10 h-10 p-0"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                {/* Velocità */}
                <select
                  value="1"
                  onChange={e => {
                    if (videoRef.current) videoRef.current.playbackRate = parseFloat(e.target.value)
                  }}
                  className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1 text-foreground"
                >
                  <option value="0.5">0.5x</option>
                  <option value="1">1x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                </select>

                {/* Volume */}
                <div className="flex items-center gap-2 ml-auto">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    defaultValue="1"
                    onChange={e => {
                      if (videoRef.current) videoRef.current.volume = parseFloat(e.target.value)
                    }}
                    className="w-16 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Mark Event */}
                <Button
                  size="sm"
                  className="ml-3 bg-[#D4AF37] text-black hover:bg-[#e6c200]"
                  onClick={() => onEventMark(currentTime)}
                >
                  Marca Evento @ {formatTime(currentTime)}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Carica un video per iniziare l'analisi</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
