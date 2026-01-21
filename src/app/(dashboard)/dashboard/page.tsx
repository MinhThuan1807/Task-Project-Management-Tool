import ProjectSection from '@/components/dashboard/ProjectSection';
import { CreateProjectModal } from '../projects/components/CreateProjectModal';
import StatusOverView from '@/components/dashboard/StatusOverView';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Stats Overview */}
        <Suspense fallback={<div>Loading Overview...</div>}>
          <StatusOverView />
        </Suspense>
       
        {/* Projects Section */}
        <Suspense fallback={<div>Loading Projects...</div>}>
          <ProjectSection/>
        </Suspense>

        {/* Recent Activity */}
        <Suspense>
          <RecentActivity />
        </Suspense>
       
        {/* Create Project Modal */}
        <CreateProjectModal/>
      </div>
    </div>
  );
}