// components/CompletionRateDisplay.tsx
import React from 'react';

const CompletionRateDisplay = ({ rate }: { rate: number }) => {
  // Calculate colors based on completion rate
  const getColors = (percentage: number) => {
    if (percentage >= 80) return { 
      stroke: "rgb(34, 197, 94)", 
      text: "text-green-500",
      background: "bg-green-50" 
    };
    if (percentage >= 60) return { 
      stroke: "rgb(59, 130, 246)", 
      text: "text-blue-500",
      background: "bg-blue-50" 
    };
    if (percentage >= 40) return { 
      stroke: "rgb(234, 179, 8)", 
      text: "text-yellow-500",
      background: "bg-yellow-50"  
    };
    if (percentage >= 20) return { 
      stroke: "rgb(249, 115, 22)", 
      text: "text-orange-500",
      background: "bg-orange-50"  
    };
    return { 
      stroke: "rgb(239, 68, 68)", 
      text: "text-red-500",
      background: "bg-red-50"  
    };
  };

  const colors = getColors(rate);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (rate / 100) * circumference;

  return (
    <div className={`fixed right-8 top-1/3 w-48 h-48 ${colors.background} rounded-full shadow-lg flex items-center justify-center`}>
      <div className="relative">
        {/* Background circle */}
        <svg className="w-40 h-40 -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="45"
            fill="none"
            strokeWidth="8"
            className="stroke-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r="45"
            fill="none"
            strokeWidth="8"
            stroke={colors.stroke}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              transition: 'stroke-dashoffset 0.5s ease'
            }}
          />
        </svg>
        {/* Percentage text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${colors.text}`}>
            {rate.toFixed(0)}%
          </span>
          {/* <span className="text-sm text-gray-500">Completion</span> */}
        </div>
      </div>
    </div>
  );
};

export default CompletionRateDisplay;