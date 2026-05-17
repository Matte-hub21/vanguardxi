import { UpcomingMatches } from '@/components/dashboard/UpcomingMatches'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { PlayerAvailability } from '@/components/dashboard/PlayerAvailability'
import { Announcements } from '@/components/dashboard/Announcements'
import { TeamStats } from '@/components/dashboard/TeamStats'
import { LivePresence } from '@/components/dashboard/LivePresence'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">Command Center</div>
          <h1 className="font-display text-3xl lg:text-4xl font-black mt-1">
            Welcome back, <span className="gold-text">Captain</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Here’s what’s happening with Vanguard XI today.</p>
        </div>
        <div className="glass rounded-lg px-4 py-2 text-xs">
          <span className="text-muted-foreground">Season · </span>
          <span className="text-[#D4AF37] font-semibold">FC 26 Premier Division</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        <TeamStats />
        <UpcomingMatches />
        <RecentActivity />
        <PlayerAvailability />
        <LivePresence />
        <Announcements />
      </div>
    </div>
  )
}
