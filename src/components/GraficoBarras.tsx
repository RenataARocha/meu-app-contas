"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Props {
  dados: { mes: string; total: number; pago: number }[];
}

export function GraficoBarras({ dados }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={dados} barGap={4}>
        <XAxis
          dataKey="mes"
          tick={{ fontSize: 11, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0f0f1a",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "12px",
            fontSize: "12px",
          }}
          formatter={(value) => {
            const num = typeof value === "number" ? value : 0;
            return new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(num);
          }}
          labelStyle={{ color: "#9ca3af" }}
        />
        <Bar dataKey="total" radius={[6, 6, 0, 0]} fill="#1a1a35" />
        <Bar dataKey="pago" radius={[6, 6, 0, 0]}>
          {dados.map((_, i) => (
            <Cell key={i} fill="#22c55e" fillOpacity={0.8} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}