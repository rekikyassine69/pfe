import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
  animate?: boolean;
}

export function Badge({ children, variant = 'default', className = '', animate = true }: BadgeProps) {
  const variants = {
    default: 'bg-secondary text-secondary-foreground',
    success: 'bg-chart-1/20 text-chart-1',
    warning: 'bg-orange-500/20 text-orange-600',
    danger: 'bg-destructive/20 text-destructive',
    info: 'bg-chart-2/20 text-chart-2',
  };

  const Component = animate ? motion.span : 'span';
  const animationProps = animate ? {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component
      {...animationProps}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </Component>
  );
}
