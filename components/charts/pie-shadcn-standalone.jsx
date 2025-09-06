"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts"

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
  // Helper: create n shades from a base hex color by adjusting lightness
  const makeShades = React.useCallback((baseHex, count) => {
    const hexToHsl = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255
      const g = parseInt(hex.slice(3, 5), 16) / 255
      const b = parseInt(hex.slice(5, 7), 16) / 255
      const max = Math.max(r, g, b), min = Math.min(r, g, b)
      let h, s, l = (max + min) / 2
      if (max === min) { h = s = 0 } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break
          case g: h = (b - r) / d + 2; break
          case b: h = (r - g) / d + 4; break
        }
        h = h / 6
      }
      return { h, s, l }
    }
    const hslToHex = ({ h, s, l }) => {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }
      let r, g, b
      if (s === 0) { r = g = b = l } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q
        r = hue2rgb(p, q, h + 1/3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1/3)
      }
      const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, '0')
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`
    }
    try {
      const base = hexToHsl(baseHex)
      // Generate distinct lightness steps from darker to lighter
      const steps = Array.from({ length: count }, (_, i) => {
        const t = i / Math.max(count - 1, 1) // 0..1
        // Lightness from 0.25..0.70 for clear separation
        const l = 0.25 + t * (0.70 - 0.25)
        return hslToHex({ h: base.h, s: base.s, l })
      })
      return steps
    } catch {
      return colors.slice(0, count)
    }
  }, [colors])

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
    const shades = makeShades(colors[0], Math.min(src.length, 5))
    return src.slice(0, 5).map((d, i) => ({
      name: d.name,
      visitors: Number(d.value) || 0,
      fill: shades[i],
    }))
  }, [data, colors, makeShades])

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
                {chartData.map((d, i) => (
                  <Cell key={`cell-${i}`} fill={d.fill} />
                ))}
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
