'use client'
import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '../../ui/card'

type Props = { completionRate: string; avgVelocity: string }

export default function Insights({ completionRate, avgVelocity }: Props) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>💡 Sprint Insights</CardTitle>
        <CardDescription>Key takeaways and recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">🎯 On Track</h4>
            <p className="text-sm text-blue-700">
              Sprint velocity is consistent with previous sprints. Team is
              maintaining steady progress.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-900 mb-2">⚠️ Watch Out</h4>
            <p className="text-sm text-yellow-700">
              12 tasks still in progress. Consider daily standups to identify
              blockers.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">✅ Success</h4>
            <p className="text-sm text-green-700">
              {completionRate}% completion rate is above the team average of
              65%.
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">
              📈 Recommendation
            </h4>
            <p className="text-sm text-purple-700">
              Based on current velocity, plan for{' '}
              {Math.round(Number(avgVelocity))} story points next sprint.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
