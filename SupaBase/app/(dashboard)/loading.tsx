import Loading from '@/components/Loading'

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-12 w-64 bg-gray-800/50 rounded-lg animate-pulse mb-2"></div>
          <div className="h-6 w-96 bg-gray-800/30 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Gaming Trading Platform Loader */}
      <div className="flex flex-col items-center justify-center py-20">
        <Loading size="lg" variant="cube" message="Loading trading dashboard..." />
      </div>
    </div>
  )
}

