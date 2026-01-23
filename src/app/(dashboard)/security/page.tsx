'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  Lock,
  Key,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  Monitor,
  Trash2
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  const handleChangePassword = () => {
    // Handle password change logic
    alert('Password changed successfully!')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const activeSessions = [
    {
      device: 'Windows PC',
      location: 'Ho Chi Minh City, Vietnam',
      ip: '192.168.1.100',
      lastActive: 'Active now',
      current: true
    },
    {
      device: 'iPhone 14 Pro',
      location: 'Ho Chi Minh City, Vietnam',
      ip: '192.168.1.101',
      lastActive: '2 hours ago',
      current: false
    },
    {
      device: 'Chrome on MacBook',
      location: 'Hanoi, Vietnam',
      ip: '192.168.1.102',
      lastActive: '1 day ago',
      current: false
    }
  ]

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="p-8 max-w-5xl mx-auto">
        <div className="space-y-6">
          {/* Security Status */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Account Security</h2>
                  <p className="text-green-100 mt-1">
                    Your account is secure and protected
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <CheckCircle2 className="w-6 h-6 mb-2" />
                  <div className="text-sm font-medium">Strong Password</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <CheckCircle2 className="w-6 h-6 mb-2" />
                  <div className="text-sm font-medium">Email Verified</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  {twoFactorEnabled ? (
                    <>
                      <CheckCircle2 className="w-6 h-6 mb-2" />
                      <div className="text-sm font-medium">2FA Enabled</div>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-6 h-6 mb-2" />
                      <div className="text-sm font-medium">2FA Disabled</div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
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
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
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
                >
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
                    <CardDescription>
                      Add an extra layer of security to your account
                    </CardDescription>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </CardHeader>
            {twoFactorEnabled && (
              <CardContent>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-purple-900 mb-4">
                    Scan this QR code with your authenticator app to set up 2FA
                  </p>
                  <div className="flex justify-center">
                    <div className="w-48 h-48 bg-white border-2 border-purple-300 rounded-lg flex items-center justify-center">
                      <Key className="w-12 h-12 text-purple-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Active Sessions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Active Sessions</CardTitle>
                  <CardDescription>
                    Manage devices that are currently logged in
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeSessions.map((session, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg ${
                      session.current
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-gray-900">
                            {session.device}
                          </h4>
                          {session.current && (
                            <Badge className="bg-green-600 hover:bg-green-700">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {session.location} • {session.ip}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Last active: {session.lastActive}
                        </p>
                      </div>
                      {!session.current && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Revoke
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-2 border-red-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-red-900">Danger Zone</CardTitle>
                  <CardDescription className="text-red-600">
                    Irreversible and destructive actions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Delete Account</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          account and remove all your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}