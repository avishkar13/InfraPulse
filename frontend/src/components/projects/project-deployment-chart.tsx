"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ProjectDeploymentChartProps {
  data: { name: string; deployments: number }[];
}

export function ProjectDeploymentChart({ data }: ProjectDeploymentChartProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold tracking-tight">Deployment Activity</h2>
      <div className="rounded-lg border bg-card p-4 h-[250px] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">Deployments</span>
          <span className="text-xs text-muted-foreground">Last 7 days</span>
        </div>
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value}`} 
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
                contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar 
                dataKey="deployments" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
