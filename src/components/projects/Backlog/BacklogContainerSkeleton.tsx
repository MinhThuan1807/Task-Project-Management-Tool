import { Skeleton } from '@/components/ui/skeleton'

export default function BacklogContainerSkeleton() {
  return (
    <div className="flex h-full">
      {/* Main backlog area skeleton */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-white border-b border-gray-200 shrink-0">
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-10 w-full" />
        </div>
        {/* Task list */}
        <div className="flex-1 p-6 space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      </div>
      {/* Sprint planning sidebar skeleton */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex-1 p-6 space-y-6">
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-4 w-full" />
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
