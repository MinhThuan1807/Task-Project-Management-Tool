'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { TrendingUp, Users, CheckCircle2, BarChart3 } from 'lucide-react'

type Props = {
  completionRate: string
  completedTasks: number
  totalTasks: number
  avgVelocity: string
  teamStats: { totalMembers: number; totalCompleted: number }
}

export default function StatsCards({
  completionRate,
  completedTasks,
  totalTasks,
  avgVelocity,
  teamStats
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium opacity-90">
            Sprint Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl">{completionRate}%</div>
            <BarChart3 className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-xs opacity-75 mt-1">
            {completedTasks}/{totalTasks} tasks completed
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium opacity-90">
            Avg Velocity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl">{avgVelocity}</div>
            <TrendingUp className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-xs opacity-75 mt-1">Story points per sprint</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium opacity-90">
            Team Size
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl">{teamStats.totalMembers}</div>
            <Users className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-xs opacity-75 mt-1">Active members</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium opacity-90">
            Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl">{teamStats.totalCompleted}</div>
            <CheckCircle2 className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-xs opacity-75 mt-1">Tasks this sprint</p>
        </CardContent>
      </Card>
    </div>
  )
}
