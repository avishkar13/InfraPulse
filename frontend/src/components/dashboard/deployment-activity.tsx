"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: "Mon", deployments: 4 },
  { name: "Tue", deployments: 7 },
  { name: "Wed", deployments: 5 },
  { name: "Thu", deployments: 8 },
  { name: "Fri", deployments: 6 },
  { name: "Sat", deployments: 3 },
  { name: "Sun", deployments: 5 },
];

export function DeploymentActivity() {
  const totalDeployments = data.reduce((acc, curr) => acc + curr.deployments, 0);

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col transition-all hover:shadow-md h-full min-h-[350px]">
      <div className="flex flex-col space-y-1.5 p-6 pb-2">
        <h3 className="font-semibold leading-none tracking-tight">Deployment Activity</h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Last 7 days</p>
          <div className="text-sm font-medium">
            <span className="text-muted-foreground">Total:</span> {totalDeployments}
          </div>
        </div>
      </div>
      <div className="flex-1 p-6 pt-0 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDeployments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {payload[0].payload.name}
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {payload[0].value} deployments
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="deployments"
              stroke="var(--primary)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorDeployments)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
