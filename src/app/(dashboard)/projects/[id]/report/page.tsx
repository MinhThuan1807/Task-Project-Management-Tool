import { ReportsView } from '@/components/projects/report/ReportView'
import { getQueryClient } from '@/app/get-query-client'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { allProjectsOptions } from '@/lib/queries/project.queries'
import {
  sprintsByProjectOptions,
  sprintKeys
} from '@/lib/queries/sprint.queries'
import {
  projectVelocityOptions,
  sprintProgressOptions,
  sprintMemberDistributionOptions
} from '@/lib/queries/report.queries'
import { Sprint } from '@/lib/types'

type PageProps = { params: Promise<{ id: string }> }
export default async function ProjectReportsPage({ params }: PageProps) {
  const queryClient = getQueryClient()
  const { id: projectId } = await params

  // Prefetch project list, sprints for the project, and project-level velocity
  await Promise.all([
    queryClient.prefetchQuery(allProjectsOptions()),
    queryClient.prefetchQuery(sprintsByProjectOptions(projectId)),
    queryClient.prefetchQuery(projectVelocityOptions(projectId))
  ])

  // If we have at least one sprint, prefetch sprint-specific reports for the first sprint
  const sprints = queryClient.getQueryData<Sprint[]>(sprintKeys.byProject(projectId))
  if (sprints && sprints.length) {
    const firstSprintId = sprints[0]._id
    await Promise.all([
      queryClient.prefetchQuery(sprintProgressOptions(firstSprintId)),
      queryClient.prefetchQuery(sprintMemberDistributionOptions(firstSprintId))
    ])
  }

  const dehydratedState = dehydrate(queryClient)
  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="h-screen">
        <ReportsView />
      </div>
    </HydrationBoundary>
  )
}
