'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}

const socketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false
})

export const useSocket = () => useContext(socketContext)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  useEffect(() => {
    const socketInstance = io(
      process.env.NEXT_PUBLIC_SOCKET_IO_URL || 'http://localhost:8080',
      {
        withCredentials: true
      }
    )

    socketInstance.on('connect', () => {
      // console.log('Socket connected:', socketInstance.id)
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      // console.log('Socket disconnected')
      setIsConnected(false)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return (
    <socketContext.Provider value={{ socket, isConnected }}>
      {children}
    </socketContext.Provider>
  )
}