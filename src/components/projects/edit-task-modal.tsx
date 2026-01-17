import { useState } from 'react';
import { Task, BoardColumn } from '@/lib/types';
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
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { X, Trash2, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

type EditTaskModalProps = {
  task: Task;
  boardColumns: BoardColumn[];
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => void;
  onDelete: () => void;
};

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-700' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-700' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-700' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-700' },
];

// Mock comments
const mockComments = [
  {
    id: 'comment-1',
    userId: 'user-1',
    userName: 'Alice Johnson',
    content: 'This looks great! Can we add more test coverage?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'comment-2',
    userId: 'user-2',
    userName: 'Bob Smith',
    content: 'I\'ve started working on this. Should be done by tomorrow.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

export function EditTaskModal({ task, boardColumns, onClose, onSave, onDelete }: EditTaskModalProps) {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority || 'medium',
    boardColumnId: task.boardColumnId,
    storyPoint: task.storyPoint || 0,
    dueDate: task.dueDate || '',
    labels: task.labels || [],
  });
  const [labelInput, setLabelInput] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAddLabel = () => {
    if (labelInput.trim() && !formData.labels.includes(labelInput.trim())) {
      setFormData({
        ...formData,
        labels: [...formData.labels, labelInput.trim()],
      });
      setLabelInput('');
    }
  };

  const handleRemoveLabel = (label: string) => {
    setFormData({
      ...formData,
      labels: formData.labels.filter((l) => l !== label),
    });
  };

  const handleDelete = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  const getRelativeTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle>Edit Task</DialogTitle>
                <DialogDescription>Update task details and track progress</DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <Tabs defaultValue="details" className="space-y-4">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="comments">Comments ({mockComments.length})</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Task Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                {/* Priority & Story Points */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) =>
                        setFormData({ ...formData, priority: value as Task['priority'] })
                      }
                    >
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${option.color}`} />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storyPoint">Story Points</Label>
                    <Input
                      id="storyPoint"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.storyPoint}
                      onChange={(e) =>
                        setFormData({ ...formData, storyPoint: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>

                {/* Status & Due Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="column">Status</Label>
                    <Select
                      value={formData.boardColumnId}
                      onValueChange={(value) => setFormData({ ...formData, boardColumnId: value })}
                    >
                      <SelectTrigger id="column">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {boardColumns.map((column) => (
                          <SelectItem key={column._id} value={column._id}>
                            {column.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Labels */}
                <div className="space-y-2">
                  <Label htmlFor="labels">Labels</Label>
                  <div className="flex gap-2">
                    <Input
                      id="labels"
                      value={labelInput}
                      onChange={(e) => setLabelInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddLabel();
                        }
                      }}
                      placeholder="Add label..."
                    />
                    <Button type="button" variant="outline" onClick={handleAddLabel}>
                      Add
                    </Button>
                  </div>
                        <Badge key={task.labels} variant="outline" className="gap-1">
                          {task.labels}
                          <button
                            type="button"
                            onClick={() => handleRemoveLabel(labels)}
                            className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                </div>

                {/* Assignees */}
                <div className="space-y-2">
                  <Label>Assignees</Label>
                  <div className="flex -space-x-2">
                    {task.assigneeIds?.map((assigneeId) => (
                      <Avatar key={assigneeId} className="w-8 h-8 border-2 border-white">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${assigneeId}`}
                        />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    ))}
                    <Button variant="outline" size="icon" className="w-8 h-8 rounded-full">
                      +
                    </Button>
                  </div>
                </div>

                {/* Metadata */}
                <Separator />
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Created {formatDate(task.createdAt)}</span>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              {/* Comment Input */}
              <div className="flex gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=current" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Input
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Add a comment..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        // Handle comment submission
                        setCommentInput('');
                      }
                    }}
                  />
                  <Button variant="outline">Post</Button>
                </div>
              </div>

              <Separator />

              {/* Comments List */}
              <div className="space-y-4">
                {mockComments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.userId}`}
                      />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">{comment.userName}</span>
                        <span className="text-xs text-gray-500">
                          {getRelativeTime(comment.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <div className="space-y-4">
                {[
                  { action: 'created this task', time: task.createdAt },
                  { action: 'moved to In Progress', time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
                  { action: 'changed priority to High', time: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() },
                ].map((activity, index) => (
                  <div key={index} className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">You</span> {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">{getRelativeTime(activity.time)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{task.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
