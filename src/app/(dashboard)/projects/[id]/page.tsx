import { getQueryClient } from '@/app/get-query-client'
import ProjectContainer from '@/components/projects/Overview/ProjectContainer'
import { projectDetailOptions } from '@/lib/queries/project.queries'
import { sprintDetailOptions } from '@/lib/queries/sprint.queries'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
type PageProps = { params: Promise<{ id: string }> }

export default async function ProjectPage({ params }: PageProps) {
  const queryClient = getQueryClient()
  // const projectId = (await params).id
  const { id: projectId } = await params


  await Promise.all([
      queryClient.prefetchQuery(sprintDetailOptions(projectId)),
      queryClient.prefetchQuery(projectDetailOptions(projectId)),
    ])
  
  const dehydratedState = dehydrate(queryClient)

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProjectContainer projectId={projectId}/>
    </HydrationBoundary>
   
  )
}
