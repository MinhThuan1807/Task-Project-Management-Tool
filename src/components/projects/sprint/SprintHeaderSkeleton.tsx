import { Skeleton } from '@/components/ui/skeleton'

export default function SprintHeaderSkeleton() {
  return (
    <div className="p-6 bg-white border-b border-gray-200 shadow-sm">
      {/* Sprint title and actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>
      {/* Sprint search and stats */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-6 w-24" />
      </div>
      {/* Progress bar */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-10" />
        </div>
        <Skeleton className="h-2 w-full rounded" />
      </div>
      {/* Toggle group */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-24 rounded" />
        <Skeleton className="h-8 w-24 rounded" />
        <Skeleton className="h-8 w-24 rounded" />
      </div>
    </div>
  )
}