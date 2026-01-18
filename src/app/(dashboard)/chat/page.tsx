// 'use client';

// import { useState, useEffect } from 'react';
// import { User, Project } from '@/lib/types';
// import { ChatView } from '@/components/ChatView';
// import { useAllProjects } from '@/lib/hooks/useProjects';
// import { useCurrentUser } from '@/lib/hooks/useAuth';

// export default function ChatPage() {
//   const { data: currentUser } = useCurrentUser();
//   const { data: allProjects } = useAllProjects();

//   // Load data from localStorage
//   // useEffect(() => {
//   //   const storedUser = localStorage.getItem('currentUser');
//   //   const storedProjects = localStorage.getItem('allProjects');

//   //   if (storedUser) {
//   //     try {
//   //       setCurrentUser(JSON.parse(storedUser));
//   //     } catch (error) {
//   //       console.error('Failed to parse user:', error);
//   //     }
//   //   }

//   //   if (storedProjects) {
//   //     try {
//   //       setAllProjects(JSON.parse(storedProjects));
//   //     } catch (error) {
//   //       console.error('Failed to parse projects:', error);
//   //     }
//   //   }
//   // }, []);

//   return <ChatView currentUser={currentUser} allProjects={allProjects} />;
// }
