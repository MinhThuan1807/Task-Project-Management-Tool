'use client'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { UserPlus, Mail, Shield, Eye, Crown, X } from 'lucide-react'
import { projectApi } from '@/lib/services/project.service'
import { InviteMemberRequest } from '@/lib/types/project.types'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/utils'

type InviteTeamModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
};

export type InvitationData = {
  email: string;
  role: 'owner' | 'member' | 'viewer';
  projectId?: string;
};

type PendingInvite = {
  id: string;
  email: string;
  role: 'owner' | 'member' | 'viewer';
};

const roleInfo = {
  owner: {
    label: 'Owner',
    description: 'Full access: manage project, sprints, and team',
    icon: Crown,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  member: {
    label: 'Member',
    description: 'Can create and manage tasks, participate in sprints',
    icon: Shield,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  viewer: {
    label: 'Viewer',
    description: 'Read-only access: view project and tasks',
    icon: Eye,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200'
  }
}

export default function InviteTeamModal({
  open,
  onOpenChange,
  projectId

}: InviteTeamModalProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'owner' | 'member' | 'viewer'>('member')
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([])
  const [emailError, setEmailError] = useState('')
  const [isSending, setIsSending] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleAddInvite = () => {
    // Validation
    if (!email.trim()) {
      setEmailError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    // Check duplicate
    if (pendingInvites.some((inv) => inv.email === email)) {
      setEmailError('This email has already been added')
      return
    }

    // Add to pending invites
    const newInvite: PendingInvite = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      role
    }

    setPendingInvites([...pendingInvites, newInvite])
    setEmail('')
    setRole('member')
    setEmailError('')
  }

  const handleRemoveInvite = (id: string) => {
    setPendingInvites(pendingInvites.filter((inv) => inv.id !== id))
  }

  const handleSendInvites = async () => {
    if (pendingInvites.length === 0) {
      return
    }
    setIsSending(true)
    try {
      const invitations: InviteMemberRequest[] = pendingInvites.map((inv) => ({
        email: inv.email,
        role: inv.role,
        projectId: projectId
      }))

      await Promise.all(invitations.map((invitation) => projectApi.inviteMember(invitation)))
      toast.success('Invitations sent successfully!')
      // Reset
      setPendingInvites([])
      setEmail('')
      setRole('member')
      setEmailError('')
      onOpenChange(false)
      setIsSending(false)
    } catch (error) {
      toast.error(getErrorMessage(error) || 'Failed to send invitations')
      setIsSending(false)
    }

  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddInvite()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            Invite Team Members
          </DialogTitle>
          <DialogDescription>
            Invite people to collaborate on this project. You can assign different roles based on their responsibilities.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-4">
          {/* Role Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(roleInfo).map(([key, info]) => {
              const Icon = info.icon
              const roleKey = key as 'owner' | 'member' | 'viewer'
              const isSelected = role === roleKey

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRole(roleKey)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? `${info.borderColor} ${info.bgColor}`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${info.color}`} />
                    <span className={`text-sm ${isSelected ? info.color : 'text-gray-700'}`}>
                      {info.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{info.description}</p>
                </button>
              )
            })}
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setEmailError('')
                    }}
                    onKeyPress={handleKeyPress}
                    className={`pl-10 ${emailError ? 'border-red-500' : ''}`}
                  />
                </div>
                {emailError && (
                  <p className="text-xs text-red-500 mt-1">{emailError}</p>
                )}
              </div>
              <Button
                type="button"
                onClick={handleAddInvite}
                variant="outline"
              >
                Add
              </Button>
            </div>
          </div>

          {/* Pending Invites */}
          {pendingInvites.length > 0 && (
            <div className="space-y-2">
              <Label>Pending Invitations ({pendingInvites.length})</Label>
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-64 overflow-y-auto">
                {pendingInvites.map((invite) => {
                  const info = roleInfo[invite.role]
                  const Icon = info.icon

                  return (
                    <div
                      key={invite.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-8 h-8 ${info.bgColor} rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 ${info.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate">{invite.email}</p>
                          <Badge
                            variant="outline"
                            className={`text-xs ${info.color} ${info.borderColor}`}
                          >
                            {info.label}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveInvite(invite.id)}
                        className="shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {pendingInvites.length === 0 && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600">No invitations added yet</p>
              <p className="text-xs text-gray-500 mt-1">
                Enter an email address and role above to add team members
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm text-blue-900 mb-1">How invitations work</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Invited members will receive an email with a link to join</li>
                  <li>• They&apos;ll need to sign up or log in to accept the invitation</li>
                  <li>• You can change roles anytime from project settings</li>
                  <li>• Owners have full access and can manage the entire project</li>
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
            type="button"
            onClick={handleSendInvites}
            disabled={pendingInvites.length === 0}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            {isSending ? '...' : 'Send Invitations'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
