import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Calendar, Target, TrendingUp } from 'lucide-react';

type CreateSprintModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onSave: (sprint: SprintFormData) => void;
};

export type SprintFormData = {
  name: string;
  goal: string;
  maxStoryPoint: number;
  startDate: string;
  endDate: string;
  status: 'planned' | 'active' | 'completed';
};

export function CreateSprintModal({
  open,
  onOpenChange,
  projectId,
  onSave,
}: CreateSprintModalProps) {
  const today = new Date().toISOString().split('T')[0];
  const twoWeeksLater = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const [formData, setFormData] = useState<SprintFormData>({
    name: '',
    goal: '',
    maxStoryPoint: 0,
    startDate: today,
    endDate: twoWeeksLater,
    status: 'planned',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SprintFormData, string>>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Partial<Record<keyof SprintFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Sprint name is required';
    }

    if (!formData.goal.trim()) {
      newErrors.goal = 'Sprint goal is required';
    }

    if (formData.maxStoryPoint <= 0) {
      newErrors.maxStoryPoint = 'Story points must be greater than 0';
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save sprint
    onSave(formData);

    // Reset form
    setFormData({
      name: '',
      goal: '',
      maxStoryPoint: 0,
      startDate: today,
      endDate: twoWeeksLater,
      status: 'planned',
    });
    setErrors({});
    onOpenChange(false);
  };

  const handleChange = (field: keyof SprintFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            Create New Sprint
          </DialogTitle>
          <DialogDescription>
            Set up a new sprint for your project. Define goals, timeline, and capacity.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Sprint Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Sprint Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Sprint 1, November Sprint"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Sprint Goal */}
            <div className="space-y-2">
              <Label htmlFor="goal">
                Sprint Goal <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="goal"
                placeholder="e.g., Complete user authentication and profile management features"
                value={formData.goal}
                onChange={(e) => handleChange('goal', e.target.value)}
                rows={3}
                className={errors.goal ? 'border-red-500' : ''}
              />
              {errors.goal && (
                <p className="text-xs text-red-500">{errors.goal}</p>
              )}
            </div>

            {/* Max Story Points */}
            <div className="space-y-2">
              <Label htmlFor="maxStoryPoint" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Max Story Points <span className="text-red-500">*</span>
              </Label>
              <Input
                id="maxStoryPoint"
                type="number"
                min="0"
                placeholder="e.g., 50"
                value={formData.maxStoryPoint || ''}
                onChange={(e) => handleChange('maxStoryPoint', parseInt(e.target.value) || 0)}
                className={errors.maxStoryPoint ? 'border-red-500' : ''}
              />
              {errors.maxStoryPoint && (
                <p className="text-xs text-red-500">{errors.maxStoryPoint}</p>
              )}
              <p className="text-xs text-gray-500">
                The maximum story points this sprint can handle
              </p>
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
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">
                  End Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  className={errors.endDate ? 'border-red-500' : ''}
                />
                {errors.endDate && (
                  <p className="text-xs text-red-500">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Sprint Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'planned' | 'active' | 'completed') =>
                  handleChange('status', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      Planned
                    </div>
                  </SelectItem>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      Active
                    </div>
                  </SelectItem>
                  <SelectItem value="completed">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-500" />
                      Completed
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Default is &quot;planned&quot; - change to &quot;active&quot; to start immediately
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm text-blue-900 mb-1">Sprint Planning Tips</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Choose a clear, achievable goal for your sprint</li>
                    <li>• Typical sprints run for 1-4 weeks</li>
                    <li>• Set story points based on your team&apos;s velocity</li>
                    <li>• You can always adjust tasks and timeline later</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Create Sprint
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
