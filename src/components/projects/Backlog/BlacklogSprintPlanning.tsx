import { Sprint } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Calendar, TrendingUp, Play, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'

interface BlacklogSprintPlanningProps {
  sprints: Sprint[]
  onCreateSprint: () => void
  onStartSprint: (sprint: Sprint) => void
}

function BlacklogSprintPlanning({
  sprints,
  onCreateSprint,
  onStartSprint
}: BlacklogSprintPlanningProps) {
  const activeSprints = sprints
    .map((s) => (s.status === 'active' ? s : null))
    .filter(Boolean) as Sprint[]
  const upcomingSprints = sprints
    .map((s) => (s.status === 'planned' ? s : null))
    .filter(Boolean) as Sprint[]
  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg text-gray-900 mb-1">Sprint Planning</h3>
        <p className="text-sm text-gray-600">Manage and plan sprints</p>
      </div>

      <ScrollArea className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          {/* Create Sprint Button */}
          <Button
            onClick={onCreateSprint}
            variant="outline"
            className="w-full border-dashed border-2 h-auto py-4"
            disabled={sprints.some((s) => s.status === 'planned')}
          >
            <Plus className="w-5 h-5 mr-2" />
            {sprints.some((s) => s.status === 'planned')
              ? 'Sprint in Planning'
              : 'Create New Sprint'}
          </Button>

          <Separator />

          {/* Active Sprints */}
          {activeSprints.length > 0 && (
            <div>
              <h4 className="text-sm text-gray-700 mb-3 flex items-center gap-2">
                <Play className="w-4 h-4 text-green-600" />
                Active Sprints ({activeSprints.length})
              </h4>
              <div className="space-y-3">
                {activeSprints.map((sprint) => (
                  <Card
                    key={sprint._id}
                    className="border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onStartSprint(sprint)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="text-sm text-gray-900">{sprint.name}</h5>
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                        {sprint.goal}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(sprint.endDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>{sprint.maxStoryPoint} SP</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Sprints */}
          {upcomingSprints.length > 0 && (
            <div>
              <h4 className="text-sm text-gray-700 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Upcoming Sprints ({upcomingSprints.length})
              </h4>
              <div className="space-y-3">
                {upcomingSprints.map((sprint) => (
                  <Card
                    key={sprint._id}
                    className="border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="text-sm text-gray-900">{sprint.name}</h5>
                        <Badge variant="outline" className="text-xs">
                          Upcoming
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                        {sprint.goal}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(sprint.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>{sprint.maxStoryPoint} SP</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => onStartSprint(sprint)}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Start Sprint
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* No Sprints State */}
          {sprints.length === 0 && (
            <Card className="border-0 bg-gray-50">
              <CardContent className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600">No sprints yet</p>
                <p className="text-xs text-gray-500 mt-1">
                  Create your first sprint to start planning
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export default BlacklogSprintPlanning
