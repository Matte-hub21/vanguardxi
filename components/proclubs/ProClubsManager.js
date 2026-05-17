'use client'
import { useState } from 'react'
import { ProClubsLinker } from './ProClubsLinker'
import { ProClubsStats } from './ProClubsStats'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RoleGuard } from '@/components/layout/RoleGuard'

/**
 * ProClubsManager - Complete Pro Clubs linking and viewing interface
 * Captain-only feature to link and manage EA Sports Pro Clubs club
 */
export function ProClubsManager() {
  const [linkedClubId, setLinkedClubId] = useState(null)
  const [activeTab, setActiveTab] = useState(linkedClubId ? 'stats' : 'link')

  const handleClubLinked = (club) => {
    setLinkedClubId(club.id)
    setActiveTab('stats')
  }

  const handleUnlink = () => {
    setLinkedClubId(null)
    setActiveTab('link')
  }

  return (
    <RoleGuard requiredRole="captain" fallback={
      <div className="text-sm text-muted-foreground">
        Only captains can manage Pro Clubs linking.
      </div>
    }>
      <div className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Link Club</TabsTrigger>
            <TabsTrigger value="stats" disabled={!linkedClubId}>Club Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="mt-4">
            <ProClubsLinker onLinked={handleClubLinked} />
          </TabsContent>

          {linkedClubId && (
            <TabsContent value="stats" className="mt-4">
              <ProClubsStats clubId={linkedClubId} onUnlink={handleUnlink} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </RoleGuard>
  )
}
