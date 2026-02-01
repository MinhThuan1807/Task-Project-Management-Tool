import { getQueryClient } from '@/app/get-query-client'
import BacklogContainer from '@/components/projects/Backlog/BacklogContainer'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { projectDetailOptions } from '@/lib/queries/project.queries'
type PageProps = { params: Promise<{ id: string }> }

export default async function BacklogPage({ params }: PageProps) {
  const queryClient = getQueryClient()
  const projectId = (await params).id

  await Promise.all([
    queryClient.prefetchQuery(projectDetailOptions(projectId)),
    // queryClient.prefetchQuery(sprintsByProjectOptions(projectId)),
  ])

  const dehydratedState = dehydrate(queryClient)
  
  return (
    <HydrationBoundary state={dehydratedState}>
      <BacklogContainer projectId={projectId} />
    </HydrationBoundary>
   
  )
  
}
