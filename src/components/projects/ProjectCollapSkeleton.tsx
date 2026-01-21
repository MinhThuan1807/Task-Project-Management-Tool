const ProjectCollapSkeleton = () => (
  <div className="flex flex-col gap-2 px-2 py-2">
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded-full bg-gray-200" />
      <div className="h-4 w-24 bg-gray-200 rounded" />
    </div>
    <div className="ml-6 flex flex-col gap-1">
      <div className="h-3 w-20 bg-gray-100 rounded" />
      <div className="h-3 w-20 bg-gray-100 rounded" />
      <div className="h-3 w-20 bg-gray-100 rounded" />
    </div>
  </div>
);

export default ProjectCollapSkeleton;