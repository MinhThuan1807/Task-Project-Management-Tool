import { User, Project } from '../../lib/types';
import { Bell, Search, Settings, User as UserIcon, LogOut } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';

type TopBarProps = {
  currentUser: User;
  selectedProject?: Project;
  currentView: string;
};

export function TopBar({ currentUser, selectedProject, currentView }: TopBarProps) {
  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'chat':
        return 'Chat';
      case 'backlog':
        return 'Product Backlog';
      case 'sprint':
        return 'Sprint Board';
      case 'profile':
        return 'Profile';
      case 'security':
        return 'Security';
      default:
        return selectedProject?.name || 'Sprintos';
    }
  };

  return (
    <div className="flex items-center gap-4 flex-1">
      {/* Title */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl text-gray-900">{getViewTitle()}</h2>
        {selectedProject && (
          <Badge variant="outline" className="text-xs">
            {selectedProject.status}
          </Badge>
        )}
      </div>

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 h-auto py-2 px-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={currentUser.avatarUrl} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {currentUser.displayName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-700">{currentUser.displayName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon className="w-4 h-4 mr-2" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}