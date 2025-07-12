"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface CompletionData {
  name: string;
  value: number;
  color: string;
}

interface CompletionStatusChartProps {
  data: CompletionData[];
  totalReports: number;
}

export function CompletionStatusChart({
  data,
  totalReports,
}: CompletionStatusChartProps) {
  const completedCount =
    data.find((item) => item.name === "Completed")?.value || 0;
  const inProgressCount =
    data.find((item) => item.name === "In Progress")?.value || 0;

  const completionRate = ((completedCount / totalReports) * 100).toFixed(1);
  const inProgressRate = ((inProgressCount / totalReports) * 100).toFixed(1);

  // Custom label function for the pie chart
  const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={14}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Overall Completion Status</h2>
        <p className="text-muted-foreground">
          Comprehensive view of completion rates across all sections
        </p>
      </div> */}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Quota</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
            <p className="text-xs text-muted-foreground">All sections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completedCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {completionRate}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {inProgressCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {inProgressRate}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {completionRate}%
            </div>
            <p className="text-xs text-muted-foreground">Overall progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Completion Distribution</span>
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
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, name]}
                  labelFormatter={() => "Reports"}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {data.map((item) => (
              <div key={item.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{item.value}</div>
                    <div className="text-sm text-muted-foreground">
                      {((item.value / totalReports) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(item.value / totalReports) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}

            {/* Performance Indicator */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                Performance Indicator
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Completion Rate:</span>
                  <span className="font-semibold text-blue-600">
                    {completionRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Active Work:</span>
                  <span className="font-semibold text-amber-600">
                    {inProgressRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Processed:</span>
                  <span className="font-semibold">{totalReports} reports</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Card */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">
                Completion Performance
              </h4>
              <p className="text-sm text-green-700">
                {completedCount} reports have been successfully completed,
                representing {completionRate}% of the total workload.
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg">
              <h4 className="font-semibold text-amber-900 mb-2">
                Active Progress
              </h4>
              <p className="text-sm text-amber-700">
                {inProgressCount} reports are currently in progress, showing
                active engagement across {inProgressRate}% of the workload.
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                Overall Status
              </h4>
              <p className="text-sm text-blue-700">
                {Number.parseFloat(completionRate) >= 70
                  ? "Excellent"
                  : Number.parseFloat(completionRate) >= 50
                  ? "Good"
                  : "Needs Improvement"}{" "}
                completion rate with strong progress momentum across all
                sections.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
