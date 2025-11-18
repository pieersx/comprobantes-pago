'use client';

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { month: 'Ene', actual: 120000, proyectado: 115000 },
  { month: 'Feb', actual: 135000, proyectado: 130000 },
  { month: 'Mar', actual: 148000, proyectado: 145000 },
  { month: 'Abr', actual: 162000, proyectado: 160000 },
  { month: 'May', actual: 178000, proyectado: 175000 },
  { month: 'Jun', actual: 195000, proyectado: 190000 },
];

export function MonthlyComparison() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="month"
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
          tickFormatter={(value) => `S/ ${value / 1000}k`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-3 shadow-sm">
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-muted-foreground">Actual:</span>
                      <span className="text-sm font-bold">
                        S/ {payload[0].value?.toLocaleString('es-PE')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-muted-foreground">Proyectado:</span>
                      <span className="text-sm font-bold">
                        S/ {payload[1].value?.toLocaleString('es-PE')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          name="Actual"
        />
        <Line
          type="monotone"
          dataKey="proyectado"
          stroke="hsl(var(--chart-3))"
          strokeWidth={2}
          strokeDasharray="5 5"
          name="Proyectado"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
