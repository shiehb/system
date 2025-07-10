"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Download, Activity, LogIn, FileText, Settings, User } from "lucide-react"
import { toast } from "sonner"

interface ActivityItem {
  id: string
  type: "login" | "profile_update" | "document_upload" | "settings_change" | "inspection" | "report"
  title: string
  description: string
  timestamp: string
  ip_address?: string
  device?: string
  location?: string
  metadata?: any
}

interface ActivityHistoryProps {
  onExportActivity: (filters: any) => Promise<void>
}

export const ActivityHistory = ({ onExportActivity }: ActivityHistoryProps) => {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [filteredActivities, setFilteredActivities] = useState<ActivityItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [dateRange, setDateRange] = useState("30")

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockActivities: ActivityItem[] = [
      {
        id: "1",
        type: "login",
        title: "Successful Login",
        description: "Logged in from Chrome on Windows",
        timestamp: new Date().toISOString(),
        ip_address: "192.168.1.1",
        device: "Chrome 120.0 on Windows 10",
        location: "Manila, Philippines",
      },
      {
        id: "2",
        type: "profile_update",
        title: "Profile Updated",
        description: "Updated profile picture and contact information",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "3",
        type: "document_upload",
        title: "Document Uploaded",
        description: "Uploaded inspection report for Establishment ABC",
        timestamp: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: "4",
        type: "settings_change",
        title: "Settings Changed",
        description: "Updated notification preferences",
        timestamp: new Date(Date.now() - 259200000).toISOString(),
      },
      {
        id: "5",
        type: "inspection",
        title: "Inspection Completed",
        description: "Completed inspection for XYZ Manufacturing",
        timestamp: new Date(Date.now() - 345600000).toISOString(),
      },
    ]
    setActivities(mockActivities)
    setFilteredActivities(mockActivities)
  }, [])

  useEffect(() => {
    let filtered = activities

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (activity) =>
          activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((activity) => activity.type === filterType)
    }

    // Filter by date range
    const now = new Date()
    const daysAgo = Number.parseInt(dateRange)
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    filtered = filtered.filter((activity) => new Date(activity.timestamp) >= cutoffDate)

    setFilteredActivities(filtered)
  }, [activities, searchTerm, filterType, dateRange])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
        return <LogIn className="w-4 h-4" />
      case "profile_update":
        return <User className="w-4 h-4" />
      case "document_upload":
        return <FileText className="w-4 h-4" />
      case "settings_change":
        return <Settings className="w-4 h-4" />
      case "inspection":
        return <Activity className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "login":
        return "bg-green-100 text-green-800"
      case "profile_update":
        return "bg-blue-100 text-blue-800"
      case "document_upload":
        return "bg-purple-100 text-purple-800"
      case "settings_change":
        return "bg-orange-100 text-orange-800"
      case "inspection":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleExportActivity = async () => {
    try {
      await onExportActivity({
        searchTerm,
        filterType,
        dateRange,
        activities: filteredActivities,
      })
      toast.success("Activity history exported successfully")
    } catch (error) {
      toast.error("Failed to export activity history")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Activity History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recent">Recent Activity</TabsTrigger>
              <TabsTrigger value="logins">Login History</TabsTrigger>
              <TabsTrigger value="changes">Profile Changes</TabsTrigger>
            </TabsList>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 my-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="login">Logins</SelectItem>
                  <SelectItem value="profile_update">Profile Updates</SelectItem>
                  <SelectItem value="document_upload">Document Uploads</SelectItem>
                  <SelectItem value="settings_change">Settings Changes</SelectItem>
                  <SelectItem value="inspection">Inspections</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={handleExportActivity}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <TabsContent value="recent" className="space-y-4">
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {filteredActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                          <span className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>

                        {activity.ip_address && (
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>IP: {activity.ip_address}</span>
                            {activity.device && <span>Device: {activity.device}</span>}
                            {activity.location && <span>Location: {activity.location}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {filteredActivities.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No activities found matching your criteria</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="logins" className="space-y-4">
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {filteredActivities
                    .filter((activity) => activity.type === "login")
                    .map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="p-2 rounded-full bg-green-100 text-green-800">
                          <LogIn className="w-4 h-4" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">{activity.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {new Date(activity.timestamp).toLocaleString()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-xs text-gray-500">
                            <span>IP: {activity.ip_address}</span>
                            <span>Device: {activity.device}</span>
                            <span>Location: {activity.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="changes" className="space-y-4">
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {filteredActivities
                    .filter((activity) => ["profile_update", "settings_change"].includes(activity.type))
                    .map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                          {getActivityIcon(activity.type)}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">{activity.title}</h4>
                            <span className="text-xs text-gray-500">
                              {new Date(activity.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
