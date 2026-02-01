import { getQueryClient } from '@/app/get-query-client'
import ProjectContainer from '@/components/projects/Overview/ProjectContainer'
import { projectDetailOptions } from '@/lib/queries/project.queries'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'
import ProjectContainerSkeleton from '@/components/projects/Overview/ProjectContainerSkeleton'

type PageProps = { params: Promise<{ id: string }> }

export default async function ProjectPage({ params }: PageProps) {
  const queryClient = getQueryClient()
  // const projectId = (await params).id
  const { id: projectId } = await params

  await queryClient.prefetchQuery(projectDetailOptions(projectId))

  const dehydratedState = dehydrate(queryClient)

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<ProjectContainerSkeleton />}>
        <ProjectContainer projectId={projectId} />
      </Suspense>
    </HydrationBoundary>
  )
}
