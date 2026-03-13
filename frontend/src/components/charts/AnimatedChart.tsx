'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { cn } from '@/lib/utils';

interface AnimatedChartProps {
  data: any[];
  lines?: Array<{ dataKey: string; stroke: string; strokeWidth?: number }>;
  areas?: Array<{ dataKey: string; fill: string; stroke: string }>;
  height?: number;
  className?: string;
  animated?: boolean;
}

export function AnimatedChart({ 
  data, 
  lines = [], 
  areas = [], 
  height = 300,
  className,
  animated = true 
}: AnimatedChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-semibold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        {areas.length > 0 ? (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280" 
              strokeWidth={1}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              stroke="#6b7280" 
              strokeWidth={1}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            {areas.map((area, index) => (
              <Area
                key={index}
                type="monotone"
                dataKey={area.dataKey}
                stroke={area.stroke}
                fill={area.fill}
                strokeWidth={2}
                animationDuration={animated ? 1500 : 0}
                dot={false}
              />
            ))}
          </AreaChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280" 
              strokeWidth={1}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              stroke="#6b7280" 
              strokeWidth={1}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            {lines.map((line, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.stroke}
                strokeWidth={line.strokeWidth || 2}
                animationDuration={animated ? 1500 : 0}
                dot={{ fill: line.stroke, strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
