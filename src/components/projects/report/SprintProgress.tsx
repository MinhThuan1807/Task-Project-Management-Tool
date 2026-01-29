'use client'
import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '../../ui/card'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

type Item = { name: string; value: number; color: string }
type Props = { progressData: Item[] }

type LabelProps = {
  name?: string
  percent?: number
}

export default function SprintProgress({ progressData }: Props) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>📊 Sprint Progress</CardTitle>
        <CardDescription>Task distribution by status</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={progressData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }: LabelProps) =>
                `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {progressData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {progressData.map((item) => (
            <div key={item.name} className="text-center">
              <div
                className="w-3 h-3 rounded-full mx-auto mb-1"
                style={{ backgroundColor: item.color }}
              />
              <p className="text-xs text-gray-600">{item.name}</p>
              <p className="text-sm">{item.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
