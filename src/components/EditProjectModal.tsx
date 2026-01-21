'use client'
import { useState } from 'react'
import { Upload, Trash2 } from 'lucide-react'
import { Project } from '../lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from './ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from './ui/alert-dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { useCurrentUser } from '@/lib/hooks/useAuth'
import { useAllProjects, useDeleteProject } from '@/lib/hooks/useProjects'
import { useParams, useRouter } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'

type EditProjectModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (projectId: string, updates: Partial<Project>) => void
}

export function EditProjectModal({
  open,
  onOpenChange,
  onSave
}: EditProjectModalProps) {
  const { data: user } = useCurrentUser()
  const { data: allProjects, isLoading: projectsLoading } = useAllProjects()
  const params = useParams()
  const projectId = params.id as string
  const project = allProjects.find((p) => p._id === projectId)
  const isOwner = project?.ownerId === user?._id
  const router = useRouter()

  const deleteProject = useDeleteProject()

  const [name, setName] = useState(project?.name || '')
  const [description, setDescription] = useState(project?.description || '')
  // const [status, setStatus] = useState<'active' | 'archived' | 'completed'>(project?.status);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    // e.preventDefault();
    // onSave(project.id, {
    //   name,
    //   description,
    //   status,
    // });
    // onOpenChange(false);
  }

  const handleDelete = () => {
    deleteProject.mutate(projectId, {
      onSuccess: () => {
        router.push('/dashboard')
      }
    })
  }

  const handleClose = () => {
    // Reset form to original values when closing
    // setName(project.name);
    // setDescription(project.description || '');
    // setStatus(project.status);
    // onOpenChange(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle>Edit Project</DialogTitle>
                <DialogDescription>
                  Update project details and settings.{' '}
                  {!isOwner &&
                    'You can only view this information as you are not the project owner.'}
                </DialogDescription>
              </div>
              {isOwner && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 py-4">
              {/* Project Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Project Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name ?? ''}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter project name"
                  required
                  disabled={!isOwner}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter project description"
                  rows={4}
                  disabled={!isOwner}
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Project Status</Label>
                <div className="flex gap-2">
                  {/* {(['active', 'completed', 'archived'] as const).map((statusOption) => (
                    <Button
                      key={statusOption}
                      type="button"
                      variant={status === statusOption ? 'default' : 'outline'}
                      onClick={() => setStatus(statusOption)}
                      disabled={!isOwner}
                      className={
                        status === statusOption
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                          : ''
                      }
                    >
                      {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                    </Button>
                  ))} */}
                </div>
              </div>

              {/* Project Image */}
              <div className="space-y-2">
                <Label>Project Image</Label>
                <div className="flex items-center gap-4">
                  {project?.imageUrl && (
                    <Image
                      src={project.imageUrl}
                      alt={project.name}
                      className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                      width={80}
                      height={80}
                    />
                  )}
                  <div className="flex-1">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created:</span>
                  <span className="text-sm text-gray-900">
                    {project?.createdAt ? formatDate(project.createdAt) : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Team Members:</span>
                  <Badge variant="outline">
                    {project?.members.length} members
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Your Role:</span>
                  <Badge
                    className={
                      isOwner
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }
                  >
                    {isOwner ? 'Owner (PM)' : 'Member'}
                  </Badge>
                </div>
              </div>

              {!isOwner && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    ℹ️ Only the project owner can edit project settings. Contact
                    the project owner to make changes.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                {isOwner ? 'Cancel' : 'Close'}
              </Button>
              {isOwner && (
                <Button
                  type="submit"
                  disabled={!name.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  Save Changes
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{project?.name}"? This action
              cannot be undone and will permanently delete:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All sprints and tasks</li>
                <li>All chat messages</li>
                <li>All project data</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
