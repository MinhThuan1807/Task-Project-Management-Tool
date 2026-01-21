const ProjectCardSkeleton = () => (
  <div className="animate-pulse rounded-lg bg-white shadow-md p-6 flex flex-col gap-4">
    <div className="flex items-start justify-between mb-2">
      <div className="w-12 h-12 rounded-full bg-gray-200" />
      <div className="w-8 h-8 rounded bg-gray-200" />
    </div>
    <div className="h-5 w-2/3 bg-gray-200 rounded mb-2" />
    <div className="h-4 w-full bg-gray-100 rounded mb-4" />
    <div className="h-3 w-1/2 bg-gray-100 rounded mb-2" />
    <div className="flex items-center justify-between">
      <div className="h-4 w-20 bg-gray-100 rounded" />
      <div className="h-4 w-16 bg-gray-100 rounded" />
    </div>
    <div className="flex items-center justify-between pt-2 border-t mt-4">
      <div className="h-6 w-16 bg-gray-100 rounded" />
      <div className="h-6 w-24 bg-gray-100 rounded" />
    </div>
  </div>
);

export default ProjectCardSkeleton;