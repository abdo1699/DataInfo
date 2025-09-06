"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Standalone version that does not rely on ChartContainer
// Dynamic props to hook into your filtered data and custom color palette
export function PieShadcnStandalone({
  data = [],
  title = "Pie Chart - Donut with Text",
  description = "January - June 2024",
  colors = ["#6a329f", "#601f9e", "#522081", "#360f5a", "#1c0333"],
}) {
  // Map incoming data -> recharts format and apply brand palette
  const chartData = React.useMemo(() => {
    const src = Array.isArray(data) && data.length > 0
      ? data
      : [
          { name: "Segment A", value: 275 },
          { name: "Segment B", value: 200 },
          { name: "Segment C", value: 287 },
          { name: "Segment D", value: 173 },
          { name: "Segment E", value: 190 },
        ]
    return src.slice(0, 5).map((d, i) => ({
      name: d.name,
      visitors: Number(d.value) || 0,
      fill: colors[i % colors.length],
    }))
  }, [data, colors])

  const total = React.useMemo(() => chartData.reduce((s, d) => s + d.visitors, 0), [chartData])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip 
                cursor={false}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                }}
                formatter={(value, name, { payload }) => [value, payload?.name]}
              />
              <Pie 
                data={chartData} 
                dataKey="visitors" 
                nameKey="name" 
                innerRadius={60} 
                stroke="transparent"
                strokeWidth={0}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                            {total.toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                            Properties
                          </tspan>
                        </text>
                      )
                    }
                    return null
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}
