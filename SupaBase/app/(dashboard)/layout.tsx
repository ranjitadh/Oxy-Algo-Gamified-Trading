import Navigation from '@/components/Navigation'
import NavigationProgress from '@/components/NavigationProgress'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Navigation Progress Bar */}
      <NavigationProgress />
      
      {/* Animated background effects */}
      <div className="animated-grid"></div>
      <div className="particle-bg"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <Navigation />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}



