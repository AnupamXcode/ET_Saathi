import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface ConfidenceMeterProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ConfidenceMeter({ score, size = 120, strokeWidth = 8, className }: ConfidenceMeterProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  
  let colorClass = "text-primary";
  if (score >= 80) colorClass = "text-positive";
  else if (score <= 40) colorClass = "text-destructive";

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      {/* Background Circle */}
      <svg className="absolute transform -rotate-90 w-full h-full">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-white/5"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={colorClass}
          strokeLinecap="round"
        />
      </svg>
      <div className="flex flex-col items-center justify-center">
        <span className={cn("text-2xl font-display font-bold", colorClass)}>{score}%</span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Confidence</span>
      </div>
    </div>
  );
}
