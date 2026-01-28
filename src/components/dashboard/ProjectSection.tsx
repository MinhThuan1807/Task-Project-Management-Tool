'use client'
import { useDispatch, useSelector } from 'react-redux'
import { Plus } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { useAllProjects } from '@/lib/hooks/useProjects'
import { openCreateModal } from '@/lib/features/project/projectSlice'
import { useRouter } from 'next/navigation'
import ProjectCardGrid from '../projects/ProjectCardGrid'
import { selectCurrentUser } from '@/lib/features/auth/authSlice'

function ProjectSection() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('all')
  const dispatch = useDispatch()
  const { data: projects } = useAllProjects()
  const currentUser = useSelector(selectCurrentUser)
  if(!currentUser) return null

  const ownedProjects =
    projects?.filter((project) => project.ownerId === currentUser?._id) || []

  const activeProjects = projects?.filter((project) =>
    project.members.some(
      (member) =>
        member.memberId === currentUser?._id && member.status === 'active'
    )
  )
  const joinedProjectsActive =
    projects?.filter((project) => project.ownerId !== currentUser?._id) || []

  const handleDirect = (projectId: string) => {
    router.push(`/projects/${projectId}`)
  }
  return (
    <div>
      <Card className="border-0 shadow-lg mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Projects
              </CardTitle>
              <CardDescription>Manage and track your projects</CardDescription>
            </div>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => dispatch(openCreateModal())}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">
                All Projects ({projects?.length})
              </TabsTrigger>
              <TabsTrigger value="my">
                My Projects ({ownedProjects.length})
              </TabsTrigger>
              <TabsTrigger value="participating">
                Participating({joinedProjectsActive.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <ProjectCardGrid
                projects={activeProjects || []}
                handleDirect={handleDirect}
                currentUser={currentUser}
              />
            </TabsContent>

            <TabsContent value="my" className="space-y-4">
              <ProjectCardGrid
                projects={ownedProjects}
                handleDirect={handleDirect}
                currentUser={currentUser}
              />
            </TabsContent>

            <TabsContent value="participating" className="space-y-4">
              <ProjectCardGrid
                projects={joinedProjectsActive || []}
                handleDirect={handleDirect}
                currentUser={currentUser}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProjectSection
