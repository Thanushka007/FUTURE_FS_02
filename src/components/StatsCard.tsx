import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'yellow';
  delay?: number;
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  yellow: 'from-yellow-500 to-yellow-600',
};

const glowClasses = {
  blue: 'shadow-blue-500/25',
  green: 'shadow-green-500/25',
  purple: 'shadow-purple-500/25',
  yellow: 'shadow-yellow-500/25',
};

export default function StatsCard({ title, value, icon: Icon, color, delay = 0 }: StatsCardProps) {
  const animatedValue = useAnimatedCounter(value, 1500);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative overflow-hidden bg-[#1e293b]/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/0 to-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <motion.p
            key={animatedValue}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold text-white"
          >
            {animatedValue}
          </motion.p>
        </div>

        <motion.div
          whileHover={{ rotate: 15, scale: 1.1 }}
          className={`p-4 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg ${glowClasses[color]}`}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
      </div>

      <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br ${colorClasses[color]} opacity-10 blur-2xl`} />
    </motion.div>
  );
}
