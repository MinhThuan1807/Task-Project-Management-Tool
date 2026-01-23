import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Project } from '@/lib/types'
import ProjectCardSkeleton from './ProjectCardSkeleton'

const ProjectCard = dynamic(
  () => import('@/app/(dashboard)/projects/components/ProjectCard')
)

interface ProjectCardGridProps {
  projects: Project[];
  handleDirect: (projectId: string) => void;
}

const ProjectCardGrid = ({ projects, handleDirect }: ProjectCardGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Suspense key={project._id} fallback={<ProjectCardSkeleton />}>
          <ProjectCard project={project} handleDirect={() => handleDirect(project._id)} />
        </Suspense>
      ))}
    </div>
  )
}

export default ProjectCardGrid