import { getQueryClient } from '@/app/get-query-client'
import BacklogContainer from '@/components/projects/Backlog/BacklogContainer'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { allProjectsOptions } from '@/lib/queries/project.queries'
import { sprintDetailOptions } from '@/lib/queries/sprint.queries'
type PageProps = { params: Promise<{ id: string }> }

export default async function BacklogPage({ params }: PageProps) {
  const queryClient = getQueryClient()
  const projectId = (await params).id

  await Promise.all([
    queryClient.prefetchQuery(allProjectsOptions()),
    queryClient.prefetchQuery(sprintDetailOptions(projectId)),
  ])

  const dehydratedState = dehydrate(queryClient)
  
  return (
    <HydrationBoundary state={dehydratedState}>
      <BacklogContainer projectId={projectId} />
    </HydrationBoundary>
   
  )
  
}
