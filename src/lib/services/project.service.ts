import { InvitationData } from "@/components/projects/invite-team-modal";
import axiosInstance from "../axios";

interface CreateProjectPayload {
  name: string;
  description?: string;
  members?: Array<{ email: string; role: 'owner' | 'member' | 'viewer' }>;
  imageUrl?: File;
}

interface AcceptMemberPayload {
  email: string,
  token: string,
  projectId: string
}
export interface InviteMemberPayload{
  email: string;
  role: 'owner' | 'member' | 'viewer';
  projectId: string;
}

export const projectApi = {
  createProject: async (data: CreateProjectPayload) => {
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
        formData.append(`members[${index}][email]`, member.email);
        formData.append(`members[${index}][role]`, member.role);
      });
    }
    const response = await axiosInstance.post('/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true 
    })
    
    return response.data
  },
  inviteMember: async (data: InviteMemberPayload) => {
    const response = await axiosInstance.post(`/projects/invite`, data);
    return response.data;
  },
  acceptInvite: async (data: AcceptMemberPayload) => {
    const response = await axiosInstance.put(`/projects/verify/invite`, data);
    return response.data;
  },
  getOwnedProjects: async () => {
    const response = await axiosInstance.get('/projects/owned');
    return response.data;
  },
  getJoinedProjects: async () => {
    const response = await axiosInstance.get('/projects/joined');
    return response.data;
  }
}