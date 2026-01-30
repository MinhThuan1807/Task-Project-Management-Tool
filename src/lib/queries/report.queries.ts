import { queryOptions } from '@tanstack/react-query'
import {
  SprintProgressReport,
  VelocityReportItem,
  SprintMemberDistributionReport
} from '@/lib/types'
import { reportApi } from '@/lib/services/report.service'

export const reportKeys = {
  all: ['reports'] as const,
  sprintProgress: (sprintId: string) =>
    [...reportKeys.all, 'sprint', 'progress', sprintId] as const,
  projectVelocity: (projectId: string) =>
    [...reportKeys.all, 'project', 'velocity', projectId] as const,
  sprintMemberDistribution: (sprintId: string) =>
    [...reportKeys.all, 'sprint', 'member-distribution', sprintId] as const
}

export function sprintProgressOptions(sprintId?: string) {
  return queryOptions<SprintProgressReport[]>({
    queryKey: sprintId ? reportKeys.sprintProgress(sprintId) : reportKeys.all,
    queryFn: async () => {
      if (!sprintId) return []
      const res = await reportApi.getSprintProgressReport(sprintId)
      // API returns { progressData: [...] } — return the inner array for consumers
      return res?.data?.progressData ?? []
    },
    enabled: !!sprintId,
    staleTime: 5 * 60 * 1000,
    placeholderData: []
  })
}

export function projectVelocityOptions(projectId?: string) {
  return queryOptions<VelocityReportItem[]>({
    queryKey: projectId
      ? reportKeys.projectVelocity(projectId)
      : reportKeys.all,
    queryFn: async () => {
      if (!projectId) return []
      const res = await reportApi.getProjectVelocityReport(projectId)
      return res?.data?.velocityData ?? []
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
    placeholderData: []
  })
}

export function sprintMemberDistributionOptions(sprintId?: string) {
  return queryOptions<SprintMemberDistributionReport[]>({
    queryKey: sprintId
      ? reportKeys.sprintMemberDistribution(sprintId)
      : reportKeys.all,
    queryFn: async () => {
      if (!sprintId) return []
      const res = await reportApi.getSprintMemberDistributionReport(sprintId)
      return res?.data?.memberDistribution ?? []
    },
    enabled: !!sprintId,
    staleTime: 5 * 60 * 1000,
    placeholderData: []
  })
}
