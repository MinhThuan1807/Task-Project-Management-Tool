'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sprint } from '@/lib/types';
import { BacklogView } from '@/components/projects/backlog-view';
import { CreateSprintModal } from '@/components/CreateSprintModal';
import { toast } from 'sonner';
import { useAllProjects } from '@/lib/hooks/useProjects';
import { useCurrentUser } from '@/lib/hooks/useAuth';
import { mockSprints } from '@/lib/mock-data';
import { useSprintsByProject } from '@/lib/hooks/useSprints';

export default function BacklogPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { data: allProjects } = useAllProjects();
  const { data: currentUser } = useCurrentUser();
  const { data: sprints } = useSprintsByProject(projectId);

  const [isCreateSprintOpen, setIsCreateSprintOpen] = useState(false);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('sprints', JSON.stringify(sprints));
  }, [sprints]);

  const project = allProjects.find((p) => p._id === projectId);
  const projectSprints = sprints?.filter((s) => s.projectId === projectId) || [];

  const handleCreateSprint = (sprintData: Partial<Sprint>) => {

  };

  const handleStartSprint = (sprint: Sprint) => {
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
