import { Card, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { motion } from 'motion/react';
import { ProjectMember, Task } from '@/lib/types';

type FilterSortPanelProps = {
  filters: {
    priority: Task['priority'][]
    assigneeIds: Task['assigneeIds'][]
  }

  onFiltersChange: (filters: { priority: Task['priority'][]; assigneeIds: Task['assigneeIds'][] }) => void;
  projectMembers: ProjectMember[];
};

const priorityOptions = [
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-700' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-700' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-700' },
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-700' },
];

export function FilterSortPanel({ filters, onFiltersChange, projectMembers }: FilterSortPanelProps) {
  const handlePriorityToggle = (priority: string) => {
    const newPriorities = filters.priority.includes(priority)
      ? filters.priority.filter((p) => p !== priority)
      : [...filters.priority, priority];
    onFiltersChange({ ...filters, priority: newPriorities });
  };

  const handleAssigneeToggle = (assignee: string[]) => {
    const newAssignees = filters.assigneeIds.includes(assignee)
      ? filters.assigneeIds.filter((a) => a !== assignee)
      : [...filters.assigneeIds, assignee];
    onFiltersChange({ ...filters, assigneeIds: newAssignees });
  };

  const handleClearAll = () => {
    onFiltersChange({ priority: [], assigneeIds: [] });
  };

  const activeFilterCount = filters.priority.length + filters.assigneeIds.length;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <Card className="m-6 mt-0 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm text-gray-900">Filters</h3>
              {activeFilterCount > 0 && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {activeFilterCount} active
                </Badge>
              )}
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={handleClearAll}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Priority Filter */}
            <div className="space-y-3">
              <Label className="text-sm text-gray-700">Priority</Label>
              <div className="space-y-2">
                {priorityOptions.map((option) => (
                  <div key={option.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`priority-${option.value}`}
                      checked={filters.priority.includes(option.value)}
                      onCheckedChange={() => handlePriorityToggle(option.value)}
                    />
                    <Label
                      htmlFor={`priority-${option.value}`}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div className={`w-2 h-2 rounded-full ${option.color}`} />
                      <span className="text-sm">{option.label}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="md:hidden" />

            {/* Assignee Filter */}
            <div className="space-y-3">
              <Label className="text-sm text-gray-700">Assignees</Label>
              <div className="space-y-2">
                {projectMembers.slice(0, 4).map((member) => (
                  <div key={member.memberId} className="flex items-center gap-2">
                    <Checkbox
                      id={`assignee-${member.email}`}
                      checked={filters.assigneeIds.includes(member.email)}
                      onCheckedChange={() => handleAssigneeToggle(member.email)}
                    />
                    <Label
                      htmlFor={`assignee-${member.email}`}
                      className="text-sm cursor-pointer"
                    >
                      {member.email || 'Team Member'}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="md:hidden" />

            {/* Quick Filters */}
            <div className="space-y-3">
              <Label className="text-sm text-gray-700">Quick Filters</Label>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => onFiltersChange({ ...filters, priority: ['critical', 'high'] })}
                >
                  High Priority
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() =>
                    onFiltersChange({
                      priority: [],
                      assigneeIds: projectMembers.map(member => member.email),
                    })
                  }
                >
                  All Assigned
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() =>
                    onFiltersChange({
                      priority: [],
                      assigneeIds: [],
                    })
                  }
                >
                  Unassigned
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
