import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Project, User } from '@/lib/types'
import ProjectCardSkeleton from './ProjectCardSkeleton'

const ProjectCard = dynamic(
  () => import('@/app/(dashboard)/projects/components/ProjectCard')
)

interface ProjectCardGridProps {
  projects: Project[];
  handleDirect: (projectId: string) => void;
  currentUser: User;
}

const ProjectCardGrid = ({ projects, handleDirect, currentUser }: ProjectCardGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects?.map((project) => (
        <Suspense key={project._id} fallback={<ProjectCardSkeleton />}>
          <ProjectCard project={project} handleDirect={() => handleDirect(project._id)} currentUser={currentUser} />
        </Suspense>
      ))}
    </div>
  )
}

export default ProjectCardGrid