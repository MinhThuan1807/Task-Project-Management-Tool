import ProjectSection from '@/components/dashboard/ProjectSection'
import StatusOverView from '@/components/dashboard/StatusOverView'
import RecentActivity from '@/components/dashboard/RecentActivity'
import { getQueryClient } from '@/app/get-query-client'
import { allProjectsOptions } from '@/lib/queries/project.queries'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import CreateProjectModal from '@/components/modal/CreateProjectModal'
export default async function DashboardPage() {
  const queryClient = getQueryClient()
  await Promise.all([queryClient.prefetchQuery(allProjectsOptions())])

  const dehydratedState = dehydrate(queryClient)
  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-blue-50/30">
      <HydrationBoundary state={dehydratedState}>
        <div className="p-8 max-w-7xl mx-auto">
          {/* Stats Overview */}

          <StatusOverView />

          {/* Projects Section */}
          <ProjectSection />

          {/* Recent Activity */}
          <RecentActivity />

          {/* Create Project Modal */}
          <CreateProjectModal />
        </div>
      </HydrationBoundary>
    </div>
  )
}
