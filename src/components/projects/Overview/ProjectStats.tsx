import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Sprint } from '@/lib/types';
import {
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp
} from 'lucide-react'

interface ProjectStatsProps {
  sprintStats: {
    totalSprints: number;
    activeSprints: Sprint[];
    completedSprints: Sprint[];
  };
}
function ProjectStats( {sprintStats}: ProjectStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-600">Total Sprints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl text-gray-900">
              {sprintStats.totalSprints}
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-600">
            Active Sprints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl text-gray-900">
              {sprintStats.activeSprints.length}
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-600">Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl text-gray-900">
              {sprintStats.completedSprints.length}
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-600">Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl text-gray-900">
              {sprintStats.totalSprints > 0
                ? Math.round(
                    (sprintStats.completedSprints.length /
                      sprintStats.totalSprints) *
                      100
                  )
                : 0}
              %
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProjectStats
