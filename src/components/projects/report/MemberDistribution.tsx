'use client'
import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '../../ui/card'
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { Users } from 'lucide-react'

type Member = { name: string; done: number; inProgress: number; todo: number }
type Props = {
  memberDistribution: Member[]
  teamStats: { totalCompleted: number; totalInProgress?: number }
}

export default function MemberDistribution({
  memberDistribution,
  teamStats
}: Props) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>👥 Task Distribution by Member</CardTitle>
        <CardDescription>Team workload overview</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={memberDistribution} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="done" stackId="a" fill="#10b981" name="Done" />
            <Bar
              dataKey="inProgress"
              stackId="a"
              fill="#f59e0b"
              name="In Progress"
            />
            <Bar dataKey="todo" stackId="a" fill="#3b82f6" name="Todo" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-900">
            <Users className="w-4 h-4 inline mr-1" />
            Team completed {teamStats.totalCompleted} tasks,{' '}
            {teamStats.totalInProgress ?? 0} in progress
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
