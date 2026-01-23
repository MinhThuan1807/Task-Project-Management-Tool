'use client'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import {
  TrendingUp,
  Users,
  CheckCircle2,
  Target,
  Download,
  Calendar,
  Activity,
  FileText,
  BarChart3
} from 'lucide-react'
import { formatDate } from '../../lib/utils'
import { useAllProjects } from '@/lib/hooks/useProjects'
import { useSprintsByProject } from '@/lib/hooks/useSprints'
import { useParams } from 'next/navigation'

export function ReportsView() {
  const param = useParams()
  const projectId = param.id as string
  const { data: projects } = useAllProjects()
  const project = projects?.find((p) => p._id === projectId)
  const { data: sprints } = useSprintsByProject(projectId)

  const [selectedSprintId, setSelectedSprintId] = useState<string>(
    sprints?.[0]?._id || ''
  )
  // ============= MOCK DATA FOR CHARTS =============
  // 1. BURNDOWN CHART DATA
  const burndownData = [
    { day: 'Day 1', ideal: 100, actual: 100 },
    { day: 'Day 2', ideal: 93, actual: 95 },
    { day: 'Day 3', ideal: 86, actual: 88 },
    { day: 'Day 4', ideal: 79, actual: 82 },
    { day: 'Day 5', ideal: 71, actual: 75 },
    { day: 'Day 6', ideal: 64, actual: 68 },
    { day: 'Day 7', ideal: 57, actual: 60 },
    { day: 'Day 8', ideal: 50, actual: 52 },
    { day: 'Day 9', ideal: 43, actual: 45 },
    { day: 'Day 10', ideal: 36, actual: 38 },
    { day: 'Day 11', ideal: 29, actual: 30 },
    { day: 'Day 12', ideal: 21, actual: 22 },
    { day: 'Day 13', ideal: 14, actual: 15 },
    { day: 'Day 14', ideal: 7, actual: 8 },
    { day: 'Day 15', ideal: 0, actual: 0 }
  ]
  // 2. SPRINT PROGRESS PIE CHART DATA
  const progressData = [
    { name: 'Backlog', value: 5, color: '#94a3b8' },
    { name: 'Todo', value: 8, color: '#3b82f6' },
    { name: 'In Process', value: 12, color: '#f59e0b' },
    { name: 'Review', value: 6, color: '#8b5cf6' },
    { name: 'Done', value: 15, color: '#10b981' }
  ]

  const totalTasks = progressData.reduce((sum, item) => sum + item.value, 0)
  const completedTasks = progressData.find((item) => item.name === 'Done')?.value || 0
  const completionRate = ((completedTasks / totalTasks) * 100).toFixed(1)

  // 3. VELOCITY CHART DATA
  const velocityData = [
    { sprint: 'Sprint 1', planned: 80, completed: 75 },
    { sprint: 'Sprint 2', planned: 85, completed: 82 },
    { sprint: 'Sprint 3', planned: 90, completed: 88 },
    { sprint: 'Sprint 4', planned: 85, completed: 85 },
    { sprint: 'Sprint 5', planned: 95, completed: 92 },
    { sprint: 'Sprint 6', planned: 100, completed: 0 } // Current sprint
  ]

  const avgVelocity = (
    velocityData.slice(0, -1).reduce((sum, s) => sum + s.completed, 0) /
    (velocityData.length - 1)
  ).toFixed(1)

  // 4. TASK DISTRIBUTION BY MEMBER DATA
  const memberDistribution = [
    {
      name: 'Alice Johnson',
      done: 12,
      inProgress: 4,
      todo: 3
    },
    {
      name: 'Bob Smith',
      done: 10,
      inProgress: 5,
      todo: 2
    },
    {
      name: 'Carol White',
      done: 8,
      inProgress: 3,
      todo: 4
    },
    {
      name: 'David Brown',
      done: 7,
      inProgress: 2,
      todo: 3
    }
  ]

  // Calculate team stats
  const teamStats = {
    totalMembers: memberDistribution.length,
    totalCompleted: memberDistribution.reduce((sum, m) => sum + m.done, 0),
    totalInProgress: memberDistribution.reduce((sum, m) => sum + m.inProgress, 0)
  }

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Project Reports
            </h1>
            <p className="text-gray-600">{project?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedSprintId} onValueChange={setSelectedSprintId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Sprint" />
              </SelectTrigger>
              <SelectContent>
                {sprints?.map((sprint) => (
                  <SelectItem key={sprint._id} value={sprint._id}>
                    {sprint.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Sprint Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl">{completionRate}%</div>
                <BarChart3 className="w-8 h-8 opacity-80" />
              </div>
              <p className="text-xs opacity-75 mt-1">{completedTasks}/{totalTasks} tasks completed</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Avg Velocity</CardTitle>
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
              <CardTitle className="text-sm font-medium opacity-90">Team Size</CardTitle>
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
              <CardTitle className="text-sm font-medium opacity-90">Completed</CardTitle>
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

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Burndown Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>📉 Burndown Chart</CardTitle>
              <CardDescription>
                Story points remaining over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={burndownData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
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

          {/* 2. Sprint Progress Pie Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>📊 Sprint Progress</CardTitle>
              <CardDescription>
                Task distribution by status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={progressData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
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
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 3. Velocity Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>⚡ Velocity Chart</CardTitle>
              <CardDescription>
                Sprint velocity over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={velocityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="sprint"
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
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

          {/* 4. Task Distribution by Member */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>👥 Task Distribution by Member</CardTitle>
              <CardDescription>
                Team workload overview
              </CardDescription>
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
                  <Bar dataKey="inProgress" stackId="a" fill="#f59e0b" name="In Progress" />
                  <Bar dataKey="todo" stackId="a" fill="#3b82f6" name="Todo" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-900">
                  <Users className="w-4 h-4 inline mr-1" />
                  Team completed {teamStats.totalCompleted} tasks, {teamStats.totalInProgress} in progress
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Insights */}
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
                  Sprint velocity is consistent with previous sprints. Team is maintaining steady progress.
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-900 mb-2">⚠️ Watch Out</h4>
                <p className="text-sm text-yellow-700">
                  12 tasks still in progress. Consider daily standups to identify blockers.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">✅ Success</h4>
                <p className="text-sm text-green-700">
                  {completionRate}% completion rate is above the team average of 65%.
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-900 mb-2">📈 Recommendation</h4>
                <p className="text-sm text-purple-700">
                  Based on current velocity, plan for {Math.round(Number(avgVelocity))} story points next sprint.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}