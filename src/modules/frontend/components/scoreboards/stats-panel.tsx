import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { BarChart2 } from "lucide-react";

export interface StatItem {
  label: string;
  valA: number | string;
  valB: number | string;
  unit?: string;
  total?: number; // for visual progress ratio
}

export interface StatsPanelProps {
  title?: string;
  teamAName: string;
  teamBName: string;
  stats: StatItem[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  title = "Match Statistics",
  teamAName,
  teamBName,
  stats,
}) => {
  return (
    <Card variant="default">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <BarChart2 className="w-4 h-4 text-hpl-accent" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Teams Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-hpl-border text-xs font-bold text-white">
          <span>{teamAName}</span>
          <span>{teamBName}</span>
        </div>

        <div className="space-y-4">
          {stats.map((item, idx) => {
            const numA = typeof item.valA === "number" ? item.valA : parseFloat(String(item.valA)) || 0;
            const numB = typeof item.valB === "number" ? item.valB : parseFloat(String(item.valB)) || 0;
            const sum = item.total || (numA + numB > 0 ? numA + numB : 1);
            const percentA = Math.round((numA / sum) * 100);

            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white font-mono">
                    {item.valA}
                    {item.unit}
                  </span>
                  <span className="text-hpl-muted font-medium text-center">{item.label}</span>
                  <span className="font-bold text-white font-mono">
                    {item.valB}
                    {item.unit}
                  </span>
                </div>
                {/* Dual side comparative progress bar */}
                <div className="h-2 w-full bg-hpl-surface-2 rounded-full overflow-hidden flex border border-hpl-border/50">
                  <div
                    className="bg-hpl-accent transition-all duration-300 rounded-l-full"
                    style={{ width: `${percentA}%` }}
                  />
                  <div
                    className="bg-cyan-500 transition-all duration-300 rounded-r-full"
                    style={{ width: `${100 - percentA}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
