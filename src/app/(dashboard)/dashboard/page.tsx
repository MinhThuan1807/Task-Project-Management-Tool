import ProjectSection from '@/components/dashboard/ProjectSection'
import { CreateProjectModal } from '../projects/components/CreateProjectModal'
import StatusOverView from '@/components/dashboard/StatusOverView'
import RecentActivity from '@/components/dashboard/RecentActivity'
import { Suspense } from 'react'
import { getQueryClient } from '@/app/get-query-client'
import { joinedProjectsOptions, ownedProjectsOptions } from '@/lib/queries/project.queries'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

export default async function DashboardPage() {

  const queryClient = getQueryClient()
  await Promise.all([
    queryClient.prefetchQuery(ownedProjectsOptions()),
    queryClient.prefetchQuery(joinedProjectsOptions()),
  ])

  const dehydratedState = dehydrate(queryClient)
  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-blue-50/30">
      <HydrationBoundary state={dehydratedState}>
        <div className="p-8 max-w-7xl mx-auto">
          {/* Stats Overview */}
          <Suspense fallback={<div>Loading Overview...</div>}>
            <StatusOverView />
          </Suspense>
  
          {/* Projects Section */}
          <Suspense fallback={<div>Loading Projects...</div>}>
            <ProjectSection/>
          </Suspense>
  
          {/* Recent Activity */}
          <Suspense fallback={<div>Loading Recent Activity...</div>}>
            <RecentActivity />
          </Suspense>
  
          {/* Create Project Modal */}
          <CreateProjectModal/>
        </div>
      </HydrationBoundary>
    </div>
  )
}