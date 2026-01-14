'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { User, Project, Sprint } from '@/lib/types';
// import { mockCurrentUser, mockAllProjects, mockSprints } from '@/lib/mock-data';
import { BacklogView } from '@/components/projects/backlog-view';
import { CreateSprintModal } from '@/components/CreateSprintModal';
import { toast } from 'sonner';

export default function BacklogPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [currentUser, setCurrentUser] = useState<User>(mockCurrentUser);
  const [allProjects, setAllProjects] = useState<Project[]>(mockAllProjects);
  const [sprints, setSprints] = useState<Sprint[]>(mockSprints);
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
    localStorage.setItem('sprints', JSON.stringify(sprints));
  }, [sprints]);

  const project = allProjects.find((p) => p.id === projectId);
  const projectSprints = sprints.filter((s) => s.projectId === projectId);

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

  const handleStartSprint = (sprint: Sprint) => {
    router.push(`/projects/${projectId}/sprint/${sprint.id}`);
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
        currentUser={currentUser}
        onStartSprint={handleStartSprint}
        onCreateSprint={() => setIsCreateSprintOpen(true)}
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
