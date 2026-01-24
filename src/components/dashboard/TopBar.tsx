import { Search } from 'lucide-react'
import { Input } from '../ui/input'
import Notification from '@/components/dashboard/notifications/Notification'
import { Suspense } from 'react'
import { UserMenu } from './UserMenu'
import TitleTopBar from './TitleTopBar'

export const TopBar = () => {

  return (
    <div className="flex items-center gap-4 flex-1">
      {/* Title */}
      <Suspense fallback={<div>Loading...</div>}>
        <TitleTopBar />
      </Suspense>

      {/* Search */}
      <div className="flex-1 max-w-md ml-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search tasks, projects..."
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Notification/>

        {/* User Menu */}
        <Suspense fallback={<div>Loading...</div>}>
          <UserMenu />
        </Suspense>

      </div>
    </div>
  )
}
export default TopBar
