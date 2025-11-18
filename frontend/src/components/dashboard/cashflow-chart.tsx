'use client';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface CashFlowChartProps {
  data?: Array<{
    month: string;
    ingresos: number;
    egresos: number;
  }>;
}

export function CashFlowChart({ data }: CashFlowChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[350px] items-center justify-center text-muted-foreground">
        No hay datos disponibles
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
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
                      <span className="text-sm text-muted-foreground">Ingresos:</span>
                      <span className="text-sm font-bold text-green-600">
                        S/ {payload[0].value?.toLocaleString('es-PE')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-muted-foreground">Egresos:</span>
                      <span className="text-sm font-bold text-red-600">
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
        <Bar
          dataKey="ingresos"
          fill="hsl(var(--chart-1))"
          radius={[4, 4, 0, 0]}
          name="Ingresos"
        />
        <Bar
          dataKey="egresos"
          fill="hsl(var(--chart-2))"
          radius={[4, 4, 0, 0]}
          name="Egresos"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
