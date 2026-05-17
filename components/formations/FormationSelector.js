'use client'
import { useState } from 'react'
import { FORMATION_TEMPLATES } from '@/lib/supabase/mock-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * FormationSelector - Choose formation for the match
 */
export function FormationSelector({ selectedFormation, onSelect, disabled = false }) {
  const formations = Object.entries(FORMATION_TEMPLATES)

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold mb-2">Choose Formation</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Select your tactical setup for this match
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {formations.map(([code, template]) => (
          <button
            key={code}
            onClick={() => onSelect(code)}
            disabled={disabled}
            className={`p-3 rounded border-2 transition-all text-left ${
              selectedFormation === code
                ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                : 'border-white/10 bg-white/[0.02] hover:border-white/20'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="font-semibold text-sm">{template.name}</div>
            <div className="text-xs text-muted-foreground">{template.description}</div>
            <div className="text-xs text-[#D4AF37] mt-1 font-mono">
              {code}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
