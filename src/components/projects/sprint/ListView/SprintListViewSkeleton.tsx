import { Card, CardContent } from '../../../ui/card'

const SkeletonItem = () => (
  <Card className="border-0 shadow-md animate-pulse">
    <CardContent className="p-4">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
      <div className="h-3 bg-gray-100 rounded w-2/3 mb-2" />
      <div className="flex gap-2 mb-2">
        <div className="h-4 w-16 bg-gray-100 rounded" />
        <div className="h-4 w-10 bg-gray-100 rounded" />
        <div className="h-4 w-12 bg-gray-100 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-8 bg-gray-200 rounded-full" />
        <div className="h-8 w-8 bg-gray-100 rounded-full" />
      </div>
    </CardContent>
  </Card>
)

const SprintListViewSkeleton = () => (
  <div className="flex-1 p-6 overflow-auto">
    <div className="max-w-6xl mx-auto space-y-3">
      {Array.from({ length: 5 }).map((_, idx) => (
        <SkeletonItem key={idx} />
      ))}
    </div>
  </div>
)

export default SprintListViewSkeleton