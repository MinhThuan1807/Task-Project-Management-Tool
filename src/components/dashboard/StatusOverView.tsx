'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, FolderKanban, Calendar, CheckCircle2, Users } from 'lucide-react'
import { useAllProjects } from '@/lib/hooks/useProjects'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/lib/features/auth/authSlice'
import { useQueries } from '@tanstack/react-query'
import { sprintsByProjectOptions } from '@/lib/queries/sprint.queries'
import { Sprint } from '@/lib/types'

const StatusOverview = () => {
  const { data: projects = []} = useAllProjects()
  const currentUser = useSelector(selectCurrentUser)
  const ownedProjects =
    projects?.filter((project) => project.ownerId === currentUser?._id) || []
  
  const sprintsQueries = useQueries({
    queries: projects.map((project) => {
      const options = sprintsByProjectOptions(project._id)
      return {
        ...options,
        enabled: !!project._id
      }
    }),
  })

  const countActiveSprints = sprintsQueries.reduce((total, query) => {
    const sprints = query.data || []
    return total + sprints.filter((sprint: Sprint) => sprint.status === 'active').length
  }, 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Total Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">{projects.length}</div>
            <FolderKanban className="w-8 h-8 opacity-80" />
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm opacity-90">
            <TrendingUp className="w-4 h-4" />
            <span>+2 this month</span>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Active Sprints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">{countActiveSprints}</div>
            <Calendar className="w-8 h-8 opacity-80" />
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm opacity-90">
            <TrendingUp className="w-4 h-4" />
            <span>3 ending soon</span>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-xl transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Completed Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">56</div>
            <CheckCircle2 className="w-8 h-8 opacity-80" />
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm opacity-90">
            <TrendingUp className="w-4 h-4" />
            <span>+24 this week</span>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-xl transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">
              {ownedProjects.reduce((total, p) => total + p.members.length, 0)}
            </div>
            <Users className="w-8 h-8 opacity-80" />
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm opacity-90">
            <TrendingUp className="w-4 h-4" />
            <span>Across 3 projects</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StatusOverview
