import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata = {
  title: 'Vanguard XI — Pro Clubs Esports HQ',
  description: 'EA Sports FC 26 Pro Clubs team management for Vanguard XI',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" translate="no" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="google" content="notranslate" />
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault();return}if(e.error&&(e.error.name==="NotFoundError"||(e.message&&(e.message.includes("removeChild")||e.message.includes("insertBefore"))))){e.stopImmediatePropagation();e.preventDefault();console.warn("Suppressed DOM mutation conflict (likely browser extension or translator)")}},true);window.addEventListener("unhandledrejection",function(e){if(e.reason&&e.reason.name==="NotFoundError"){e.preventDefault()}});'}} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased notranslate" translate="no" suppressHydrationWarning>
        {children}
        <Toaster theme="dark" position="top-right" />
      </body>
    </html>
  )
}
