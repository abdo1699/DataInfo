"use client"

import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, Sector } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { chartConfig } from "@/lib/chart-config"

export function PieChartDonutActive({ data, title = "Property Type Distribution" }) {
  // Filter out items with zero values
  const filteredData = data.filter(item => item.value > 0);
  
  // If no data, show empty state
  if (filteredData.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
          <CardDescription>Property distribution across types</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center h-64">
          <div className="text-center text-gray-500">
            <p>No data available</p>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 leading-none font-medium">
            Total properties: 0
          </div>
          <div className="text-muted-foreground leading-none">
            Showing property distribution by type
          </div>
        </CardFooter>
      </Card>
    );
  }
  
  // Transform data to match the expected format with unified color
  const colors = [
    '#7e22ce',
    '#7e22ce',
    '#7e22ce',
    '#7e22ce',
    '#7e22ce',
    '#7e22ce',
  ];
  
  const chartData = filteredData.map((item, index) => ({
    name: item.name,
    value: item.value,
    fill: colors[index % colors.length],
  }))


  // Simple config
  const config = {
    value: {
      label: "Properties",
    },
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-sm font-medium text-gray-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="mx-auto aspect-square h-[300px]">
          <PieChart width={300} height={300} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <ChartTooltip />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              strokeWidth={5}
              activeIndex={0}
              activeShape={({
                outerRadius = 0,
                ...props
              }) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
            />
          </PieChart>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <div className="flex items-center gap-2 leading-none font-medium">
          Total properties: {data.reduce((sum, item) => sum + item.value, 0)} <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}
