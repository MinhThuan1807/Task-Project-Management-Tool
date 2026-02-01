'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Mail, User, MapPin, Calendar, Users, Loader2 } from 'lucide-react'
import type { ProfileFormData } from './ProfileContainer'

interface ProfileFormProps {
  formData: ProfileFormData
  setFormData: (data: ProfileFormData) => void
  isEditing: boolean
  setIsEditing: (value: boolean) => void
  onSave: () => void
  isLoading?: boolean
}

export function ProfileForm({
  formData,
  setFormData,
  isEditing,
  setIsEditing,
  onSave,
  isLoading = false
}: ProfileFormProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Personal Information
          </CardTitle>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isLoading}
            >
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={onSave}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Form Fields */}
        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <Label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <User className="w-4 h-4" />
              Full Name
            </Label>
            <Input
              type="text"
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
              disabled={!isEditing}
              className="disabled:bg-gray-50 disabled:text-gray-600"
            />
          </div>

          {/* Email */}
          <div>
            <Label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={true}
              className="disabled:bg-gray-50 disabled:text-gray-600"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <Label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              Date of Birth
            </Label>
            <Input
              type="date"
              value={
                typeof formData.dob === 'string'
                  ? formData.dob
                  : formData.dob?.toISOString().split('T')[0] || ''
              }
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
              disabled={!isEditing}
              className="disabled:bg-gray-50 disabled:text-gray-600"
            />
          </div>

          {/* Gender */}
          <div>
            <Label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <Users className="w-4 h-4" />
              Gender
            </Label>
            <Select
              value={formData.gender}
              onValueChange={(value) =>
                setFormData({ ...formData, gender: value })
              }
              disabled={!isEditing}
            >
              <SelectTrigger className="disabled:bg-gray-50 disabled:text-gray-600">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div>
            <Label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              Location
            </Label>
            <Input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              disabled={!isEditing}
              className="disabled:bg-gray-50 disabled:text-gray-600"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
