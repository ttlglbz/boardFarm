'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 200 },
  { name: 'Feb', value: 250 },
  { name: 'Mar', value: 180 },
  { name: 'Apr', value: 320 },
  { name: 'May', value: 280 },
  { name: 'Jun', value: 450 },
  { name: 'Jul', value: 380 },
  { name: 'Aug', value: 420 },
  { name: 'Sep', value: 390 },
  { name: 'Oct', value: 450 },
  { name: 'Nov', value: 380 },
  { name: 'Dec', value: 430 },
];

export default function AnalyticsChart() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorValue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
} 