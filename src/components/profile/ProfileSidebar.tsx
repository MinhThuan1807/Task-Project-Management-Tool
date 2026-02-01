'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera } from 'lucide-react'
import type { ProfileFormData } from './ProfileContainer'
import { User } from '@/lib/types'

interface ProfileSidebarProps {
  currentUser: User
  formData: ProfileFormData
}

export function ProfileSidebar({ currentUser, formData }: ProfileSidebarProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="relative group">
            <Avatar className="w-32 h-32 ring-4 ring-blue-100">
              <AvatarImage src={currentUser?.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-3xl">
                {formData.displayName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </button>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mt-4">
            {currentUser?.displayName}
          </h2>
          {/* <p className="text-sm text-gray-600 mt-1">{formData.title}</p> */}

          {/* Stats */}
          <div className="w-full mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-xs text-gray-600 mt-1">Projects</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-600">45</div>
              <div className="text-xs text-gray-600 mt-1">Tasks</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-xs text-gray-600 mt-1">Teams</div>
            </div>
          </div>

          {/* Bio */}
          {/* <div className="w-full mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">About</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{formData.bio}</p>
          </div> */}
        </div>
      </CardContent>
    </Card>
  )
}