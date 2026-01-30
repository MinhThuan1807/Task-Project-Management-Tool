export type SprintProgressReport = {
  name: string
  value: number
  color: string
}
export type VelocityReportItem = {
  sprint: string
  planned: number
  completed: number
}

export type SprintMemberDistributionReport = {
  name: string
  done: number
  inProgress: number
  todo: number
}

export type SprintProgressPayload = {
  sprintId: string
  sprintName?: string
  totalMembers: number
  progressData: SprintProgressReport[]
}

export type VelocityProjectPayload = {
  projectId: string
  projectName?: string
  velocityData: VelocityReportItem[]
}

export type SprintMemberDistributionPayload = {
  sprintId: string
  sprintName?: string
  totalMembers: number
  memberDistribution: SprintMemberDistributionReport[]
}

export type ReportResponse<T> = {
  data: T
  message: string
  statusCode: number
}