import { Skeleton } from '@/components/ui/skeleton'

export default function BoardViewSkeleton() {
  return (
    <div className="flex gap-4 h-full min-w-max overflow-auto p-6">
      {[1, 2, 3, 4].map((col) => (
        <div
          key={col}
          className="pt-5 flex-shrink-0 w-80 flex flex-col"
        >
          {/* Column header skeleton */}
          <div className="bg-gray-100 px-4 py-3 rounded-t-lg shadow-sm border-b-2 border-gray-300 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          </div>
          {/* Column body skeleton */}
          <div className="flex-1 bg-white border-l-2 border-r-2 border-b-2 border-gray-200 rounded-b-lg min-h-[500px] shadow-sm">
            <div className="h-full overflow-auto">
              <div className="p-3 space-y-3">
                {[1, 2, 3].map((task) => (
                  <div
                    key={task}
                    className="border border-gray-200 shadow-sm rounded-lg bg-white p-4 space-y-2"
                  >
                    {/* TaskCard header */}
                    <div className="flex items-start gap-2 mb-2">
                      <Skeleton className="w-4 h-4" />
                      <Skeleton className="h-4 w-32 flex-1" />
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                    {/* TaskCard description */}
                    <Skeleton className="h-3 w-40 mb-2" />
                    {/* TaskCard badges */}
                    <div className="flex gap-2 mb-2">
                      <Skeleton className="h-4 w-12 rounded-full" />
                      <Skeleton className="h-4 w-8 rounded-full" />
                    </div>
                    {/* TaskCard due date */}
                    <Skeleton className="h-3 w-24 mb-2" />
                    {/* TaskCard footer */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex -space-x-2">
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="w-6 h-6 rounded-full" />
                      </div>
                      <div className="flex gap-3">
                        <Skeleton className="h-3 w-8" />
                        <Skeleton className="h-3 w-8" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}