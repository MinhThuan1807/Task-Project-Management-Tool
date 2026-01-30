import axiosInstance from '../axios'
import {
  ReportResponse,
  SprintMemberDistributionPayload,
  SprintProgressPayload,
  VelocityProjectPayload
} from '../types/report.types'

export const reportApi = {
  getSprintProgressReport: async (
    sprintId: string
  ): Promise<ReportResponse<SprintProgressPayload>> => {
    const response = await axiosInstance.get<
      ReportResponse<SprintProgressPayload>
    >(`/reports/sprint/${sprintId}/progress`)
    return response.data
  },
  getProjectVelocityReport: async (
    projectId: string
  ): Promise<ReportResponse<VelocityProjectPayload>> => {
    const response = await axiosInstance.get<
      ReportResponse<VelocityProjectPayload>
    >(`/reports/project/${projectId}/velocity`)
    return response.data
  },
  getSprintMemberDistributionReport: async (
    sprintId: string
  ): Promise<ReportResponse<SprintMemberDistributionPayload>> => {
    const response = await axiosInstance.get<
      ReportResponse<SprintMemberDistributionPayload>
    >(`/reports/sprint/${sprintId}/member-distribution`)
    return response.data
  }
}
