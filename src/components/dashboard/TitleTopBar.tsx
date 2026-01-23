'use client'
import { Badge } from '../ui/badge'
import { useAllProjects } from '@/lib/hooks/useProjects'
import { useParams } from 'next/navigation'

function TitleTopBar() {
  const param = useParams()
  const { data: allProjects, isLoading: projectsLoading } = useAllProjects()
  const selectedProjectId = param.id as string
  const selectedProject = allProjects.find(
    (p) => p._id === selectedProjectId || p._id === selectedProjectId
  )
  const getViewTitle = () => {
    switch (param.view) {
    case 'dashboard':
      return 'Dashboard'
    case 'chat':
      return 'Chat'
    case 'backlog':
      return 'Product Backlog'
    case 'sprint':
      return 'Sprint Board'
    case 'profile':
      return 'Profile'
    case 'security':
      return 'Security'
    default:
      return selectedProject?.name || 'Sprintos'
    }
  }
  return (
    <div className="flex items-center gap-3">
      <h2 className="text-xl text-gray-900">{getViewTitle()}</h2>
      {selectedProject && (
        <Badge variant="outline" className="text-xs">
          {selectedProject.status}
        </Badge>
      )}
    </div>
  )
}

export default TitleTopBar
