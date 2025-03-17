import React from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between text-sm mb-1">
          {label && <span className="text-light-300">{label}</span>}
          {showValue && <span className="text-light-300">{percentage.toFixed(0)}%</span>}
        </div>
      )}
      <div className="progress-bar">
        <div
          className="progress-value"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
    </div>
  );
};