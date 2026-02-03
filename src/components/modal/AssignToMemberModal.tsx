'use client'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { Users, Mail, CheckCircle2, Loader2 } from 'lucide-react'
import { ScrollArea } from '../ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Checkbox } from '../ui/checkbox'
import { Project } from '../../lib/types'
import { useUpdateTask } from '@/lib/hooks/useTasks'
import { toast } from 'sonner'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { getErrorMessage } from '@/lib/utils'

type AssignToMemberModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  taskTitle?: string;
  project: Project;
  currentAssignees?: string[];
  onChangeAssignees?: (newAssigneeIds: string[]) => void;
};

export function AssignToMemberModal({
  open,
  onOpenChange,
  taskId,
  taskTitle,
  project,
  currentAssignees = [],
  onChangeAssignees
}: AssignToMemberModalProps) {
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(currentAssignees)

  // sync when modal opens or currentAssignees changes
  useEffect(() => {
    if (open) setSelectedMemberIds(currentAssignees)
  }, [open, currentAssignees])

  const updateTaskMutation = useUpdateTask(taskId)

  const activeMembers = project.members.filter(m => m.status === 'active')
  const owner = activeMembers.find(m => m.memberId === project.ownerId)
  const otherMembers = activeMembers.filter(m => m.memberId !== project.ownerId && m.role !== 'viewer')

  const handleToggleMember = (memberId: string) => {
    setSelectedMemberIds(prev =>
      prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
    )
  }

  const handleAssign = async () => {
    try {
      await updateTaskMutation.mutateAsync({
        assigneeIds: selectedMemberIds
      })
      toast.success(`Task assigned to ${selectedMemberIds.length} member(s) successfully!`)
      onOpenChange(false)
      if (onChangeAssignees) {
        onChangeAssignees(selectedMemberIds)
      }
    } catch (error) {
      // console.error('Failed to assign task:', error)
      toast.error(getErrorMessage(error))
    }
  }

  const handleClose = () => {
    setSelectedMemberIds(currentAssignees)
    onOpenChange(false)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
    case 'owner':
      return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
    case 'member':
      return 'bg-blue-100 text-blue-700'
    case 'viewer':
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
    }
  }

  const selectedDisplay = selectedMemberIds.length === 0
    ? 'No members selected'
    : selectedMemberIds.length === 1
      ? activeMembers.find(m => m.memberId === selectedMemberIds[0])?.email ?? `${selectedMemberIds.length} selected`
      : `${selectedMemberIds.length} selected`

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Assign Task to Members
          </DialogTitle>
          <DialogDescription>
            Select team members to assign this task to. You can assign multiple members.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Task:</p>
            <p className="text-sm text-gray-900 font-medium">{taskTitle}</p>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Select Team Members</Label>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {selectedMemberIds.length} selected
            </Badge>
          </div>

          <div>
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full text-left rounded-md border border-gray-200 px-3 py-2 bg-white flex items-center justify-between">
                  <span className="text-sm text-gray-700">{selectedDisplay}</span>
                  <span className="text-xs text-gray-400">▾</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <ScrollArea className="max-h-60 overflow-auto">
                  {/* Owner */}
                  {owner && (
                    <>
                      <div className="px-2 py-1.5 text-xs text-gray-500 font-medium">Project Owner</div>
                      <div
                        key={owner.memberId}
                        onClick={() => handleToggleMember(owner.memberId)}
                        className={`flex items-center gap-3 p-2 cursor-pointer ${selectedMemberIds.includes(owner.memberId) ? 'bg-blue-50' : ''}`}
                      >
                        <Checkbox
                          checked={selectedMemberIds.includes(owner.memberId)}
                          onCheckedChange={() => handleToggleMember(owner.memberId)}
                        />
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${owner.email}`} />
                          <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
                            {owner.email.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-gray-900">{owner.email}</p>
                          <Badge className={`${getRoleBadgeColor(owner.role)} text-xs mt-1`}>👑 {owner.role}</Badge>
                        </div>
                        {selectedMemberIds.includes(owner.memberId) && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                      </div>
                    </>
                  )}

                  {/* Team members */}
                  {otherMembers.length > 0 &&(
                    <>
                      <div className="px-2 py-1.5 text-xs text-gray-500 font-medium mt-2">Team Members</div>
                      {otherMembers.map(member => (
                        <div
                          key={member.memberId}
                          onClick={() => handleToggleMember(member.memberId)}
                          className={`flex items-center gap-3 p-2 cursor-pointer ${selectedMemberIds.includes(member.memberId) ? 'bg-blue-50' : ''}`}
                        >
                          <Checkbox
                            checked={selectedMemberIds.includes(member.memberId)}
                            onCheckedChange={() => handleToggleMember(member.memberId)}
                          />
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.email}`} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              {member.email.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-gray-900">{member.email}</p>
                            <Badge className={`${getRoleBadgeColor(member.role)} text-xs mt-1`}>{member.role}</Badge>
                          </div>
                          {selectedMemberIds.includes(member.memberId) && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                        </div>
                      ))}
                    </>
                  )}
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>

          {selectedMemberIds.length > 0 &&  (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Assignment notification</p>
                  <p className="text-xs">Selected members will be notified about this task assignment.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={updateTaskMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={selectedMemberIds.length === 0 || updateTaskMutation.isPending}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            {updateTaskMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Assigning...
              </>
            ) : (
              'Assign Task'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}