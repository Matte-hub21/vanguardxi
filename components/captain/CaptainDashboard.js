'use client'
import { useState } from 'react'
import { useRole } from '@/lib/hooks/useRole'
import { RoleGuard } from '@/components/layout/RoleGuard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LazyTeamOverview,
  LazyMatchManagement,
  LazyPlayerManagement,
  LazySquadAnalytics,
  LazySettings,
} from '@/components/captain/lazy'
import { Users, Calendar, BarChart3, Settings as SettingsIcon, Trophy } from 'lucide-react'

/**
 * Captain Dashboard - Main hub for team management
 */
export function CaptainDashboard() {
  const { isCaptain } = useRole()
  const [activeTab, setActiveTab] = useState('overview')

  if (!isCaptain()) {
    return (
      <RoleGuard requiredRole="captain">
        <div>Loading...</div>
      </RoleGuard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Trophy className="h-8 w-8 text-[#D4AF37]" />
          Captain Hub
        </h1>
        <p className="text-muted-foreground">Manage your squad, matches, and team performance</p>
      </div>

      {/* Main tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="matches" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Matches</span>
          </TabsTrigger>
          <TabsTrigger value="players" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Players</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Stats</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab contents - lazy loaded for performance */}
        <TabsContent value="overview" className="mt-6">
          <LazyTeamOverview />
        </TabsContent>

        <TabsContent value="matches" className="mt-6">
          <LazyMatchManagement />
        </TabsContent>

        <TabsContent value="players" className="mt-6">
          <LazyPlayerManagement />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <LazySquadAnalytics />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <LazySettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
