import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/lib/features/auth/authSlice'
import { Project } from '@/lib/types/project.types'

export function useProjectPermissions(project?: Project) {
  const currentUser = useSelector(selectCurrentUser)

  return useMemo(() => {
    if (!project || !currentUser) {
      return { canEdit: false, isOwner: false, isMember: false, isViewer: false }
    }

    const isOwner = project.ownerId === currentUser._id
    const member = project.members?.find(m => m.memberId === currentUser._id)
    const role = member?.role

    const canEdit = isOwner || role === 'member'
    return {
      canEdit,
      isOwner,
      isMember: role === 'member',
      isViewer: role === 'viewer'
    }
  }, [project, currentUser])
}
