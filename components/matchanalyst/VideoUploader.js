'use client'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, Video, CheckCircle } from 'lucide-react'

/**
 * VideoUploader - Upload video della partita
 */
export function VideoUploader({ onVideoUpload, videoUrl }) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = e => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = e => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('video/')) {
      onVideoUpload(file)
    }
  }

  const handleFileSelect = e => {
    const file = e.target.files?.[0]
    if (file?.type.startsWith('video/')) {
      onVideoUpload(file)
    }
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5 text-[#D4AF37]" />
          Upload Video Partita
        </CardTitle>
        <CardDescription>Carica la registrazione della partita per l'analisi</CardDescription>
      </CardHeader>
      <CardContent>
        {videoUrl ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-green-500/20 rounded border border-green-500/30">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium text-green-300">Video caricato con successo</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Carica un altro video
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Drag and drop area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                  : 'border-white/20 bg-white/5 hover:border-[#D4AF37]/50'
              }`}
            >
              <Video className="h-12 w-12 mx-auto mb-3 text-[#D4AF37]/50" />
              <p className="text-sm font-medium mb-1">Trascina il video qui</p>
              <p className="text-xs text-muted-foreground mb-3">oppure</p>
              <label>
                <Input
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button asChild variant="outline" size="sm" className="cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Seleziona file
                  </span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-3">
                Supportati: MP4, WebM, MOV (max 500MB)
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
