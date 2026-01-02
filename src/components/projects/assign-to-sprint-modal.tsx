import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Sprint } from '../../lib/types';
import { Badge } from '../ui/badge';
import { Calendar, TrendingUp } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

type AssignToSprintModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskTitle: string;
  sprints: Sprint[];
  onAssign: (sprintId: string) => void;
};

export function AssignToSprintModal({
  open,
  onOpenChange,
  taskTitle,
  sprints,
  onAssign,
}: AssignToSprintModalProps) {
  const [selectedSprintId, setSelectedSprintId] = useState<string>('');

  const activeSprints = sprints.filter((s) => new Date(s.endDate) > new Date());
  const upcomingSprints = sprints.filter((s) => new Date(s.startDate) > new Date());

  const handleAssign = () => {
    if (selectedSprintId) {
      onAssign(selectedSprintId);
      setSelectedSprintId('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Task to Sprint</DialogTitle>
          <DialogDescription>
            Choose a sprint to assign this task to for planning and execution.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Task:</p>
            <p className="text-sm text-gray-900">{taskTitle}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sprint">Select Sprint</Label>
            {sprints.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-sm text-gray-600">No sprints available</p>
                <p className="text-xs text-gray-500 mt-1">Create a sprint first to assign tasks</p>
              </div>
            ) : (
              <Select value={selectedSprintId} onValueChange={setSelectedSprintId}>
                <SelectTrigger id="sprint">
                  <SelectValue placeholder="Choose a sprint..." />
                </SelectTrigger>
                <SelectContent>
                  {activeSprints.length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-xs text-gray-500 font-medium">Active Sprints</div>
                      {activeSprints.map((sprint) => (
                        <SelectItem key={sprint.id} value={sprint.id}>
                          {sprint.name} • {sprint.storyPoint} SP
                        </SelectItem>
                      ))}
                    </>
                  )}
                  {upcomingSprints.length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-xs text-gray-500 font-medium">Upcoming Sprints</div>
                      {upcomingSprints.map((sprint) => (
                        <SelectItem key={sprint.id} value={sprint.id}>
                          {sprint.name} • {sprint.storyPoint} SP
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          {selectedSprintId && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              {(() => {
                const sprint = sprints.find((s) => s.id === selectedSprintId);
                if (!sprint) return null;
                
                const isActive = new Date(sprint.endDate) > new Date() && new Date(sprint.startDate) <= new Date();
                
                return (
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm text-gray-900">{sprint.name}</h4>
                      <Badge variant={isActive ? 'default' : 'outline'} className="text-xs">
                        {isActive ? 'Active' : 'Upcoming'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">{sprint.goal}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{sprint.storyPoint} SP</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAssign} 
            disabled={!selectedSprintId}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Assign to Sprint
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}