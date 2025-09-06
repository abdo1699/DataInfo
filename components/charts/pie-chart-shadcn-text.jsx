"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

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

// Exact shadcn-style donut with text, adapted to accept data via props.
// Props: data: Array<{ name: string, value: number }>, title?: string, description?: string
export function PieChartShadcnText({
  data = [],
  title = "Pie Chart - Donut with Text",
  description = "",
}) {
  // Use shadcn's canonical keys so CSS variables resolve as expected
  const keys = ["chrome", "safari", "firefox", "edge", "other"]
  const colorVars = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

  const chartData = React.useMemo(() => {
    const items = (data || []).slice(0, 5)
    return items.map((d, i) => ({
      browser: keys[i],
      label: d.name ?? keys[i],
      visitors: Number(d.value) || 0,
      fill: `var(--color-${keys[i]})`,
    }))
  }, [data])

  const chartConfig = React.useMemo(() => {
    const base = { visitors: { label: "Visitors" } }
    keys.forEach((k, i) => {
      base[k] = { label: chartData[i]?.label || k, color: colorVars[i] }
    })
    return base
  }, [chartData])

  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [chartData])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {chartData.length === 0 || totalVisitors === 0 ? (
          <div className="mx-auto h-[250px] flex items-center justify-center text-sm text-gray-500">
            No data available
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="browser"
                innerRadius={60}
                outerRadius={120}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalVisitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Visitors
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        {description ? (
          <div className="text-muted-foreground leading-none">{description}</div>
        ) : null}
      </CardFooter>
    </Card>
  )
}
