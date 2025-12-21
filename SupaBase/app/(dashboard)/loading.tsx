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

      {/* Loading Spinner */}
      <Loading size="lg" message="Loading dashboard..." />
    </div>
  )
}

