import { getQueryClient } from '@/app/get-query-client'
import SprintBoardContainer from '@/components/projects/sprint/SprintBoardContainer'
import { boardColumnsBySprintOptions } from '@/lib/queries/boardColumn.queries'
import { allProjectsOptions } from '@/lib/queries/project.queries'
import { sprintDetailOptions } from '@/lib/queries/sprint.queries'
import { tasksBySprintOptions } from '@/lib/queries/task.queries'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

type PageProps = { params: Promise<{ id: string; sprintId: string }> }
export default async function SprintPage({ params }: PageProps) {
  const queryClient = getQueryClient()
  const { id: projectId, sprintId } = await params

  await Promise.all([
    queryClient.prefetchQuery(allProjectsOptions()),
    queryClient.prefetchQuery(sprintDetailOptions(projectId)),
    queryClient.prefetchQuery(tasksBySprintOptions(sprintId)),
    queryClient.prefetchQuery(boardColumnsBySprintOptions(sprintId))
  ])

  const dehydratedState = dehydrate(queryClient)
  return (
    <HydrationBoundary state={dehydratedState}>
      <SprintBoardContainer />
    </HydrationBoundary>
  )
}
