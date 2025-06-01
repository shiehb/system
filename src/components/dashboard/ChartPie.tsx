"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {

  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Updated chart data
const chartData = [
  { label: "Heavy Acts", value: 4, fill: "#dc2626" },   // Red
  { label: "Other Acts", value: 25, fill: "#fde047" },   // Yellow
  { label: "None", value: 60, fill: "#4ade80" },         // Green
]

const chartConfig = {
  Heavy: {
    label: "Heavy Acts",
    color: "#dc2626", // Red
  },
  Other: {
    label: "Other Acts",
    color: "#fde047", // Yellow
  },
  None: {
    label: "None",
    color: "#4ade80", // Green
  },
} satisfies ChartConfig

export function ChartPieLabel() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Warning Acts Overview</CardTitle>
        <CardDescription>January - June 2025</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              label
              nameKey="label"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
        By 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Breakdown of inspection-related acts
        </div>
      </CardFooter>
    </Card>
  )
}

type ChartConfig = Record<
  string,
  {
    label: string
    color?: string
  }
>

