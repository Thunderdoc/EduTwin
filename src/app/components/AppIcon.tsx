import { motion } from 'motion/react';
import { Brain } from 'lucide-react';

interface AppIconProps {
  size?: number;
  animate?: boolean;
  className?: string;
}

export const AppIcon = ({ size = 64, animate = true, className = '' }: AppIconProps) => {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      initial={animate ? { scale: 0, opacity: 0 } : undefined}
      animate={animate ? { scale: 1, opacity: 1 } : undefined}
      transition={{ duration: 0.5, type: 'spring', bounce: 0.5 }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-3xl shadow-2xl" />
      
      {/* Animated Rings */}
      {animate && (
        <>
          <motion.div
            className="absolute inset-0 rounded-3xl border-4 border-purple-400"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-3xl border-4 border-blue-400"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              delay: 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </>
      )}
      
      {/* Brain Icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={
            animate
              ? {
                  rotateY: [0, 360],
                }
              : undefined
          }
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Brain className="text-white" size={size * 0.5} strokeWidth={2.5} />
        </motion.div>
      </div>
      
      {/* Sparkle Effects */}
      {animate && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.3,
                repeat: Infinity,
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
};

export default AppIcon;
