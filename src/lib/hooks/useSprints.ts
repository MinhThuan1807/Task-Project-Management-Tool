import { useMutation, useQuery, useQueryClient, queryOptions } from "@tanstack/react-query";
import { sprintApi } from "../services/sprint.service";
import { toast } from "sonner";
import { getErrorMessage } from "../utils";
import { Sprint, UpdateSprintRequest } from "../types";

//Query key
export const sprintKeys = {
  all: ['sprints'] as const,
  lists: () => [...sprintKeys.all, 'list'] as const,
  list: (filters: string) => [...sprintKeys.lists(), { filters }] as const,
  byProject: (projectId: string) => [...sprintKeys.all, 'project', projectId] as const,
  details: () => [...sprintKeys.all, 'detail'] as const,
  detail: (sprintId: string) => [...sprintKeys.details(), sprintId] as const,
};

export function sprintsByProjectOptions(projectId?: string) {
  return queryOptions<Sprint[]>({
    queryKey: projectId ? sprintKeys.byProject(projectId) : sprintKeys.lists(),
    queryFn: async () => {
      if (!projectId) return []
      const res = await sprintApi.getAllByProjectId(projectId)
      return (res as any).data ?? res ?? []
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
    placeholderData: [] as Sprint[],
  })
}
export function useSprintsByProject(projectId?: string) {
  return useQuery(sprintsByProjectOptions(projectId))
}

export function sprintDetailOptions(sprintId?: string) {
  return queryOptions<Sprint | null>({
    queryKey: sprintId ? sprintKeys.detail(sprintId) : sprintKeys.details(),
    queryFn: async () => {
      if (!sprintId) return null
      const res = await sprintApi.getById(sprintId)
      return (res as any).data ?? res ?? null
    },
    enabled: !!sprintId,
    staleTime: 5 * 60 * 1000,
    placeholderData: null,
  })
}

export function useSprintDetail(sprintId: string) {
  return useQuery(sprintDetailOptions(sprintId));
}

export function useCreateSprint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sprintApi.create,
    onMutate: async (newSprint) => {
      // Optimistic update
      /* cancelQueries is used to cancel any outgoing refetches so they don't overwrite our optimistic update */
      await queryClient.cancelQueries({
        queryKey: sprintKeys.byProject(newSprint.projectId)
      });

      /* getQueryData is used to get the current cached data for the query */
      const previousSprints = queryClient.getQueryData<Sprint[]>(sprintKeys.byProject(newSprint.projectId));

      // Temporarily add new sprint
      if (previousSprints) {
        queryClient.setQueryData<Sprint[]>(
          sprintKeys.byProject(newSprint.projectId),
          [...previousSprints, {
            ...newSprint,
            _id: 'temp-' + Date.now(),
            status: 'planned' as const,
            createdAt: Date.now(),
          } as unknown as Sprint]
        );
      }
      return { previousSprints };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousSprints) {
        queryClient.setQueryData<Sprint[]>(
          sprintKeys.byProject(variables.projectId),
          context.previousSprints
        );
      }
      toast.error(getErrorMessage(error) || 'Failed to create sprint');
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: sprintKeys.byProject(variables.projectId)
      });
    },
  });
}

export function useUpdateSprint(sprintId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSprintRequest) => sprintApi.update(sprintId, data),
    onMutate: async (updatedSprint) => {
      await queryClient.cancelQueries({ queryKey: sprintKeys.detail(sprintId) });

      const previousSprints =
        queryClient.getQueryData<Sprint[]>(sprintKeys.byProject(updatedSprint.projectId)) ?? []

      queryClient.setQueryData<Sprint[]>(
        sprintKeys.byProject(updatedSprint.projectId),
        [
          ...previousSprints,
          {
            ...updatedSprint,
            _id: 'temp-' + Date.now(),
            status: 'planned' as const,
            createdAt: Date.now(),
          } as unknown as Sprint,
        ]
      )

      return { previousSprints }
    },
    onError: (variables, context) => {
      if (context?.previousSprint) {
        queryClient.setQueryData(
          sprintKeys.detail(sprintId),
          context.previousSprint
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sprintKeys.detail(sprintId) });
      queryClient.invalidateQueries({ queryKey: sprintKeys.all });
    },
  });
}

export function useDeleteSprint(sprintId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sprintApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sprintKeys.all });
      toast.success('Sprint deleted successfully!');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || 'Failed to delete sprint');
    },
  });
}