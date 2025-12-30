import React from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface BigButtonProps {
  children: ReactNode;
  onClick?: () => void;
  emoji?: string;
  color?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  disabled?: boolean;
  className?: string;
}

export const BigButton: React.FC<BigButtonProps> = ({
  children,
  onClick,
  emoji,
  color = 'bg-theme-primary',
  size = 'large',
  disabled = false,
  className = '',
}) => {
  const sizeClasses = {
    small: 'min-w-[80px] min-h-[80px] text-xl p-3',
    medium: 'min-w-[100px] min-h-[100px] text-2xl',
    large: 'min-w-[140px] min-h-[140px] text-3xl',
    xlarge: 'min-w-[180px] min-h-[180px] text-4xl',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${color}
        ${sizeClasses[size]}
        rounded-3xl
        shadow-lg
        font-bold
        text-white
        flex
        flex-col
        items-center
        justify-center
        gap-2
        p-6
        transition-all
        duration-200
        touch-target
        no-select
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:shadow-md hover:shadow-xl'}
        ${className}
      `}
    >
      {emoji && <span className="text-5xl">{emoji}</span>}
      <span className="text-center leading-tight">{children}</span>
    </motion.button>
  );
};
