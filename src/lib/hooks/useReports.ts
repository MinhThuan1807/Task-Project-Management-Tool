'use client'
import { useQuery } from '@tanstack/react-query'
import {
  sprintProgressOptions,
  projectVelocityOptions,
  sprintMemberDistributionOptions
} from '@/lib/queries/report.queries'

export function useSprintProgressReport(sprintId: string) {
  return useQuery(sprintProgressOptions(sprintId))
}

export function useProjectVelocityReport(projectId: string) {
  return useQuery(projectVelocityOptions(projectId))
}

export function useSprintMemberDistributionReport(sprintId: string) {
  return useQuery(sprintMemberDistributionOptions(sprintId))
}
