'use client';

import { useParams } from 'next/navigation';
import { ReportsView } from '@/components/projects/report-view';
// import { mockProjects, mockSprints } from '@/lib/mock-data';

export default function ProjectReportsPage() {
  const params = useParams();
  const projectId = params.id as string;

  // Get project data
  const project = mockProjects.find((p) => p.id === projectId);
  const sprints = mockSprints.filter((s) => s.projectId === projectId);

  // Mock current user
  const currentUser = {
    id: 'user-1',
    email: 'user@example.com',
    displayName: 'Current User',
    role: 'user' as const,
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl text-gray-900 mb-2">Project not found</h2>
          <p className="text-gray-600">The project you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <ReportsView project={project} sprints={sprints} currentUser={currentUser} />
    </div>
  );
}
