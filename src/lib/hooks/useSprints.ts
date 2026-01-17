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

export function sprintsByProjectOptions(projectId: string) {
  return queryOptions({
    queryKey: sprintKeys.byProject(projectId),
    queryFn: async () => {
      const res = await sprintApi.getAllByProjectId(projectId);
      return res.data || res;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!projectId,
  })
}

export function sprintDetailOptions(sprintId: string) {
  return queryOptions({
    queryKey: sprintKeys.detail(sprintId),
    queryFn: async () => {
      const res = await sprintApi.getById(sprintId);
      return res.data || res;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!sprintId,
  })
}

// Hooks
export function useSprintsByProject(projectId: string) {
  return useQuery(sprintsByProjectOptions(projectId));
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
          } as Sprint]
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
      toast.success('Sprint created successfully!');
    },
  });
}

export function useUpdateSprint(sprintId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSprintRequest) => sprintApi.update(sprintId, data),
    onMutate: async (updatedSprint) => {
      await queryClient.cancelQueries({ queryKey: sprintKeys.detail(sprintId) });

      const previousSprint = queryClient.getQueryData<Sprint>(sprintKeys.detail(sprintId));

      // Optimistically update sprint detail
      if (previousSprint) {
        queryClient.setQueryData<Sprint>(
          sprintKeys.detail(sprintId),
          { ...previousSprint, ...updatedSprint }
        );
      }
      return { previousSprint };
    },
    onError: (error, variables, context) => {
      if (context?.previousSprint) {
        queryClient.setQueryData(
          sprintKeys.detail(sprintId),
          context.previousSprint
        );
      }
      toast.error(getErrorMessage(error) || 'Failed to update sprint');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sprintKeys.detail(sprintId) });
      queryClient.invalidateQueries({ queryKey: sprintKeys.all });
      toast.success('Sprint updated successfully!');
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

// // Hook lấy sprints theo projectId
// export function useSprintsByProject(projectId: string) {
//   return useQuery({
//     queryKey: sprintKeys.byProject(projectId),
//     queryFn: async () => {
//       const res = await sprintApi.getAllByProjectId(projectId);
//       return res.data || res;
//     },
//   });
// }

// // Hook lấy chi tiết sprint theo sprintId
// export function useSprintDetail(sprintId: string) {
//   return useQuery({
//     queryKey: sprintKeys.detail(sprintId),
//     queryFn: async () => {
//       const res = await sprintApi.getById(sprintId);
//       return res.data || res;
//     },
//   });
// }

// //Hook tạo sprint mới
// export function useCreateSprint() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: sprintApi.create,
//     onSuccess:() => {
//       queryClient.invalidateQueries({ queryKey: sprintKeys.all });
//     },
//     onError: (error) => {
//       toast.error(getErrorMessage(error) || 'Failed to create sprint');
//     }
//   })
// }
// // Hook cập nhật sprint
// export function useUpdateSprint(sprintId: string) {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (data: UpdateSprintRequest) => sprintApi.update(sprintId, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: sprintKeys.detail(sprintId) });
//       queryClient.invalidateQueries({ queryKey: sprintKeys.all });
//     } 
//   });
// }

// // Hook xóa sprint
// export function useDeleteSprint(sprintId: string) {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: () => sprintApi.delete(sprintId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: sprintKeys.all });
//     }
//   });
// }
