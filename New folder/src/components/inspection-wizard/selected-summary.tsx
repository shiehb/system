import type React from "react"

interface SelectedSummaryProps {
  title: string
  icon: React.ReactNode
  bgColor: string
  borderColor: string
  textColor: string
  children: React.ReactNode
}

export function SelectedSummary({ title, icon, bgColor, borderColor, textColor, children }: SelectedSummaryProps) {
  return (
    <div className={`p-6 ${bgColor} border ${borderColor} rounded-xl shadow-sm`}>
      <div className="flex items-center space-x-2 mb-4">
        {icon}
        <h4 className={`font-semibold ${textColor}`}>{title}</h4>
      </div>
      {children}
    </div>
  )
}
