import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '@/lib/services/project.service';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils';
// Query keys
export const projectKeys = {
  all: ['projects'] as const,
  owned: () => [...projectKeys.all, 'owned'] as const,
  joined: () => [...projectKeys.all, 'joined'] as const,
  detail: (id: string) => [...projectKeys.all, id] as const,
};

// Hook lấy owned projects
export function useOwnedProjects() {
  return useQuery({
    queryKey: projectKeys.owned(),
    queryFn: async () => {
      const response = await projectApi.getOwnedProjects();
      return response.data || response;
    },
  });
}

// Hook lấy joined projects
export function useJoinedProjects() {
  return useQuery({
    queryKey: projectKeys.joined(),
    queryFn: async () => {
      const response = await projectApi.getJoinedProjects();
      return response.data || response;
    },
  });
}

// Hook lấy tất cả projects (combined)
export function useAllProjects() {
  const owned = useOwnedProjects();
  const joined = useJoinedProjects();

  return {
    data: [...(owned.data || []), ...(joined.data || [])],
    ownedProjects: owned.data || [],
    joinedProjects: joined.data || [],
    isLoading: owned.isLoading || joined.isLoading,
    error: owned.error || joined.error,
    refetch: () => {
      owned.refetch();
      joined.refetch();
    },
  };
}

// Hook tạo project mới
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectApi.createProject,
    onSuccess: (data) => {
      // Invalidate và refetch projects
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || 'Failed to create project.');
    },
  });
}