'use client';

const stats = [
  { label: 'Rendering', value: 35, color: '#F97316' },
  { label: 'Queued', value: 25, color: '#38BDF8' },
  { label: 'Completed', value: 30, color: '#34D399' },
  { label: 'Failed', value: 10, color: '#EF4444' },
];

export default function EventsDistribution() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Render Distribution</h2>
      <div className="flex items-center justify-center h-[200px]">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-2xl font-bold">12</span>
              <p className="text-sm text-gray-500">Total Jobs</p>
            </div>
          </div>
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="8"
            />
            {stats.map((stat, index) => {
              const circumference = 2 * Math.PI * 60;
              let offset = 0;
              for (let i = 0; i < index; i++) {
                offset += (stats[i].value / 100) * circumference;
              }
              return (
                <circle
                  key={stat.label}
                  cx="64"
                  cy="64"
                  r="60"
                  fill="none"
                  stroke={stat.color}
                  strokeWidth="8"
                  strokeDasharray={`${(stat.value / 100) * circumference} ${circumference}`}
                  strokeDashoffset={-offset}
                  className="transition-all duration-1000 ease-out"
                />
              );
            })}
          </svg>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }} />
            <div>
              <span className="text-sm text-gray-600">{stat.label}</span>
              <span className="text-sm font-medium ml-2">{stat.value}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 