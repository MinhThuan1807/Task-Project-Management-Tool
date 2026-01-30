const Box = ({ className = '' }: { className?: string }) => (
  <div className={`bg-gray-200 rounded-md ${className} animate-pulse`} />
)

export const StatsCardsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <Box className="h-20" />
    <Box className="h-20" />
    <Box className="h-20" />
  </div>
)

export const BurndownChartSkeleton = () => (
  <div className="h-64 w-full p-4 border rounded-md bg-white">
    <Box className="h-full" />
  </div>
)

export const SprintProgressSkeleton = () => (
  <div className="h-64 w-full p-4 border rounded-md bg-white">
    <Box className="h-full" />
  </div>
)

export const VelocityChartSkeleton = () => (
  <div className="h-64 w-full p-4 border rounded-md bg-white">
    <Box className="h-full" />
  </div>
)

export const MemberDistributionSkeleton = () => (
  <div className="h-64 w-full p-4 border rounded-md bg-white">
    <Box className="h-full" />
  </div>
)

export const InsightsSkeleton = () => (
  <div className="h-40 w-full p-4 border rounded-md bg-white">
    <Box className="h-full" />
  </div>
)

export default {
  StatsCardsSkeleton,
  BurndownChartSkeleton,
  SprintProgressSkeleton,
  VelocityChartSkeleton,
  MemberDistributionSkeleton,
  InsightsSkeleton
}
