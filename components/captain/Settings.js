'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProClubsManager } from '@/components/proclubs/ProClubsManager'
import { Settings as SettingsIcon, Bell, Lock, Palette, Gamepad2 } from 'lucide-react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

/**
 * Settings - Team and account settings for captain
 */
export function Settings() {
  return (
    <Tabs defaultValue="team" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="team" className="flex items-center gap-2">
          <SettingsIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Team</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Alerts</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          <span className="hidden sm:inline">Security</span>
        </TabsTrigger>
        <TabsTrigger value="proclubs" className="flex items-center gap-2">
          <Gamepad2 className="h-4 w-4" />
          <span className="hidden sm:inline">Pro Clubs</span>
        </TabsTrigger>
      </TabsList>

      {/* Team Settings */}
      <TabsContent value="team" className="mt-4 space-y-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-[#D4AF37]" />
              Team Settings
            </CardTitle>
            <CardDescription>Manage your team information and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-semibold block mb-2">Team Name</label>
              <input
                type="text"
                defaultValue="Vanguard XI"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-foreground"
                disabled
              />
              <p className="text-xs text-muted-foreground mt-1">Contact support to change team name</p>
            </div>

            <div>
              <label className="text-sm font-semibold block mb-2">Team Motto</label>
              <input
                type="text"
                defaultValue="Forged in Gold"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-foreground"
              />
            </div>

            <div>
              <label className="text-sm font-semibold block mb-2">Team Tag</label>
              <input
                type="text"
                defaultValue="VGD"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-foreground"
                disabled
              />
            </div>

            <Button className="bg-[#D4AF37] text-black hover:bg-[#e6c200]">Save Changes</Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Notifications */}
      <TabsContent value="notifications" className="mt-4">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#D4AF37]" />
              Notifications
            </CardTitle>
            <CardDescription>Control how you receive team updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Match Announcements', desc: 'Get notified about new matches' },
              { label: 'Squad Callups', desc: 'Notify players when they are called up' },
              { label: 'Formation Changes', desc: 'Alert when lineup is modified' },
              { label: 'Player Updates', desc: 'Updates on player status and injuries' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white/[0.02] rounded border border-white/10">
                <div>
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Security */}
      <TabsContent value="security" className="mt-4 space-y-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-[#D4AF37]" />
              Security
            </CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded border border-white/10">
              <div>
                <div className="font-medium text-sm">Password</div>
                <div className="text-xs text-muted-foreground">Last changed 3 months ago</div>
              </div>
              <Button variant="outline" className="text-xs">Change</Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded border border-white/10">
              <div>
                <div className="font-medium text-sm">Two-Factor Auth</div>
                <div className="text-xs text-muted-foreground">Not enabled</div>
              </div>
              <Button variant="outline" className="text-xs">Enable</Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded border border-white/10">
              <div>
                <div className="font-medium text-sm">Active Sessions</div>
                <div className="text-xs text-muted-foreground">1 session active</div>
              </div>
              <Button variant="outline" className="text-xs">View</Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="bg-red-500/10 border-red-500/20">
          <CardHeader>
            <CardTitle className="text-red-400">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 bg-red-500/5 rounded border border-red-500/20">
              <div>
                <div className="font-medium text-sm text-red-300">Leave Team</div>
                <div className="text-xs text-red-200/60">Remove yourself from the squad</div>
              </div>
              <Button variant="outline" className="text-xs border-red-500/30 text-red-400 hover:bg-red-500/10">
                Leave
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Pro Clubs */}
      <TabsContent value="proclubs" className="mt-4">
        <ProClubsManager />
      </TabsContent>
    </Tabs>
  )
}
