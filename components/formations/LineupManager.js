'use client'
import { useState } from 'react'
import { FormationSelector } from './FormationSelector'
import { FormationBuilder } from './FormationBuilder'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

/**
 * LineupManager - Complete formation + lineup setup interface
 */
export function LineupManager({ matchId, onClose, onSaved }) {
  const [step, setStep] = useState('formation') // formation | builder | confirm
  const [selectedFormation, setSelectedFormation] = useState('4-3-3')
  const [formationData, setFormationData] = useState(null)

  const handleFormationSelect = (code) => {
    setSelectedFormation(code)
    setStep('builder')
  }

  const handleFormationSave = async (data) => {
    setFormationData(data)
    setStep('confirm')
  }

  const handleConfirmSave = async () => {
    try {
      const response = await fetch('/api/formations/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formationData),
      })

      if (!response.ok) throw new Error('Failed to save formation')

      const result = await response.json()
      onSaved?.(result)
      setStep('formation')
    } catch (error) {
      console.error('Error saving formation:', error)
    }
  }

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        {step !== 'formation' && (
          <button
            onClick={() => step === 'confirm' ? setStep('builder') : setStep('formation')}
            className="flex items-center gap-1 text-sm text-[#D4AF37] hover:text-[#e6c200]"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        )}
        <div className="text-sm text-muted-foreground">
          {step === 'formation' && 'Step 1/3 - Choose Formation'}
          {step === 'builder' && 'Step 2/3 - Place Players'}
          {step === 'confirm' && 'Step 3/3 - Review & Save'}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Close
          </button>
        )}
      </div>

      {/* Content */}
      <div>
        {step === 'formation' && (
          <FormationSelector
            selectedFormation={selectedFormation}
            onSelect={handleFormationSelect}
          />
        )}

        {step === 'builder' && (
          <FormationBuilder
            matchId={matchId}
            formationCode={selectedFormation}
            onSave={handleFormationSave}
          />
        )}

        {step === 'confirm' && formationData && (
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
              <div>
                <div className="text-xs text-muted-foreground">FORMATION</div>
                <div className="font-semibold text-[#D4AF37]">{selectedFormation}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">PLAYERS POSITIONED</div>
                <div className="font-semibold">{formationData.players_count} players</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">STATUS</div>
                <div className="font-semibold text-green-500">Ready to Save</div>
              </div>
            </div>

            <Button
              onClick={handleConfirmSave}
              className="w-full bg-[#D4AF37] text-black hover:bg-[#e6c200]"
            >
              Save Formation & Lineup
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
