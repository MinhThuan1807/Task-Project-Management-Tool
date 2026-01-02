import { useState } from 'react';
import type { Sprint } from '../lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

type CreateSprintModalProps = {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (sprint: Partial<Sprint>) => void;
};

export function CreateSprintModal({ projectId, open, onOpenChange, onCreate }: CreateSprintModalProps) {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [storyPoint, setStoryPoint] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      projectId,
      name,
      goal,
      storyPoint: parseInt(storyPoint) || 0,
      startDate,
      endDate,
    });
    // Reset form
    setName('');
    setGoal('');
    setStoryPoint('');
    setStartDate('');
    setEndDate('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Sprint</DialogTitle>
          <DialogDescription>
            Create a new sprint to organize your tasks and track progress over a defined time period.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 py-4">
            {/* Sprint Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Sprint Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Sprint 1 - Foundation"
                required
              />
            </div>

            {/* Sprint Goal */}
            <div className="space-y-2">
              <Label htmlFor="goal">
                Sprint Goal <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="What do you want to achieve in this sprint?"
                required
                rows={3}
              />
            </div>

            {/* Story Points */}
            <div className="space-y-2">
              <Label htmlFor="storyPoint">Story Points</Label>
              <Input
                id="storyPoint"
                type="number"
                value={storyPoint}
                onChange={(e) => setStoryPoint(e.target.value)}
                placeholder="40"
                min="0"
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">
                  End Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || !goal.trim()} className="bg-gradient-to-r from-blue-600 to-purple-600">
              Create Sprint
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}