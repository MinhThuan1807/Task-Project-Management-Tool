import { Input } from '@/components/ui/input';
import { Sprint } from '@/lib/types/sprint.types'
import { formatDate } from '@/lib/utils'
import { Calendar, CheckCircle2, Search, Target } from 'lucide-react'


interface SprintSearchProps {
  sprint: Sprint;
  completedTasks: number;
  totalTasks: number;
  isActiveSprint: boolean;
  daysLeft: number;
  totalStoryPoints: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

function SprintSearch({
  sprint,
  completedTasks,
  totalTasks,
  isActiveSprint,
  daysLeft,
  totalStoryPoints,
  searchQuery,
  setSearchQuery
}: SprintSearchProps) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>
            {formatDate(sprint?.startDate)} - {formatDate(sprint?.endDate)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>
            {completedTasks} / {totalTasks} tasks
          </span>
        </div>
        {isActiveSprint && (
          <div className="flex items-center gap-2">
            <span className={daysLeft < 3 ? 'text-red-600 font-medium' : ''}>
              {daysLeft > 0 ? `${daysLeft} days left` : 'Sprint ended'}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4"/>
          <span>
            {totalStoryPoints}/{sprint.maxStoryPoint} story point
          </span>
        </div>
      </div>
    </div>
  )
}

export default SprintSearch
