"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface QuotaData {
  section: string;
  quota: number;
  in_progress: number;
  completed: number;
}

interface QuotaProgressChartProps {
  data: QuotaData[];
}

export function QuotaProgressChart({ data }: QuotaProgressChartProps) {
  // Calculate totals
  const totalQuota = data.reduce((sum, item) => sum + item.quota, 0);
  const totalCompleted = data.reduce((sum, item) => sum + item.completed, 0);
  const totalInProgress = data.reduce((sum, item) => sum + item.in_progress, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Section Quota Progress</h2>
        <p className="text-muted-foreground">Track progress across all environmental compliance sections</p>
      </div> */}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Quota</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuota}</div>
            <p className="text-xs text-muted-foreground">
              All sections combined
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalCompleted}
            </div>
            <p className="text-xs text-muted-foreground">
              {((totalCompleted / totalQuota) * 100).toFixed(1)}% of total quota
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {totalInProgress}
            </div>
            <p className="text-xs text-muted-foreground">
              {((totalInProgress / totalQuota) * 100).toFixed(1)}% of total
              quota
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Quota Progress by Section</span>
            <div className="flex items-center space-x-2">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Completed
              </Badge>
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-800"
              >
                In Progress
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="section" tick={{ fontSize: 12 }} interval={0} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value, name) => [
                  value,
                  name === "Completed" ? "Completed" : "In Progress",
                ]}
                labelFormatter={(label) => `Section: ${label}`}
              />
              <Legend />
              <Bar
                dataKey="completed"
                stackId="progress"
                fill="#22c55e"
                name="Completed"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="in_progress"
                stackId="progress"
                fill="#f59e0b"
                name="In Progress"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Section Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Section Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((section) => (
              <div key={section.section} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">{section.section}</h3>
                  <Badge variant="outline">{section.quota} Total</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {section.completed}
                    </div>
                    <p className="text-sm text-green-700">Completed</p>
                    <p className="text-xs text-muted-foreground">
                      {((section.completed / section.quota) * 100).toFixed(1)}%
                    </p>
                  </div>

                  <div className="text-center p-3 bg-amber-50 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">
                      {section.in_progress}
                    </div>
                    <p className="text-sm text-amber-700">In Progress</p>
                    <p className="text-xs text-muted-foreground">
                      {((section.in_progress / section.quota) * 100).toFixed(1)}
                      %
                    </p>
                  </div>

                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {((section.completed / section.quota) * 100).toFixed(1)}%
                    </div>
                    <p className="text-sm text-blue-700">Completion Rate</p>
                    <p className="text-xs text-muted-foreground">
                      Overall progress
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>
                      {section.completed + section.in_progress} /{" "}
                      {section.quota}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="flex h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-green-500"
                        style={{
                          width: `${
                            (section.completed / section.quota) * 100
                          }%`,
                        }}
                      />
                      <div
                        className="bg-amber-500"
                        style={{
                          width: `${
                            (section.in_progress / section.quota) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
