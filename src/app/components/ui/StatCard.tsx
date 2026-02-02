import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: ReactNode;
  color?: string;
  delay?: number;
}

export function StatCard({ 
  title, 
  value, 
  change, 
  trend = 'neutral', 
  icon, 
  color = 'bg-primary',
  delay = 0 
}: StatCardProps) {
  const trendIcons = {
    up: <TrendingUp className="w-4 h-4" />,
    down: <TrendingDown className="w-4 h-4" />,
    neutral: <Minus className="w-4 h-4" />,
  };

  const trendColors = {
    up: 'text-chart-1',
    down: 'text-destructive',
    neutral: 'text-muted-foreground',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
      className="bg-card border border-border rounded-xl p-6 relative overflow-hidden group cursor-pointer"
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay + 0.1 }}
            className="text-3xl font-semibold text-foreground"
          >
            {value}
          </motion.p>
          {change && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: delay + 0.2 }}
              className={`flex items-center gap-1 text-sm ${trendColors[trend]}`}
            >
              {trendIcons[trend]}
              <span>{change}</span>
            </motion.div>
          )}
        </div>
        <motion.div 
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className={`w-12 h-12 ${color} bg-opacity-20 rounded-lg flex items-center justify-center group-hover:bg-opacity-30 transition-all`}
        >
          {icon}
        </motion.div>
      </div>
    </motion.div>
  );
}
