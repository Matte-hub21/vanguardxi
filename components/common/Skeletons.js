'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

/**
 * PlayerCardSkeleton - Loading skeleton for player cards
 */
export function PlayerCardSkeleton() {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="p-3 space-y-2">
        <div className="flex justify-between items-start">
          <Skeleton className="h-4 w-8 bg-white/10" />
          <Skeleton className="h-5 w-12 bg-white/10" />
        </div>
        <Skeleton className="h-3 w-20 bg-white/10" />
        <Skeleton className="h-4 w-24 bg-white/10" />
        <div className="grid grid-cols-3 gap-1">
          <Skeleton className="h-3 w-16 bg-white/10" />
          <Skeleton className="h-3 w-16 bg-white/10" />
          <Skeleton className="h-3 w-16 bg-white/10" />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * MatchCardSkeleton - Loading skeleton for match cards
 */
export function MatchCardSkeleton() {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-6 w-40 bg-white/10" />
        <Skeleton className="h-4 w-48 bg-white/10" />
        <Skeleton className="h-4 w-32 bg-white/10" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 bg-white/10" />
          <Skeleton className="h-5 w-16 bg-white/10" />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * StatCardSkeleton - Loading skeleton for stat cards
 */
export function StatCardSkeleton() {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="pt-4">
        <Skeleton className="h-8 w-12 bg-white/10 mb-2" />
        <Skeleton className="h-4 w-24 bg-white/10" />
      </CardContent>
    </Card>
  )
}

/**
 * DashboardSkeleton - Full page loading skeleton
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(i => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left panel */}
        <div className="lg:col-span-2 space-y-3">
          {[1, 2, 3].map(i => (
            <MatchCardSkeleton key={i} />
          ))}
        </div>

        {/* Right panel */}
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32 w-full bg-white/10" />
          ))}
        </div>
      </div>
    </div>
  )
}
