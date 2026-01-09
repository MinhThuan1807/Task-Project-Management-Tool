import { useState } from 'react';
import { Send, Search, Phone, Video, Info, Smile, Paperclip, Hash, MessageSquare, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Project, User } from '@/lib/types';

type ChatViewProps = {
  currentUser: User;
  allProjects: Project[];
};

type Message = {
  id: string;
  projectId: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
};

type Channel = {
  id: string;
  name: string;
  projectId: string;
};

// Mock channels data
const mockChannels: Channel[] = [
  { id: 'general', name: 'general', projectId: 'all' },
  { id: 'sprint-updates', name: 'sprint-updates', projectId: 'all' },
  { id: 'random', name: 'random', projectId: 'all' },
];

// Mock messages data
const mockMessages: Message[] = [
  {
    id: 'msg-1',
    projectId: 'project-1',
    channelId: 'general',
    senderId: 'user-2',
    senderName: 'Alice Johnson',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    content: 'Hey team, just finished the authentication module!',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg-2',
    projectId: 'project-1',
    channelId: 'general',
    senderId: 'user-1',
    senderName: 'Project Manager',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PM',
    content: 'Great work! Can you push it to the dev branch?',
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg-3',
    projectId: 'project-1',
    channelId: 'sprint-updates',
    senderId: 'user-3',
    senderName: 'Bob Smith',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    content: 'Sprint 3 is now complete! 🎉',
    timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg-4',
    projectId: 'project-2',
    channelId: 'general',
    senderId: 'user-4',
    senderName: 'Emma Davis',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    content: 'When is the next sprint planning meeting?',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg-5',
    projectId: 'project-3',
    channelId: 'random',
    senderId: 'user-5',
    senderName: 'Charlie Wilson',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
    content: 'The e-commerce platform is coming along nicely!',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

export function ChatView({ currentUser, allProjects }: ChatViewProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    allProjects.length > 0 ? allProjects[0].id : null
  );
  const [selectedChannelId, setSelectedChannelId] = useState<string>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [channels, setChannels] = useState<Channel[]>(mockChannels);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');

  const selectedProject = allProjects.find((p) => p.id === selectedProjectId);
  const selectedChannel = channels.find((c) => c.id === selectedChannelId);
  const projectMessages = messages.filter(
    (m) => m.projectId === selectedProjectId && m.channelId === selectedChannelId
  );

  // Get last message for each project
  const getLastMessage = (projectId: string) => {
    const projectMsgs = messages.filter((m) => m.projectId === projectId);
    return projectMsgs.length > 0 ? projectMsgs[projectMsgs.length - 1] : null;
  };

  // Filter projects by search
  const filteredProjects = allProjects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedProjectId) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      projectId: selectedProjectId,
      channelId: selectedChannelId,
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatarUrl || '',
      content: messageInput,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const handleCreateChannel = () => {
    if (!newChannelName.trim()) return;

    const newChannel: Channel = {
      id: `channel-${Date.now()}`,
      name: newChannelName,
      projectId: selectedProjectId || 'all',
    };

    setChannels([...channels, newChannel]);
    setSelectedChannelId(newChannel.id);
    setShowCreateChannel(false);
    setNewChannelName('');
  };

  return (
    <div className="flex-1 flex bg-white h-full">
      {/* Projects/Conversations List - Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-2xl text-gray-900 mb-4">Chat</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredProjects.map((project) => {
            const lastMessage = getLastMessage(project.id);
            const isSelected = selectedProjectId === project.id;
            const unreadCount = 0; // Mock unread count

            return (
              <button
                key={project.id}
                onClick={() => {
                  setSelectedProjectId(project.id);
                  setSelectedChannelId('general'); // Reset to general channel
                }}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                  isSelected ? 'bg-blue-50' : ''
                }`}
              >
                <img
                  src={project.imageUrl || 'https://api.dicebear.com/7.x/shapes/svg?seed=default'}
                  alt={project.name}
                  className="w-12 h-12 rounded-full flex-shrink-0"
                />
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm text-gray-900 truncate">{project.name}</h3>
                    {lastMessage && (
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {formatRelativeTime(lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  {lastMessage && (
                    <p className="text-sm text-gray-600 truncate">
                      {lastMessage.senderId === currentUser.id ? 'You: ' : ''}
                      {lastMessage.content}
                    </p>
                  )}
                  {!lastMessage && (
                    <p className="text-sm text-gray-400">No messages yet</p>
                  )}
                </div>
                {unreadCount > 0 && (
                  <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area - Right Side */}
      {selectedProject ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <Hash className="w-6 h-6 text-gray-600" />
              <div>
                <h2 className="text-lg text-gray-900">{selectedChannel?.name || 'general'}</h2>
                <p className="text-sm text-gray-500">{selectedProject.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Channels Section */}
          <div className="px-6 py-3 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              Channels
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannelId(channel.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                    selectedChannelId === channel.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Hash className="w-4 h-4" />
                  <span>{channel.name}</span>
                </button>
              ))}
              <button
                onClick={() => setShowCreateChannel(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors text-gray-700 hover:bg-gray-50 whitespace-nowrap flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>New Channel</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="space-y-4">
              {projectMessages.length > 0 ? (
                projectMessages.map((message) => (
                  <div key={message.id} className="flex gap-3">
                    <img
                      src={message.senderAvatar}
                      alt={message.senderName}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-sm text-gray-900">{message.senderName}</span>
                        <span className="text-xs text-gray-500">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No messages in #{selectedChannel?.name || 'this channel'} yet</p>
                  <p className="text-sm text-gray-400 mt-1">Be the first to send a message!</p>
                </div>
              )}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-end gap-3">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <div className="flex-1 relative">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={`Message #${selectedChannel?.name || 'general'}`}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={1}
                  style={{ maxHeight: '120px' }}
                />
                <button className="absolute right-2 bottom-2 p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl text-gray-900 mb-2">Select a project to start chatting</h3>
            <p className="text-gray-600">Choose from your projects on the left</p>
          </div>
        </div>
      )}

      {/* Create Channel Modal */}
      <Dialog open={showCreateChannel} onOpenChange={setShowCreateChannel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Channel</DialogTitle>
            <DialogDescription>
              Channel names must be lowercase, without spaces. Use dashes instead.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="channelName">Channel Name</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="channelName"
                  type="text"
                  placeholder="e.g. team-announcements"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newChannelName.trim()) {
                      handleCreateChannel();
                    }
                  }}
                  className="pl-10"
                  autoFocus
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateChannel(false);
                setNewChannelName('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateChannel}
              disabled={!newChannelName.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Create Channel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}