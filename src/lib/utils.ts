import axios from 'axios'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
export const formatDateChat = (timestamp: Date | number) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export function formatTime(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

export function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  )

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return date.toLocaleDateString()
}

export function getPriorityColor(
  priority: string | undefined
): string | undefined {
  switch (priority) {
    case 'critical':
      return 'bg-red-100 text-red-700 border-red-200'
    case 'high':
      return 'bg-orange-100 text-orange-700 border-orange-200'
    case 'medium':
      return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'low':
      return 'bg-gray-100 text-gray-700 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}
export function getBacklogColor(
  priority: string | undefined
): string | undefined {
  switch (priority) {
    case 'critical':
      return 'bg-red-100 text-red-700 border-red-200'
    case 'high':
      return 'bg-orange-100 text-orange-700 border-orange-200'
    case 'medium':
      return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'low':
      return 'bg-gray-100 text-gray-700 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-700'
    case 'completed':
      return 'bg-blue-100 text-blue-700'
    case 'archived':
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export function getRoleColor(role: string): string {
  switch (role) {
    case 'owner':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    case 'member':
      return 'bg-blue-100 text-blue-700 border-blue-300'
    case 'viewer':
      return 'bg-gray-100 text-gray-700 border-gray-300'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300'
  }
}

export function getErrorMessage(err: unknown) {
  if (axios.isAxiosError(err)) {
    return (err.response?.data as { message?: string })?.message ?? err.message
  }
  if (err instanceof Error) return err.message
  return 'Unknown error'
}

export function getColumnColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'backlog':
      return 'bg-gray-100'
    case 'todo':
      return 'bg-blue-100'
    case 'in_process':
    case 'in-progress':
      return 'bg-yellow-100'
    case 'review':
      return 'bg-purple-100'
    case 'done':
      return 'bg-green-100'
    default:
      return 'bg-gray-100'
  }
}
