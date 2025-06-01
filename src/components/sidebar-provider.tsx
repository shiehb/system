// Create a file named sidebar-provider.tsx
"use client"

import * as React from "react"
import { createContext, useContext, useState } from "react"

interface SidebarContextProps {
  isCollapsed: boolean
  toggleSidebar: () => void
  isMobile: boolean
}

const SidebarContext = createContext<SidebarContextProps>({
  isCollapsed: false,
  toggleSidebar: () => {},
  isMobile: false,
})

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Add mobile detection logic if needed
  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    
    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev)
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, isMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}