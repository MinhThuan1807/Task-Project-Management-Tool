// Type definitions for Sprintos
export type User = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
};

export type Project = {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  members: string[];
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
};

export type Sprint = {
  id: string;
  projectId: string;
  name: string;
  goal: string;
  storyPoint: number;
  startDate: string;
  endDate: string;
  createdAt: string;
};

export type Task = {
  id: string;
  projectId: string;
  sprintId: string;
  columnId: string;
  title: string;
  description: string;
  labels?: string[];
  assignees?: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: string;
  dueDate?: string;
  storyPoint?: number;
  createdAt: string;
};

export type Column = {
  id: string;
  projectId: string;
  sprintId: string;
  title: string;
  position: number;
};

export type Message = {
  id: string;
  projectId: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
};

export type Channel = {
  id: string;
  name: string;
  projectId: string;
};

export type TeamMember = {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: 'owner' | 'member' | 'viewer';
  joinedAt: string;
};
