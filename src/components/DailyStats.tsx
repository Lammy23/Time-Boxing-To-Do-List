// components/DailyStats.tsx
import React, { useEffect, useState } from 'react';
import DailyStat from '@/classes/DailyStat';
import { getDailyStats } from '@/service/apiService';

// interface DailyStatsProps {
//   stats: DailyStat[];
// };

const DailyStats: React.FC = () => {
  const [stats, setStats] = useState<DailyStat[]>([]);

  // Load stats upon component mount
  useEffect(() => {
    getDailyStats().then((value: DailyStat[]) => {
      setStats(value);
    });
  }, []);

  if (stats.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">History</h3>
      <div className="space-y-2">
        {stats.slice(-7).map((stat, index) => ( // TODO: Code smell (ignores stats past 7 days)
          <div
            key={index}
            className="flex justify-between items-center p-2 bg-gray-50 rounded"
          >
            <span>{new Date(stat.date).toLocaleDateString()}</span>
            <span>
              Score: {stat.score} | Completion: {stat.completionRate.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyStats