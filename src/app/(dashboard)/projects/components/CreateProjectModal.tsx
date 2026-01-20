'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, X, Search, Check, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useCreateProject } from '@/lib/hooks/useProjects' // ✅ Import mutation hook
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { closeCreateModal } from '@/lib/features/project/projectSlice'
import { RootState } from '@/lib/store'

// Storage key for saved emails
const SAVED_EMAILS_KEY = 'sprintos_invited_emails'

// Validation schema
const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .min(3, 'Project name must be at least 3 characters')
    .max(50, 'Project name must be less than 50 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
})

type CreateProjectFormData = z.infer<typeof createProjectSchema>

type MemberRole = 'owner' | 'member' | 'viewer'

interface InvitedMember {
  email: string
  role: MemberRole
}

export function CreateProjectModal() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [invitedMembers, setInvitedMembers] = useState<InvitedMember[]>([])
  const [emailInput, setEmailInput] = useState('')
  const [selectedRole, setSelectedRole] = useState<MemberRole>('member')
  const [savedEmails, setSavedEmails] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // ✅ Sử dụng mutation hook thay vì isLoading state
  const createProject = useCreateProject()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  })

  // Load saved emails from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(SAVED_EMAILS_KEY)
    if (stored) {
      try {
        setSavedEmails(JSON.parse(stored))
      } catch {
        setSavedEmails([])
      }
    }
  }, [])

  // Filter suggestions based on input
  const filteredSuggestions = savedEmails.filter(
    (email) =>
      email.toLowerCase().includes(emailInput.toLowerCase()) &&
      !invitedMembers.some((m) => m.email === email)
  )

  // Save email to localStorage
  const saveEmailToStorage = (email: string) => {
    const updatedEmails = [...new Set([email, ...savedEmails])].slice(0, 20) // Keep max 20 emails
    setSavedEmails(updatedEmails)
    localStorage.setItem(SAVED_EMAILS_KEY, JSON.stringify(updatedEmails))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleAddMember = (emailToAdd?: string) => {
    const email = emailToAdd || emailInput.trim()

    if (!email) return

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    if (invitedMembers.some((m) => m.email === email)) {
      toast.error('This email is already added')
      return
    }

    setInvitedMembers([...invitedMembers, { email, role: selectedRole }])
    saveEmailToStorage(email)
    setEmailInput('')
    setShowSuggestions(false)
  }

  const handleRemoveMember = (email: string) => {
    setInvitedMembers(invitedMembers.filter((m) => m.email !== email))
  }

  const handleUpdateMemberRole = (email: string, role: MemberRole) => {
    setInvitedMembers(
      invitedMembers.map((m) => (m.email === email ? { ...m, role } : m))
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddMember()
    }
  }

  const onSubmit = async (data: CreateProjectFormData) => {
    const payload = {
      name: data.name,
      description: data.description,
      members: invitedMembers.length > 0 ? invitedMembers : undefined,
      imageUrl: imageFile || undefined
    }

    createProject.mutate(payload, {
      onSuccess: () => {
        toast.success(`Project "${data.name}" created successfully!`)
        handleClose()
      }
    })
  }

  const handleClose = () => {
    reset()
    setImageFile(null)
    setImagePreview(null)
    setInvitedMembers([])
    setEmailInput('')
    setSelectedRole('member')
    setShowSuggestions(false)
    dispatch(closeCreateModal())
  }

  const getRoleColor = (role: MemberRole) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-700'
      case 'member':
        return 'bg-blue-100 text-blue-700'
      case 'viewer':
        return 'bg-gray-100 text-gray-700'
    }
  }
  const dispatch = useDispatch()
  const open = useSelector(
    (state: RootState) => state.project.isCreateModalOpen
  )

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      dispatch(closeCreateModal())
    }
  }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Create a new project to organize your tasks and collaborate with
            your team.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Project Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter project name"
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
                disabled={createProject.isPending} // ✅ Dùng isPending từ mutation
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your project..."
                rows={4}
                {...register('description')}
                className={errors.description ? 'border-red-500' : ''}
                disabled={createProject.isPending} // ✅ Dùng isPending
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Project Image */}
            <div className="space-y-2">
              <Label>Project Image</Label>
              <div className="flex items-start gap-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Project preview"
                      className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      disabled={createProject.isPending} // ✅ Dùng isPending
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-2xl text-white">⚡</span>
                  </div>
                )}
                <div className="flex-1">
                  <label
                    htmlFor="image-upload"
                    className={`block border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors ${
                      createProject.isPending
                        ? 'cursor-not-allowed opacity-50'
                        : 'cursor-pointer'
                    }`}
                  >
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload image
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={createProject.isPending} // ✅ Dùng isPending
                  />
                </div>
              </div>
            </div>

            {/* Invite Members */}
            <div className="space-y-4">
              <Label>Invite Team Members</Label>

              {/* Selected Members */}
              {invitedMembers.length > 0 && (
                <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                  {invitedMembers.map((member) => (
                    <div
                      key={member.email}
                      className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg border"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                            {member.email.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm truncate">{member.email}</span>
                        <Badge className={getRoleColor(member.role)}>
                          {member.role}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={member.role}
                          onValueChange={(value: MemberRole) =>
                            handleUpdateMemberRole(member.email, value)
                          }
                          disabled={createProject.isPending} // ✅ Dùng isPending
                        >
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(member.email)}
                          className="p-1 hover:text-red-600 transition-colors"
                          disabled={createProject.isPending} // ✅ Dùng isPending
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Email Input with Suggestions */}
              <div className="relative">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Enter email address..."
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value)
                        setShowSuggestions(true)
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() =>
                        setTimeout(() => setShowSuggestions(false), 200)
                      }
                      onKeyDown={handleKeyDown}
                      className="pl-10"
                      disabled={createProject.isPending} // ✅ Dùng isPending
                    />

                    {/* Email Suggestions Dropdown */}
                    {showSuggestions &&
                      filteredSuggestions.length > 0 &&
                      emailInput && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                          {filteredSuggestions.map((email) => (
                            <button
                              key={email}
                              type="button"
                              onClick={() => {
                                setEmailInput(email)
                                handleAddMember(email)
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-left"
                            >
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                                  {email.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{email}</span>
                            </button>
                          ))}
                        </div>
                      )}
                  </div>

                  <Select
                    value={selectedRole}
                    onValueChange={(value: MemberRole) =>
                      setSelectedRole(value)
                    }
                    disabled={createProject.isPending} // ✅ Dùng isPending
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddMember()}
                    disabled={!emailInput.trim() || createProject.isPending} // ✅ Dùng isPending
                  >
                    Add
                  </Button>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                {invitedMembers.length} member
                {invitedMembers.length !== 1 ? 's' : ''} invited
                {savedEmails.length > 0 && (
                  <span className="ml-2">
                    • Start typing to see suggestions
                  </span>
                )}
              </p>
            </div>
            <DialogFooter className="border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createProject.isPending} // ✅ Dùng isPending
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createProject.isPending} // ✅ Dùng isPending
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {createProject.isPending ? ( // ✅ Dùng isPending
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Project'
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
