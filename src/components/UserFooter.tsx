'use client'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from './ui/sidebar'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/lib/features/auth/authSlice'
import Link from 'next/link'
function UserFooter() {
  const currentUser = useSelector(selectCurrentUser)
  return (
    <SidebarFooter className="border-t border-sidebar-border">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" tooltip={currentUser?.displayName}>
            <Link href={'/profile'} className="flex items-center gap-2 w-full">
              <Avatar className="w-8 h-8">
                <AvatarImage src={currentUser?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {currentUser?.displayName?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm truncate">{currentUser?.displayName}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {currentUser?.email}
                </p>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}

export default UserFooter
