'use client'

import { ProfileSidebar } from './ProfileSidebar'
import { ProfileForm } from './ProfileForm'
import { ProfileActivity } from './ProfileActivity'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCurrentUser,
  updateUserProfile
} from '@/lib/features/auth/authSlice'
import { useState } from 'react'
import { authApi } from '@/lib/services/auth.service'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/utils'
import { useAppDispatch } from '@/lib/hooks'

export interface ProfileFormData {
  displayName: string
  email: string
  address: string
  dob: string | Date
  gender: string
}

export function ProfileContainer() {
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useAppDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: currentUser?.displayName || 'John Doe',
    email: currentUser?.email || 'john.doe@example.com',
    address: currentUser?.address || 'San Francisco, CA',
    dob: currentUser?.dob || '1990-01-01',
    gender: currentUser?.gender || ''
  })

  const handleSave = async () => {
    try {
      setIsLoading(true)

      // Call API to update profile
      const response = await authApi.updateProfile({
        displayName: formData.displayName,
        address: formData.address,
        dob: formData.dob,
        gender: formData.gender
      })

      // Update Redux state with the response data
      dispatch(
        updateUserProfile({
          displayName: response.data.displayName,
          address: response.data.address,
          dob: response.data.dob,
          gender: response.data.gender
        })
      )

      toast.success('Profile updated successfully')
      setIsEditing(false)
    } catch (error) {
      toast.error(getErrorMessage(error) || 'Failed to update profile')
      console.error('Error updating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <ProfileSidebar currentUser={currentUser!} formData={formData} />
          </div>

          {/* Main Content - Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            <ProfileForm
              formData={formData}
              setFormData={setFormData}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              onSave={handleSave}
              isLoading={isLoading}
            />

            <ProfileActivity />
          </div>
        </div>
      </div>
    </div>
  )
}
