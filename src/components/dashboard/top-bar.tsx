import { Bell, Search, User as UserIcon, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Suspense } from 'react';
import { UserMenu } from './UserMenu';
import TitleTopBar from './TitleTopBar';

export function TopBar() {

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-y-auto">
              <div className="px-2 py-3 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
                <p className="font-medium text-gray-900">New task assigned</p>
                <p className="text-xs text-gray-500 mt-1">
                  You have been assigned to "Setup authentication"
                </p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
              <div className="px-2 py-3 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
                <p className="font-medium text-gray-900">Sprint completed</p>
                <p className="text-xs text-gray-500 mt-1">Sprint 3 has been marked as complete</p>
                <p className="text-xs text-gray-400 mt-1">1 day ago</p>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <Suspense fallback={<div>Loading...</div>}>
          <UserMenu />
        </Suspense>

      </div>
    </div>
  );
}

