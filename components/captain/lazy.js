/**
 * Lazy loading wrapper for captain dashboard components
 * Reduces initial bundle size by code-splitting
 */

import dynamic from 'next/dynamic'
import { DashboardSkeleton } from '@/components/common/Skeletons'

export const LazyTeamOverview = dynamic(
  () => import('@/components/captain/TeamOverview'),
  { loading: () => <DashboardSkeleton /> }
)

export const LazyMatchManagement = dynamic(
  () => import('@/components/captain/MatchManagement'),
  { loading: () => <DashboardSkeleton /> }
)

export const LazyPlayerManagement = dynamic(
  () => import('@/components/captain/PlayerManagement'),
  { loading: () => <DashboardSkeleton /> }
)

export const LazySquadAnalytics = dynamic(
  () => import('@/components/captain/SquadAnalytics'),
  { loading: () => <DashboardSkeleton /> }
)

export const LazySettings = dynamic(
  () => import('@/components/captain/Settings'),
  { loading: () => <DashboardSkeleton /> }
)
