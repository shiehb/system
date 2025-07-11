"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Clock,
  Building,
  BarChart3,
  PieChart,
  Plus,
} from "lucide-react";
import { QuotaProgressChart } from "./quota-progress-chart";
import { CompletionStatusChart } from "./completion-status-chart";

interface QuotaData {
  section: string;
  quota: number;
  in_progress: number;
  completed: number;
}

interface CompletionData {
  name: string;
  value: number;
  color: string;
}

// Mock quota data - quota is now the sum of in_progress and completed
const quotaData: QuotaData[] = [
  { section: "EIA", quota: 43, in_progress: 15, completed: 28 },
  { section: "Water", quota: 34, in_progress: 12, completed: 22 },
  { section: "Air", quota: 33, in_progress: 8, completed: 25 },
  { section: "Toxic", quota: 28, in_progress: 10, completed: 18 },
  { section: "Solid Waste", quota: 21, in_progress: 6, completed: 15 },
];

export default function ChiefDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate completion data for pie chart
  const completionData: CompletionData[] = [
    {
      name: "Completed",
      value: quotaData.reduce((sum, item) => sum + item.completed, 0),
      color: "#22c55e",
    },
    {
      name: "In Progress",
      value: quotaData.reduce((sum, item) => sum + item.in_progress, 0),
      color: "#f59e0b",
    },
  ];

  // Calculate summary metrics
  const totalReports = quotaData.reduce((sum, item) => sum + item.quota, 0);
  const totalCompleted = quotaData.reduce(
    (sum, item) => sum + item.completed,
    0
  );
  const totalInProgress = quotaData.reduce(
    (sum, item) => sum + item.in_progress,
    0
  );
  const pendingReview = 3; // This would come from actual report data

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Building className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger
            value="quota-progress"
            className="flex items-center space-x-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Quota Progress</span>
          </TabsTrigger>
          <TabsTrigger
            value="completion-status"
            className="flex items-center space-x-2"
          >
            <PieChart className="w-4 h-4" />
            <span>Completion Status</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Quota
                </CardTitle>
                <FileText className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalReports}</div>
                <p className="text-xs text-muted-foreground">
                  All sections combined
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <Building className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {totalCompleted}
                </div>
                <p className="text-xs text-muted-foreground">
                  {((totalCompleted / totalReports) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  In Progress
                </CardTitle>
                <Clock className="w-4 h-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">
                  {totalInProgress}
                </div>
                <p className="text-xs text-muted-foreground">
                  {((totalInProgress / totalReports) * 100).toFixed(1)}% of
                  total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Review
                </CardTitle>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingReview}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting your action
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  onClick={() => setActiveTab("quota-progress")}
                >
                  <BarChart3 className="w-6 h-6" />
                  <span>View Quota Progress</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  onClick={() => setActiveTab("completion-status")}
                >
                  <PieChart className="w-6 h-6" />
                  <span>View Completion Status</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  onClick={() => setActiveTab("reports")}
                >
                  <FileText className="w-6 h-6" />
                  <span>Manage Inspections</span>
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Plus className="w-6 h-6" />
                  <span>New Inspection</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Section Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Section Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quotaData.map((section) => (
                  <div
                    key={section.section}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="font-semibold text-blue-600">
                          {section.section.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{section.section}</h3>
                        <p className="text-sm text-muted-foreground">
                          Total: {section.quota} Quota
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            {section.completed} Completed
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-amber-100 text-amber-800"
                          >
                            {section.in_progress} In Progress
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {((section.completed / section.quota) * 100).toFixed(
                            1
                          )}
                          % completion rate
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quota Progress Tab */}
        <TabsContent value="quota-progress" className="space-y-6">
          <QuotaProgressChart data={quotaData} />
        </TabsContent>

        {/* Completion Status Tab */}
        <TabsContent value="completion-status" className="space-y-6">
          <CompletionStatusChart
            data={completionData}
            totalReports={totalReports}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
