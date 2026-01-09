'use client';

import { useState, useEffect } from 'react';
import { User, Project } from '@/lib/types';
import { mockCurrentUser, mockAllProjects } from '@/lib/mock-data';
import { ChatView } from '@/components/ChatView';

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState<User>(mockCurrentUser);
  const [allProjects, setAllProjects] = useState<Project[]>(mockAllProjects);

  // Load data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedProjects = localStorage.getItem('allProjects');

    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user:', error);
      }
    }

    if (storedProjects) {
      try {
        setAllProjects(JSON.parse(storedProjects));
      } catch (error) {
        console.error('Failed to parse projects:', error);
      }
    }
  }, []);

  return <ChatView currentUser={currentUser} allProjects={allProjects} />;
}
