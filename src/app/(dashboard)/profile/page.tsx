'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  Mail,
  User,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  FolderKanban,
  CheckCircle2,
  Users as UsersIcon,
} from 'lucide-react';
import { useCurrentUser } from '@/lib/hooks/useAuth';

export default function ProfilePage() {
  const { data: currentUser } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Product Manager',
    bio: 'Passionate about building great products and leading amazing teams. I love solving complex problems and creating user-centric solutions.',
  });

  const recentActivity = [
    {
      action: 'Completed task',
      detail: '"Setup development environment"',
      time: '2 hours ago',
      color: 'green',
    },
    {
      action: 'Created sprint',
      detail: '"Sprint 3 - Q1 Features"',
      time: '5 hours ago',
      color: 'blue',
    },
    {
      action: 'Joined project',
      detail: '"E-commerce Platform"',
      time: '1 day ago',
      color: 'purple',
    },
    {
      action: 'Commented on',
      detail: '"Payment integration task"',
      time: '2 days ago',
      color: 'orange',
    },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Handle save logic here
  };

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Profile Card */}
          <div className="lg:col-span-1">
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
                  <p className="text-sm text-gray-600 mt-1">{formData.title}</p>

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
                  <div className="w-full mt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">About</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{formData.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Profile Form */}
          <div className="lg:col-span-2 space-y-6">
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
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Save Changes
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
                      disabled={!isEditing}
                      className="disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <Label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      disabled={!isEditing}
                      placeholder="+1 (555) 000-0000"
                      className="disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <Label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </Label>
                    <Input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      disabled={!isEditing}
                      className="disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  {/* Job Title */}
                  <div>
                    <Label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                      <Briefcase className="w-4 h-4" />
                      Job Title
                    </Label>
                    <Input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      disabled={!isEditing}
                      className="disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <Label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                      <Calendar className="w-4 h-4" />
                      Bio
                    </Label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      disabled={!isEditing}
                      rows={4}
                      className="disabled:bg-gray-50 disabled:text-gray-600 resize-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Section */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-b-0"
                    >
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          activity.color === 'green'
                            ? 'bg-green-500'
                            : activity.color === 'blue'
                            ? 'bg-blue-500'
                            : activity.color === 'purple'
                            ? 'bg-purple-500'
                            : 'bg-orange-500'
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          {activity.action}{' '}
                          <span className="text-gray-600">{activity.detail}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}