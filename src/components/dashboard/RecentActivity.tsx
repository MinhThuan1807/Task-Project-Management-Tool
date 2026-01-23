'use client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowUpRight } from 'lucide-react'

const recentActivity = [
  {
    user: 'Alice Johnson',
    action: 'completed task',
    target: 'Setup authentication module',
    time: '2 hours ago',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'
  },
  {
    user: 'Bob Smith',
    action: 'created sprint',
    target: 'Sprint 4',
    time: '5 hours ago',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
  },
  {
    user: 'Charlie Wilson',
    action: 'commented on',
    target: 'Payment integration',
    time: '1 day ago',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie'
  },
  {
    user: 'Diana Chen',
    action: 'moved task',
    target: 'API documentation',
    time: '2 days ago',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana'
  }
]

const RecentActivity = () => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates across your projects</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-600">
            View All
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={activity.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {activity.user.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span>{' '}
                  <span className="text-gray-600">{activity.action}</span>{' '}
                  <span className="font-medium text-blue-600">{activity.target}</span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                Task
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentActivity
