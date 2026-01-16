'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sprint } from '@/lib/types';
import { mockSprints } from '@/lib/mock-data';
import { SprintBoardDnd } from '@/components/projects/sprint-board-dnd';
import { FolderKanban, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAllProjects } from '@/lib/hooks/useProjects';
import { useCurrentUser } from '@/lib/hooks/useAuth';

export default function SprintPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const sprintId = params.sprintId as string;
  
  const { data: allProjects } = useAllProjects();
  const { data: currentUser } = useCurrentUser();
  const [sprints, setSprints] = useState<Sprint[]>(mockSprints);

  const project = allProjects.find((p) => p._id === projectId);
  const sprint = sprints.find((s) => s._id === sprintId);

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

  if (!sprint) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FolderKanban className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl text-gray-900 mb-3">Sprint not found</h2>
          <p className="text-gray-600 mb-6">
            This sprint doesn't exist or has been deleted.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => router.push(`/projects/${projectId}/backlog`)}>
              Go to Backlog
            </Button>
            <Button onClick={() => router.push('/dashboard')} className="bg-gradient-to-r from-blue-600 to-purple-600">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SprintBoardDnd
      project={project}
      sprint={sprint}
      currentUser={currentUser}
      onBack={() => router.push(`/projects/${projectId}/backlog`)}
    />
  );
}
