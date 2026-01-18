'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sprint } from '@/lib/types';
import { BacklogView } from '@/components/projects/backlog-view';
import { CreateSprintModal } from '@/components/CreateSprintModal';
import { toast } from 'sonner';
import { useAllProjects } from '@/lib/hooks/useProjects';
import { useSprintsByProject, useUpdateSprint } from '@/lib/hooks/useSprints';
import { getErrorMessage } from '@/lib/utils';

export default function BacklogPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { data: allProjects } = useAllProjects();
  const { data: sprints } = useSprintsByProject(projectId);

  const [isCreateSprintOpen, setIsCreateSprintOpen] = useState(false);

  const project = allProjects.find((p) => p._id === projectId);
  const projectSprints = sprints?.filter((s) => s.projectId === projectId) || [];
  const plannedSprint = sprints?.find((s) => s.status === 'planned');
  const sprintPlannedId = plannedSprint ? plannedSprint._id : '';

  const updateStatusSprint = useUpdateSprint(sprintPlannedId);

  const handleStartSprint = async (sprint: Sprint) => {
    if(sprint.status === 'planned') {
      await updateStatusSprint.mutate({ status: 'active' }, {
        onSuccess: () => {
          toast.success(`Sprint "${sprint.name}" started successfully!`);
        },
        onError: (error) => {
          toast.error(getErrorMessage(error) || 'Failed to start sprint');
        }
      });
    }
     router.push(`/projects/${projectId}/sprint/${sprint._id}`);
  };

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-gray-900 mb-2">Project not found</h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <BacklogView
        project={project}
        sprints={projectSprints}
        onStartSprint={handleStartSprint}
        onCreateSprint={() => setIsCreateSprintOpen(true)}
      />

      <CreateSprintModal
        projectId={projectId}
        open={isCreateSprintOpen}
        onOpenChange={setIsCreateSprintOpen}
      />
    </>
  );
}
