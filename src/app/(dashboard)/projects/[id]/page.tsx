'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Project, Sprint } from '@/lib/types';
import { mockSprints } from '@/lib/mock-data';
import { ProjectOverview } from '@/components/projects/project-overview';
import { EditProjectModal } from '@/components/EditProjectModal';
import { CreateSprintModal } from '@/components/CreateSprintModal';
import { toast } from 'sonner';
import { useAllProjects } from '@/lib/hooks/useProjects';
import { useSprintsByProject } from '@/lib/hooks/useSprints';
export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { data: allProjects, isLoading: projectsLoading } = useAllProjects();

  // const [sprints, setSprints] = useState<Sprint[]>(mockSprints);
  const { data: sprints } = useSprintsByProject(projectId);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isCreateSprintOpen, setIsCreateSprintOpen] = useState(false);

   // Loading state
  if (projectsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  const project = allProjects.find((p) => p._id === projectId);
  // const projectSprints = sprints.filter((s) => s.projectId === projectId);

  const handleEditProject = (projectId: string, projectData: Partial<Project>) => {
    // TODO: Implement với useMutation để update project qua API
    toast.success('Project updated successfully');
  };

  const handleDeleteProject = (projectId: string) => {
    // TODO: Implement với useMutation để delete project qua API
    toast.success('Project deleted successfully');
    router.push('/dashboard');
  };

  const handleCreateSprint = (sprintData: Partial<Sprint>) => {

    toast.success('Sprint created successfully!');
  };

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-gray-900 mb-2">Project not found</h2>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
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
      <ProjectOverview
        sprints={sprints}
        onNavigateToBacklog={() => router.push(`/projects/${projectId}/backlog`)}
        onEditProject={() => setIsEditProjectOpen(true)}
      />

      <EditProjectModal
        open={isEditProjectOpen}
        onOpenChange={setIsEditProjectOpen}
        onSave={handleEditProject}
        onDelete={handleDeleteProject}
      />

      <CreateSprintModal
        projectId={projectId}
        open={isCreateSprintOpen}
        onOpenChange={setIsCreateSprintOpen}
        onCreate={handleCreateSprint}
      />
    </>
  );
}
