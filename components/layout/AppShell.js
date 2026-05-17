'use client'
import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { AuthGuard } from './AuthGuard'
import { Sheet, SheetContent } from '@/components/ui/sheet'

export function AppShell({ children }) {
  const [open, setOpen] = useState(false)
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background relative">
        <div className="pointer-events-none fixed inset-0 grid-bg opacity-50" />
        <div className="pointer-events-none fixed inset-0 radial-gold" />
        <div className="relative flex min-h-screen">
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="left" className="p-0 w-[260px] bg-[#0a0a0d] border-white/5">
              <Sidebar onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="flex-1 flex flex-col min-w-0">
            <Topbar onMenu={() => setOpen(true)} />
            <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">{children}</main>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
