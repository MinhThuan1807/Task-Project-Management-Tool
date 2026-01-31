'use client'
import { useTasksBySprint } from '@/lib/hooks/useTasks'
import { useBoardColumnsBySprint } from '@/lib/hooks/useBoardColumns'
import { Sprint, Task } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, TrendingUp } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { formatDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function SprintCard({
  sprint,
  projectId
}: {
  sprint: Sprint
  projectId: string
}) {
  const { data: tasks = [] } = useTasksBySprint(sprint._id)
  const { data: boardColumns = [] } = useBoardColumnsBySprint(sprint._id)

  const doneColumn = boardColumns.find(
    (col) => col.title?.toLowerCase() === 'done'
  )
  const storyPointsCompleted = doneColumn
    ? tasks.filter((t) => t.boardColumnId === doneColumn._id)
    : []
  const getStoryPoints = (t: Task) => t.storyPoint

  const totalStoryPoints = storyPointsCompleted.reduce(
    (sum, t) => sum + Number(getStoryPoints(t)),
    0
  )
  const progress = (totalStoryPoints / (sprint?.maxStoryPoint || 1)) * 100

  const router = useRouter()

  return (
    <Card className="border shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg text-gray-900">{sprint.name}</h3>
              <Badge
                variant={sprint.status === 'active' ? 'default' : 'outline'}
                className={sprint.status === 'active' ? 'bg-green-600' : ''}
              >
                {sprint.status.charAt(0).toUpperCase() + sprint.status.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">{sprint.goal}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>{sprint.maxStoryPoint} story points</span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              router.push(`/projects/${projectId}/sprint/${sprint._id}`)
            }
          >
            View Board
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="text-gray-900">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>
      </CardContent>
    </Card>
  )
}
