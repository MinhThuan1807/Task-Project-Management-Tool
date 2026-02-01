'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const recentActivity = [
  {
    action: 'Completed task',
    detail: '"Setup development environment"',
    time: '2 hours ago',
    color: 'green'
  },
  {
    action: 'Created sprint',
    detail: '"Sprint 3 - Q1 Features"',
    time: '5 hours ago',
    color: 'blue'
  },
  {
    action: 'Joined project',
    detail: '"E-commerce Platform"',
    time: '1 day ago',
    color: 'purple'
  },
  {
    action: 'Commented on',
    detail: '"Payment integration task"',
    time: '2 days ago',
    color: 'orange'
  }
]

export function ProfileActivity() {
  return (
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
  )
}