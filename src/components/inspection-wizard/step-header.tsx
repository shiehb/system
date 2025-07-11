import type { LucideIcon } from "lucide-react"

interface StepHeaderProps {
  icon: LucideIcon
  title: string
  description: string
  iconColor?: string
}

export function StepHeader({ icon: Icon, title, description, iconColor = "text-blue-600" }: StepHeaderProps) {
  return (
    <div className="text-center space-y-4">
      <div
        className={`w-16 h-16 mx-auto ${iconColor} bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center shadow-sm`}
      >
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">{description}</p>
      </div>
    </div>
  )
}
