'use client'
import { useState } from 'react'
import { CallupCreator } from './CallupCreator'
import { CallupList } from './CallupList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRole } from '@/lib/hooks/useRole'

/**
 * CallupManager - Complete squad callup management interface
 * Shows different views for captains (create) vs players (view)
 */
export function CallupManager({ matchId, userPlayerId }) {
  const { isCaptain } = useRole()
  const [activeTab, setActiveTab] = useState(isCaptain() ? 'create' : 'view')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCallupSaved = () => {
    // Refresh the callup list
    setRefreshKey(k => k + 1)
    setActiveTab('view')
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          {isCaptain() && <TabsTrigger value="create">Create Callup</TabsTrigger>}
          <TabsTrigger value="view">{isCaptain() ? 'View' : 'Callups'}</TabsTrigger>
        </TabsList>

        {isCaptain() && (
          <TabsContent value="create" className="mt-4">
            <CallupCreator
              matchId={matchId}
              onSaved={handleCallupSaved}
            />
          </TabsContent>
        )}

        <TabsContent value="view" className="mt-4">
          <CallupList
            key={refreshKey}
            matchId={matchId}
            userPlayerId={userPlayerId}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
