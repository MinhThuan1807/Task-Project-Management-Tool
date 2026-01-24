'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Bell, Check, CheckCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { notificationApi } from '@/lib/services/notifications.service'
import { useSocket } from '@/app/providers/SocketProvider'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/lib/features/auth/authSlice'
import { getErrorMessage } from '@/lib/utils'
import { toast } from 'sonner'

interface INotification {
  _id: string
  userId?: string
  projectId?: string
  taskId?: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: Date
}

export default function Notification() {
  const { socket, isConnected } = useSocket()
  const currentUser = useSelector(selectCurrentUser)
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchNotifications = async () => {
      const notifications = await notificationApi.getUserNotifications()
      setNotifications(notifications.data)
      setUnreadCount(
        notifications.data.filter((n: INotification) => !n.isRead).length
      )
    }
    fetchNotifications()
  }, [])

  // Listen for new notifications via socket
  useEffect(() => {
    if (!socket || !isConnected || !currentUser?._id) return

    socket.emit('join_notifications_for_user', currentUser._id)

    const handleNewNotification = (notification: INotification) => {
      // console.log('New notification:', notification)
      setNotifications((prev) => [notification, ...prev])
      setUnreadCount((prev) => prev + 1)
    }

    socket.on('user_notification', handleNewNotification)

    return () => {
      socket.off('user_notification', handleNewNotification)
    }
  }, [socket, isConnected, currentUser?._id])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      // Emit socket event
      if (socket && isConnected) {
        socket.emit('mark_read', notificationId)
      }

      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      // console.error('Error marking notification as read:', error)
      toast.error(getErrorMessage(error))
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      // Emit socket event
      if (socket && isConnected) {
        socket.emit('mark_all_read', currentUser?._id)
      }

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      // console.error('Error marking all notifications as read:', error)
      toast.error(getErrorMessage(error))
    }
  }

  const formatDate = (timestamp: Date | number) => {
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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="flex items-center justify-between px-2">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="h-8 text-xs"
              >
                <CheckCheck className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
          <DropdownMenuSeparator />
          <div className="max-h-96 overflow-y-auto">
            {Array.isArray(notifications) && notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div
                  key={index}
                  className={`px-2 py-3 text-sm hover:bg-gray-50 cursor-pointer relative group ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                  onClick={() =>
                    !notification.isRead && handleMarkAsRead(notification._id)
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p
                        className={`font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}
                      >
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(new Date(notification.createdAt))}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMarkAsRead(notification._id)
                        }}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-2 py-8 text-center text-sm text-gray-500">
                No notifications
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
