import dynamic from 'next/dynamic';
const ProjectOverview = dynamic(() => import('@/components/projects/project-overview'));
export default function ProjectPage() {
  return (
    <>
      <ProjectOverview/>

    </>
  );
}
