'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/common/Logo'
import { signInWithDiscord } from '@/lib/auth-helpers'
import { Shield, Zap, Trophy, Users } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDiscord = async () => {
    setLoading(true)
    try {
      await signInWithDiscord('/dashboard')
      toast.success('Welcome back, Captain.')
      // In mock mode, session is set synchronously — just navigate.
      setTimeout(() => router.push('/dashboard'), 300)
    } catch (e) {
      toast.error('Sign in failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background grid-bg relative overflow-hidden">
      <div className="absolute inset-0 radial-gold" />
      <div className="absolute top-1/3 -left-32 h-96 w-96 rounded-full bg-[#D4AF37]/10 blur-[120px]" />
      <div className="absolute bottom-0 -right-32 h-96 w-96 rounded-full bg-[#D4AF37]/5 blur-[140px]" />

      <div className="relative min-h-screen grid lg:grid-cols-2">
        {/* Left: branding */}
        <div className="hidden lg:flex flex-col justify-between p-12">
          <Logo size="lg" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]/80 mb-3">EA Sports FC 26 · Pro Clubs</div>
            <h1 className="font-display text-5xl xl:text-6xl font-black leading-[0.95]">
              <span className="text-white">Forged</span>{' '}<span className="gold-text">in Gold.</span>
              <br />
              <span className="text-white">Built to</span>{' '}<span className="gold-text">Dominate.</span>
            </h1>
            <p className="mt-6 max-w-md text-muted-foreground">
              The official command center for Vanguard XI. Track matches, manage your squad, analyze every play.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-4 max-w-md">
              {[
                { icon: Trophy, label: '24 Wins', sub: 'this season' },
                { icon: Users, label: '14 Players', sub: 'active roster' },
                { icon: Zap, label: 'Real-time', sub: 'sync engine' },
                { icon: Shield, label: 'Tier 1', sub: 'security' },
              ].map((f, i) => {
                const Icon = f.icon
                return (
                  <div key={i} className="glass rounded-xl p-4">
                    <Icon className="h-5 w-5 text-[#D4AF37]" />
                    <div className="mt-2 font-display font-bold text-white">{f.label}</div>
                    <div className="text-xs text-muted-foreground">{f.sub}</div>
                  </div>
                )
              })}
            </div>
          </motion.div>
          <div className="text-xs text-muted-foreground">© 2025 Vanguard XI Esports · All rights reserved</div>
        </div>

        {/* Right: login card */}
        <div className="flex items-center justify-center p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="lg:hidden mb-8 flex justify-center"><Logo size="lg" /></div>
            <div className="glass-strong rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[#D4AF37]/20 blur-3xl" />
              <div className="relative">
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">Access portal</div>
                <h2 className="mt-2 font-display text-3xl font-bold">Enter HQ</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sign in with Discord to access your Pro Clubs dashboard, matchroom and team stats.
                </p>

                <Button
                  onClick={handleDiscord}
                  disabled={loading}
                  className="mt-8 w-full h-12 bg-[#5865F2] hover:bg-[#4752c4] text-white font-semibold text-base shadow-lg shadow-[#5865F2]/20"
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                  {loading ? 'Connecting...' : 'Continue with Discord'}
                </Button>

                <div className="mt-4 text-center text-[11px] text-muted-foreground">
                  Secured by Supabase Auth · Discord OAuth
                </div>

                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/5" />
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Team Members Only</span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="text-xs text-muted-foreground leading-relaxed">
                  By continuing you accept the Vanguard XI code of conduct and competitive integrity policy. Match data is synced in real time across all team devices.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
