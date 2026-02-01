'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Monitor } from 'lucide-react'

interface Session {
  device: string
  location: string
  ip: string
  lastActive: string
  current: boolean
}

interface ActiveSessionsProps {
  sessions: Session[]
}

export default function ActiveSessions({ sessions }: ActiveSessionsProps) {
  return (
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
          {sessions.map((session, index) => (
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
  )
}