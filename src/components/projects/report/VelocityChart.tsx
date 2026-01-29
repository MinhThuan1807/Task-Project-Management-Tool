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
import { TrendingUp } from 'lucide-react'

type VelocityItem = {
  sprint: string
  planned: number
  completed: number
}

type Props = { velocityData: VelocityItem[]; avgVelocity: string }

export default function VelocityChart({ velocityData, avgVelocity }: Props) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>⚡ Velocity Chart</CardTitle>
        <CardDescription>Sprint velocity over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={velocityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="sprint" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="planned" fill="#93c5fd" name="Planned" />
            <Bar dataKey="completed" fill="#3b82f6" name="Completed" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-900">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            Average velocity: {avgVelocity} story points
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
