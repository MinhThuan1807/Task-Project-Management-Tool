'use client'
import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions
} from '@tanstack/react-query'
import { projectApi } from '@/lib/services/project.service'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/utils'
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  InviteMemberRequest,
  UpdateMemberRoleRequest
} from '@/lib/types'

// Query keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: string) => [...projectKeys.lists(), { filters }] as const,
  owned: () => [...projectKeys.lists(), 'owned'] as const,
  joined: () => [...projectKeys.lists(), 'joined'] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const
}

// Query Options
export function ownedProjectsOptions() {
  return queryOptions({
    queryKey: projectKeys.owned(),
    queryFn: async () => {
      const response = await projectApi.getOwnedProjects()
      return response.data
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

export function joinedProjectsOptions() {
  return queryOptions({
    queryKey: projectKeys.joined(),
    queryFn: async () => {
      const response = await projectApi.getJoinedProjects()
      return response.data
    },
    staleTime: 5 * 60 * 1000
  })
}

export function projectDetailOptions(projectId: string) {
  return queryOptions({
    queryKey: projectKeys.detail(projectId),
    queryFn: async () => {
      const response = await projectApi.getById(projectId)
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!projectId
  })
}

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

export function useAllProjects() {
  const owned = useOwnedProjects()
  const joined = useJoinedProjects()

  return {
    data: [...(owned.data || []), ...(joined.data || [])],
    ownedProjects: owned.data || [],
    joinedProjects: joined.data || [],
    isLoading: owned.isLoading || joined.isLoading,
    error: owned.error || joined.error,
    refetch: () => {
      owned.refetch()
      joined.refetch()
    }
  }
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: projectApi.createProject,
    onMutate: async (newProject) => {
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
            createdAt: Date.now()
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
          ...updatedData
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
