import dynamic from 'next/dynamic';
import ProjectSection from '@/components/dashboard/ProjectSection';
import { CreateProjectModal } from '../projects/components/CreateProjectModal';

const StatusOverview = dynamic(() => import('@/components/dashboard/StatusOverview'));
const RecentActivity = dynamic(() => import('@/components/dashboard/RecentActivity'));

export default function DashboardPage() {
  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Stats Overview */}
        <StatusOverview />
        {/* Projects Section */}
        <ProjectSection/>
        {/* Recent Activity */}
        <RecentActivity />
        {/* Create Project Modal */}
        <CreateProjectModal/>
      </div>
    </div>
  );
}