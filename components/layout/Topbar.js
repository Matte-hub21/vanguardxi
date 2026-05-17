'use client'
import { Bell, Search, LogOut, Menu, Radio } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useUser } from '@/lib/hooks/useUser'
import { usePresence } from '@/lib/hooks/usePresence'
import { signOut } from '@/lib/auth-helpers'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'

export function Topbar({ onMenu }) {
  const { user } = useUser()
  const { onlineCount } = usePresence()
  const router = useRouter()
  const initials = (user?.user_metadata?.full_name || 'GX').split(' ').map(s => s[0]).slice(0,2).join('')

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-white/5 bg-[#0a0a0d]/70 backdrop-blur-xl">
      <div className="h-full px-4 lg:px-6 flex items-center gap-4">
        <button onClick={onMenu} className="lg:hidden p-2 rounded-md hover:bg-white/5">
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search players, matches, tournaments..." className="pl-9 bg-white/[0.03] border-white/5 focus-visible:ring-[#D4AF37]/30" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="hidden md:inline-flex gap-2 border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/5">
            <Radio className="h-3 w-3 animate-pulse" /> Live · {onlineCount} online
          </Badge>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#D4AF37]" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-white/5 transition">
                <Avatar className="h-8 w-8 border border-[#D4AF37]/30">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold">{initials}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-semibold leading-tight">{user?.user_metadata?.full_name || 'Captain'}</div>
                  <div className="text-[10px] text-muted-foreground">Captain · VGD</div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#0e0e12] border-white/10">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={async () => { await signOut(); router.push('/login') }} className="text-red-400">
                <LogOut className="h-4 w-4 mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
