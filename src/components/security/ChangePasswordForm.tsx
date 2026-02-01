'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock } from 'lucide-react'
import { authApi } from '@/lib/services/auth.service'
import { getErrorMessage } from '@/lib/utils'
import { toast } from 'sonner'

export default function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChangePassword = async() => {
    // Handle password change logic
    try {
      setIsLoading(true)
      if (newPassword !== confirmPassword) {
        toast.error('New password and confirmation do not match')
        return
      }
      // Call API to change password
      
      toast.success('Password changed successfully')
    } catch (error) {
      toast.error(getErrorMessage(error) || 'Failed to change password')
    } finally {
      setIsLoading(false)
    }
  
    
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Change Password</CardTitle>
            <CardDescription>
              Update your password regularly to keep your account secure
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="current-password" className="text-sm text-gray-700">
              Current Password
            </Label>
            <Input
              id="current-password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="new-password" className="text-sm text-gray-700">
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="confirm-password" className="text-sm text-gray-700">
              Confirm New Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="mt-2"
            />
          </div>

          
          <Button
            onClick={handleChangePassword}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={isLoading}
          >
            {isLoading ? 'Changing Password...' : 'Change Password'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}