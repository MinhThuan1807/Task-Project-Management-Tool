'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ownedProjectsOptions,
  joinedProjectsOptions,
  projectDetailOptions,
  projectKeys,
  allProjectsOptions 
} from '@/lib/queries/project.queries'
import { projectApi } from '@/lib/services/project.service'
import { toast } from 'sonner'
import { getErrorMessage } from '../utils'
import {
  CreateProjectRequest,
  Project,
  UpdateProjectRequest
} from '@/lib/types'

// Hooks
export function useOwnedProjects() {
  return useQuery(ownedProjectsOptions())
}

export function useJoinedProjects() {
  return useQuery(joinedProjectsOptions())
}

export function useProjectDetail(projectId: string) {
  return useQuery(projectDetailOptions(projectId))
}

// export function useAllProjects() {
//   const owned = useOwnedProjects()
//   const joined = useJoinedProjects()

//   return {
//     data: [...(owned.data || []), ...(joined.data || [])],
//     ownedProjects: owned.data || [],
//     joinedProjects: joined.data || [],
//     isLoading: owned.isLoading || joined.isLoading,
//     error: owned.error || joined.error,
//     refetch: () => {
//       owned.refetch()
//       joined.refetch()
//     }
//   }
// }

export function useAllProjects() {
  return useQuery(allProjectsOptions())
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: projectApi.createProject,
    onMutate: async (
      newProject: CreateProjectRequest & { ownerId: string }
    ) => {
      await queryClient.cancelQueries({ queryKey: projectKeys.owned() })

      const previousProjects = queryClient.getQueryData<Project[]>(
        projectKeys.owned()
      )

      if (previousProjects) {
        queryClient.setQueryData<Project[]>(projectKeys.owned(), [
          ...previousProjects,
          {
            ...newProject,
            _id: 'temp-' + Date.now(),
            members: [],
            status: 'active' as const,
            createdAt: new Date().toISOString(),
            imageUrl:
              typeof newProject.imageUrl === 'string'
                ? newProject.imageUrl
                : undefined,
            imagePublicId: '',
            updatedAt: null,
            description: newProject.description ?? ''
          } as Project
        ])
      }

      return { previousProjects }
    },
    onError: (error, variables, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(projectKeys.owned(), context.previousProjects)
      }
      toast.error(getErrorMessage(error) || 'Failed to create project')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
    }
  })
}

export function useUpdateProject(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProjectRequest) =>
      projectApi.update(projectId, data),
    onMutate: async (updatedData) => {
      await queryClient.cancelQueries({
        queryKey: projectKeys.detail(projectId)
      })

      const previousProject = queryClient.getQueryData<Project>(
        projectKeys.detail(projectId)
      )

      if (previousProject) {
        queryClient.setQueryData<Project>(projectKeys.detail(projectId), {
          ...previousProject,
          ...updatedData,
          imageUrl:
            typeof updatedData.imageUrl === 'string'
              ? updatedData.imageUrl
              : previousProject.imageUrl
        })
      }

      return { previousProject }
    },
    onError: (error, variables, context) => {
      if (context?.previousProject) {
        queryClient.setQueryData(
          projectKeys.detail(projectId),
          context.previousProject
        )
      }
      toast.error(getErrorMessage(error) || 'Failed to update project')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) })
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
      toast.success('Project updated successfully!')
    }
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: projectApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
      toast.success('Project deleted successfully!')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || 'Failed to delete project')
    }
  })
}

export function useInviteMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: projectApi.inviteMember,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(variables.projectId)
      })
      toast.success('Member invited successfully!')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || 'Failed to invite member')
    }
  })
}

export function useRemoveMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: projectApi.removeMember,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(variables.projectId)
      })
      toast.success('Member removed successfully!')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || 'Failed to remove member')
    }
  })
}

export function useUpdateMemberRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: projectApi.updateMemberRole,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(variables.projectId)
      })
      toast.success('Member role updated successfully!')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || 'Failed to update member role')
    }
  })
}
