import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card'

const SprintCalendarViewSkeleton = () => (
  <div className="flex-1 p-6 overflow-auto">
    <Card className="border-0 shadow-lg max-w-7xl mx-auto animate-pulse">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            <div className="h-6 w-32 bg-gray-200 rounded" />
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-gray-100 rounded" />
            <div className="h-10 w-16 bg-gray-100 rounded" />
            <div className="h-10 w-10 bg-gray-100 rounded" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {/* Week day headers */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="py-2">
              <div className="h-4 w-10 bg-gray-100 rounded mx-auto" />
            </div>
          ))}
          {/* Calendar days skeleton */}
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="min-h-[120px] border rounded-lg p-2 bg-gray-50"
            >
              <div className="h-5 w-5 bg-gray-200 rounded-full mb-2" />
              <div className="space-y-1">
                <div className="h-4 w-3/4 bg-gray-100 rounded" />
                <div className="h-4 w-2/3 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
        {/* Legend skeleton */}
        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-200">
          <div className="h-4 w-24 bg-gray-100 rounded" />
          <div className="h-4 w-32 bg-gray-100 rounded" />
          <div className="flex items-center gap-4 ml-auto">
            <div className="h-4 w-16 bg-gray-100 rounded" />
            <div className="h-4 w-16 bg-gray-100 rounded" />
            <div className="h-4 w-16 bg-gray-100 rounded" />
            <div className="h-4 w-16 bg-gray-100 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)

export default SprintCalendarViewSkeleton