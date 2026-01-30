import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sprint } from '@/lib/types'
import { ArrowLeft, CheckCircle2, Plus, SlidersHorizontal } from 'lucide-react'
import React from 'react'

interface SprintTitleProps {
  sprint: Sprint;
  onDirectToBacklog: () => void;
  isActiveSprint: boolean;
  setIsFilterOpen: (open: boolean) => void;
  isFilterOpen: boolean;
  setIsCreateTaskOpen: (open: boolean) => void;
  handleUpdateStatusSprint: () => void;
  canEditTask?: boolean;
}

function SprintTitle({
  sprint,
  onDirectToBacklog,
  isActiveSprint,
  setIsFilterOpen,
  isFilterOpen,
  setIsCreateTaskOpen,
  handleUpdateStatusSprint,
  canEditTask
}: SprintTitleProps) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onDirectToBacklog}
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-2xl text-gray-900">{sprint?.name}</h2>
          <Badge
            variant={isActiveSprint ? 'default' : 'outline'}
            className={isActiveSprint ? 'bg-green-600' : ''}
          >
            {sprint?.status.charAt(0).toUpperCase() + sprint?.status.slice(1)}
          </Badge>
        </div>
        {sprint?.goal && (
          <p className="text-sm text-gray-600">{sprint?.goal}</p>
        )}
      </div>
      <div className="flex items-center flex-col gap-2">
        <div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => {setIsCreateTaskOpen(true)}}
            className="ml-3 bg-gradient-to-r from-blue-600 to-purple-600"
            disabled={!canEditTask}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
        <div>
          <Button
            onClick={handleUpdateStatusSprint}
            className="bg-gradient-to-r"
            variant="outline"
            disabled={!canEditTask}
          >
            {sprint?.status === 'planned' ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Active Sprint
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Complete Sprint
              </>
            )}
          </Button>
        </div>
      </div>

    </div>
  )
}

export default SprintTitle
