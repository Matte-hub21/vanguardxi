'use client'
import { useState, useEffect } from 'react'
import { useProClubs } from '@/lib/hooks/useProClubs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Search, Link, CheckCircle2, AlertCircle } from 'lucide-react'

/**
 * ProClubsLinker - Search and link EA Sports Pro Clubs
 */
export function ProClubsLinker({ onLinked }) {
  const { searchClubs, linkClub, searchResults, linkedClub, searching, linking, error, clearSearch } = useProClubs()
  const [searchInput, setSearchInput] = useState('')
  const [selectedClub, setSelectedClub] = useState(null)

  // Auto-search when input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.length >= 2) {
        searchClubs(searchInput)
      } else {
        clearSearch()
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput, searchClubs, clearSearch])

  const handleLinkClub = async (club) => {
    try {
      const result = await linkClub(club.id)
      onLinked?.(result)
      setSearchInput('')
      setSelectedClub(null)
    } catch (err) {
      // Error handled by hook
    }
  }

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Header */}
      <div>
        <h3 className="font-bold text-[#D4AF37] mb-1">Link Pro Clubs Club</h3>
        <p className="text-xs text-muted-foreground">
          Connect your EA Sports Pro Clubs team to Vanguard XI for stat syncing
        </p>
      </div>

      {/* Linked club display */}
      {linkedClub && (
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <div className="font-bold text-green-300">{linkedClub.name}</div>
                <div className="text-sm text-green-200/70 mt-1">
                  <div>Owner: {linkedClub.owner}</div>
                  <div>Division: {linkedClub.division}</div>
                  <div>Record: {linkedClub.wins}W {linkedClub.draws}D {linkedClub.losses}L</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search box */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-2 block">
          SEARCH CLUB
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Enter club name..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="pl-10 bg-white/5 border-white/10"
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-300">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Loading state */}
      {searching && (
        <div className="flex items-center justify-center py-6">
          <Spinner className="h-5 w-5 text-[#D4AF37]" />
          <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
        </div>
      )}

      {/* Search results */}
      {!searching && searchResults.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">
            SEARCH RESULTS ({searchResults.length})
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {searchResults.map(club => (
              <button
                key={club.id}
                onClick={() => setSelectedClub(club)}
                className={`w-full p-3 rounded border-2 transition-all text-left ${
                  selectedClub?.id === club.id
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <div className="font-semibold">{club.name}</div>
                <div className="text-xs text-muted-foreground mt-1 grid grid-cols-2 gap-2">
                  <div>Owner: {club.owner}</div>
                  <div>Div: {club.division}</div>
                  <div>Record: {club.wins}W-{club.draws}D-{club.losses}L</div>
                  <div>Tag: {club.tag}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!searching && searchInput.length >= 2 && searchResults.length === 0 && (
        <div className="py-6 text-center text-muted-foreground text-sm">
          No clubs found. Try a different name.
        </div>
      )}

      {/* Action buttons */}
      {selectedClub && (
        <div className="space-y-2">
          <Button
            onClick={() => handleLinkClub(selectedClub)}
            disabled={linking}
            className="w-full bg-[#D4AF37] text-black hover:bg-[#e6c200]"
          >
            <Link className="h-4 w-4 mr-2" />
            {linking ? 'Linking...' : 'Link This Club'}
          </Button>
          <Button
            onClick={() => setSelectedClub(null)}
            variant="outline"
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Info box */}
      <div className="bg-white/5 border border-white/10 rounded p-3 text-xs text-muted-foreground space-y-1">
        <div className="font-semibold text-foreground">ℹ️ About Pro Clubs Linking</div>
        <div>• Search for your EA Sports Pro Clubs club by name</div>
        <div>• Link your club to enable automatic stat syncing</div>
        <div>• Only captains can manage club linking</div>
        <div>• Data updates every 6 hours</div>
      </div>
    </div>
  )
}
