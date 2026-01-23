import axiosInstance from '../axios'
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
  InviteMemberRequest,
  AcceptInviteRequest,
  RemoveMemberRequest,
  UpdateMemberRoleRequest,
  ProjectResponse,
  ProjectsResponse
} from '../types'

export const projectApi = {
  /**
   * Create new project
   * POST /projects
   */
  createProject: async (data: CreateProjectRequest): Promise<ProjectResponse> => {
    const formData = new FormData()

    formData.append('name', data.name)

    if (data.description) {
      formData.append('description', data.description)
    }

    if (data.imageUrl) {
      formData.append('image', data.imageUrl)
    }

    if (data.members && data.members.length > 0) {
      data.members.forEach((member, index) => {
        formData.append(`members[${index}][email]`, member.email)
        formData.append(`members[${index}][role]`, member.role)
      })
    }

    const response = await axiosInstance.post<ProjectResponse>('/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    })

    return response.data
  },

  /**
   * Get all owned projects
   * GET /projects/owned
   */
  getOwnedProjects: async (): Promise<ProjectsResponse> => {
    const response = await axiosInstance.get<ProjectsResponse>('/projects/owned')
    return response.data
  },

  /**
   * Get all joined projects
   * GET /projects/joined
   */
  getJoinedProjects: async (): Promise<ProjectsResponse> => {
    const response = await axiosInstance.get<ProjectsResponse>('/projects/joined')
    return response.data
  },

  /**
   * Get project by ID
   * GET /projects/:id
   */
  getById: async (projectId: string): Promise<ProjectResponse> => {
    const response = await axiosInstance.get<ProjectResponse>(`/projects/${projectId}`)
    return response.data
  },

  /**
   * Update project
   * PUT /projects/:id
   */
  update: async (
    projectId: string,
    data: UpdateProjectRequest
  ): Promise<ProjectResponse> => {
    const formData = new FormData()

    if (data.name) formData.append('name', data.name)
    if (data.description) formData.append('description', data.description)
    if (data.status) formData.append('status', data.status)
    if (data.imageUrl) formData.append('image', data.imageUrl)

    const response = await axiosInstance.put<ProjectResponse>(
      `/projects/${projectId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    return response.data
  },

  /**
   * Delete project
   * DELETE /projects/:id
   */
  delete: async (projectId: string): Promise<{ success: boolean }> => {
    const response = await axiosInstance.delete(`/projects/${projectId}`)
    return response.data
  },

  /**
   * Invite member to project
   * POST /projects/:id/invite
   */
  inviteMember: async (data: InviteMemberRequest): Promise<ProjectResponse> => {
    const response = await axiosInstance.post<ProjectResponse>(
      '/projects/invite',
      {
        email: data.email,
        role: data.role,
        projectId: data.projectId
      }
    )
    return response.data
  },

  /**
   * Accept project invitation
   * POST /projects/accept-invite
   */
  acceptInvite: async (data: AcceptInviteRequest): Promise<ProjectResponse> => {
    const response = await axiosInstance.post<ProjectResponse>(
      '/projects/accept-invite',
      data
    )
    return response.data
  },

  /**
   * Remove member from project
   * DELETE /projects/:projectId/members/:memberId
   */
  removeMember: async (data: RemoveMemberRequest): Promise<{ success: boolean }> => {
    const response = await axiosInstance.delete(
      `/projects/${data.projectId}/members/${data.memberId}`
    )
    return response.data
  },

  /**
   * Update member role
   * PUT /projects/:projectId/members/:memberId/role
   */
  updateMemberRole: async (data: UpdateMemberRoleRequest): Promise<ProjectResponse> => {
    const response = await axiosInstance.put<ProjectResponse>(
      `/projects/${data.projectId}/members/${data.memberId}/role`,
      { role: data.role }
    )
    return response.data
  }
} as const

// Export types for backward compatibility
export type { InviteMemberRequest, AcceptInviteRequest }