'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '../../ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../ui/select'
import { Download, FileText } from 'lucide-react'
import { useAllProjects } from '@/lib/hooks/useProjects'
import { useSprintsByProject } from '@/lib/hooks/useSprints'
import {
  useSprintProgressReport,
  useProjectVelocityReport,
  useSprintMemberDistributionReport
} from '@/lib/hooks/useReports'
import { useParams } from 'next/navigation'
import {
  StatsCardsSkeleton,
  BurndownChartSkeleton,
  SprintProgressSkeleton,
  MemberDistributionSkeleton,
  VelocityChartSkeleton,
  InsightsSkeleton
} from './LoadingSkeletons'

const StatsCards = dynamic(() => import('./StatsCards'), {
  ssr: false,
  loading: () => <StatsCardsSkeleton />
})

// const BurndownChart = dynamic(() => import('./BurndownChart'), {
//   ssr: false,
//   loading: () => <BurndownChartSkeleton />
// })
const SprintProgress = dynamic(() => import('./SprintProgress'), {
  ssr: false,
  loading: () => <SprintProgressSkeleton />
})
const VelocityChart = dynamic(() => import('./VelocityChart'), {
  ssr: false,
  loading: () => <VelocityChartSkeleton />
})
const MemberDistribution = dynamic(() => import('./MemberDistribution'), {
  ssr: false,
  loading: () => <MemberDistributionSkeleton />
})
const Insights = dynamic(() => import('./Insights'), {
  ssr: false,
  loading: () => <InsightsSkeleton />
})

export function ReportsView() {
  const param = useParams<{ id: string }>()
  const projectId = param.id
  const [selectedSprintId, setSelectedSprintId] = useState<string>('')

  const { data: projects } = useAllProjects()
  const project = projects?.find((p) => p._id === projectId)

  const { data: sprints } = useSprintsByProject(projectId)

  const sprintProgress = useSprintProgressReport(selectedSprintId)
  const projectVelocity = useProjectVelocityReport(projectId)
  const sprintMemberDistribution = useSprintMemberDistributionReport(selectedSprintId)

  useEffect(() => {
    if (sprints?.length) setSelectedSprintId(sprints[0]._id)
  }, [sprints])
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
  // 2. SPRINT PROGRESS PIE CHART DATA (from API)
  const defaultProgress = [
    { name: 'Backlog', value: 0, color: '#94a3b8' },
    { name: 'Todo', value: 0, color: '#3b82f6' },
    { name: 'In Process', value: 0, color: '#f59e0b' },
    { name: 'Review', value: 0, color: '#8b5cf6' },
    { name: 'Done', value: 0, color: '#10b981' }
  ]

  const progressData = sprintProgress?.data
    ? sprintProgress.data
    : defaultProgress

  const totalTasks = progressData.reduce(
    (sum, item) => sum + (Number(item?.value) || 0),
    0
  )
  const completedTasks =
    progressData.find(
      (item) => String(item?.name || '').toLowerCase() === 'done'
    )?.value || 0

  const completionRate = totalTasks
    ? ((Number(completedTasks) / totalTasks) * 100).toFixed(1)
    : '0.0'

  // 3. VELOCITY CHART DATA
  const velocityData = projectVelocity?.data ? projectVelocity.data : []

  const avgVelocity = (
    velocityData.length > 1
      ? velocityData
          .slice(0, -1)
          .reduce((sum, s) => sum + (s.completed || 0), 0) /
        (velocityData.length - 1)
      : velocityData.reduce((sum, s) => sum + (s.completed || 0), 0) /
        (velocityData.length || 1)
  ).toFixed(1)

  // 4. TASK DISTRIBUTION BY MEMBER DATA
  const memberDistribution = sprintMemberDistribution?.data
    ? sprintMemberDistribution.data
    : []

  // Calculate team stats
  const teamStats = {
    totalMembers: memberDistribution.length,
    totalCompleted: memberDistribution.reduce((sum, m) => sum + m.done, 0),
    totalInProgress: memberDistribution.reduce(
      (sum, m) => sum + (m.inProgress || 0),
      0
    )
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
            <Select
              value={selectedSprintId}
              onValueChange={setSelectedSprintId}
            >
              <SelectTrigger className="w-50">
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
        <StatsCards
          completionRate={completionRate}
          completedTasks={completedTasks}
          totalTasks={totalTasks}
          avgVelocity={avgVelocity}
          teamStats={teamStats}
        />

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* <BurndownChart burndownData={burndownData} /> */}
          <SprintProgress progressData={progressData} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VelocityChart
            velocityData={velocityData}
            avgVelocity={avgVelocity}
          />
          <MemberDistribution
            memberDistribution={memberDistribution}
            teamStats={teamStats}
          />
        </div>

        <Insights completionRate={completionRate} avgVelocity={avgVelocity} />
      </div>
    </div>
  )
}
