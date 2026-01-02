'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { User, Project, Sprint } from '@/lib/types';
import { mockCurrentUser, mockAllProjects, mockSprints } from '@/lib/mock-data';
import { ProjectOverview } from '@/components/projects/project-overview';
import { EditProjectModal } from '@/components/EditProjectModal';
import { CreateSprintModal } from '@/components/CreateSprintModal';
import { toast } from 'sonner';

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [currentUser, setCurrentUser] = useState<User>(mockCurrentUser);
  const [allProjects, setAllProjects] = useState<Project[]>(mockAllProjects);
  const [sprints, setSprints] = useState<Sprint[]>(mockSprints);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isCreateSprintOpen, setIsCreateSprintOpen] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedProjects = localStorage.getItem('allProjects');
    const storedSprints = localStorage.getItem('sprints');

    if (storedUser) setCurrentUser(JSON.parse(storedUser));
    if (storedProjects) setAllProjects(JSON.parse(storedProjects));
    if (storedSprints) setSprints(JSON.parse(storedSprints));
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('allProjects', JSON.stringify(allProjects));
  }, [allProjects]);

  useEffect(() => {
    localStorage.setItem('sprints', JSON.stringify(sprints));
  }, [sprints]);

  const project = allProjects.find((p) => p.id === projectId);
  const projectSprints = sprints.filter((s) => s.projectId === projectId);

  const handleEditProject = (projectId: string, projectData: Partial<Project>) => {
    const updatedProjects = allProjects.map((p) =>
      p.id === projectId
        ? {
            ...p,
            name: projectData.name || p.name,
            description: projectData.description !== undefined ? projectData.description : p.description,
            status: projectData.status || p.status,
          }
        : p
    );
    setAllProjects(updatedProjects);
    toast.success('Project updated successfully');
  };

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = allProjects.filter((p) => p.id !== projectId);
    setAllProjects(updatedProjects);

    const updatedSprints = sprints.filter((s) => s.projectId !== projectId);
    setSprints(updatedSprints);

    toast.success('Project deleted successfully');
    router.push('/dashboard');
  };

  const handleCreateSprint = (sprintData: Partial<Sprint>) => {
    const newSprint: Sprint = {
      id: `sprint-${Date.now()}`,
      projectId: projectId,
      name: sprintData.name || 'New Sprint',
      goal: sprintData.goal || '',
      storyPoint: sprintData.storyPoint || 0,
      startDate: sprintData.startDate || new Date().toISOString().split('T')[0],
      endDate: sprintData.endDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };
    setSprints([...sprints, newSprint]);
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
        project={project}
        sprints={projectSprints}
        currentUser={currentUser}
        onNavigateToBacklog={() => router.push(`/projects/${projectId}/backlog`)}
        onNavigateToSettings={() => {}}
        onEditProject={() => setIsEditProjectOpen(true)}
      />

      <EditProjectModal
        project={project}
        open={isEditProjectOpen}
        onOpenChange={setIsEditProjectOpen}
        onSave={handleEditProject}
        onDelete={handleDeleteProject}
        currentUserId={currentUser.id}
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
