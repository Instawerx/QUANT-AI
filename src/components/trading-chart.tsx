"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const generateChartData = () => {
  const data = [];
  let value = 50000;
  for (let i = 0; i < 60; i++) {
    const date = new Date();
    date.setMinutes(date.getMinutes() - (60 - i));
    value += (Math.random() - 0.5) * 1000;
    data.push({
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: Math.max(48000, Math.min(52000, value)),
    });
  }
  return data;
};

const chartData = generateChartData();

const buySellPoints = [
  { time: chartData[10].time, value: chartData[10].value, type: 'buy' },
  { time: chartData[25].time, value: chartData[25].value, type: 'sell' },
  { time: chartData[40].time, value: chartData[40].value, type: 'buy' },
  { time: chartData[55].time, value: chartData[55].value, type: 'sell' },
];

const chartConfig = {
  value: {
    label: "Price",
  },
} satisfies ChartConfig

export function TradingChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 5,
            right: 20,
            left: 0,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
          <XAxis 
            dataKey="time" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            domain={['dataMin - 500', 'dataMax + 500']}
            tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip
            content={<ChartTooltipContent
              labelFormatter={(label) => `Price at ${label}`}
              formatter={(value) => `$${Number(value).toFixed(2)}`}
              indicator="dot"
              cursorClassName="!stroke-primary"
            />}
            
          />
          <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorValue)" />
          
          {buySellPoints.map(p => (
             <ReferenceDot
                key={`${p.type}-${p.time}`}
                x={p.time}
                y={p.value}
                r={6}
                fill={p.type === 'buy' ? "hsl(var(--accent))" : "hsl(var(--destructive))"}
                stroke="hsl(var(--background))"
                strokeWidth={2}
             >
                <animate attributeName="r" from="6" to="10" dur="1.5s" repeatCount="indefinite" begin="0s"/>
                <animate attributeName="opacity" from="1" to="0.5" dur="1.5s" repeatCount="indefinite" begin="0s"/>
            </ReferenceDot>
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
