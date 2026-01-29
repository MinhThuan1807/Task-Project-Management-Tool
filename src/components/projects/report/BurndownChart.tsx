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
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { TrendingUp } from 'lucide-react'

type Props = { burndownData: Array<Record<string, unknown>> }

export default function BurndownChart({ burndownData }: Props) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>📉 Burndown Chart</CardTitle>
        <CardDescription>Story points remaining over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={burndownData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="ideal"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Ideal"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#3b82f6"
              strokeWidth={3}
              name="Actual"
              dot={{ fill: '#3b82f6', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            Sprint is on track. Current velocity matches ideal burndown.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
