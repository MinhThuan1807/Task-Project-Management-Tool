'use client'
import { useCurrentUser } from '@/lib/hooks/useAuth'
import { useAllProjects } from '@/lib/hooks/useProjects'
import { ChatView } from '../ChatView'

const  ChatViewContainer = () => {
  const { data: currentUser } = useCurrentUser()
  const { data: allProjects } = useAllProjects()

  // Load data from localStorage
  // useEffect(() => {
  //   const storedUser = localStorage.getItem('currentUser');
  //   const storedProjects = localStorage.getItem('allProjects');

  //   if (storedUser) {
  //     try {
  //       setCurrentUser(JSON.parse(storedUser));
  //     } catch (error) {
  //       console.error('Failed to parse user:', error);
  //     }
  //   }

  //   if (storedProjects) {
  //     try {
  //       setAllProjects(JSON.parse(storedProjects));
  //     } catch (error) {
  //       console.error('Failed to parse projects:', error);
  //     }
  //   }
  // }, []);

  if (!currentUser || !allProjects) {
    return <div>Loading...</div>
  }
  return (
    <ChatView currentUser={currentUser} allProjects={allProjects}/>
  )
}

export default ChatViewContainer
