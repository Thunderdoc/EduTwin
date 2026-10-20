import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Brain, Sparkles, Zap, Target, TrendingUp, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MobileAppLauncher() {
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const initializeApp = async () => {
      // Progress animation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 2;
        });
      }, 30);

      // Wait for initialization to complete
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Navigate based on authentication status
      if (isAuthenticated) {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    };

    initializeApp();
  }, [isAuthenticated, navigate]);

  const features = [
    { icon: Brain, text: 'Smart Learning Engine', color: 'text-purple-600' },
    { icon: Sparkles, text: 'AI-Powered Personalization', color: 'text-blue-600' },
    { icon: Zap, text: 'Adaptive Difficulty', color: 'text-yellow-600' },
    { icon: Target, text: 'Goal-Driven Learning', color: 'text-green-600' },
    { icon: TrendingUp, text: 'Real-Time Analytics', color: 'text-orange-600' },
    { icon: Shield, text: 'Offline-First Design', color: 'text-indigo-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 max-w-md w-full">
        {/* Logo and Title */}
        <motion.div
          className="text-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-24 h-24 bg-white rounded-3xl shadow-2xl mx-auto mb-6 flex items-center justify-center"
            animate={{
              rotateY: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Brain className="w-12 h-12 text-purple-600" />
          </motion.div>
          
          <h1 className="text-5xl font-bold text-white mb-2">
            EduFlow
          </h1>
          <p className="text-blue-100 text-lg">
            Smart Learning Platform
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-2 gap-4 w-full"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 flex flex-col items-center text-center space-y-2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <feature.icon className={`w-8 h-8 ${feature.color}`} />
              <p className="text-white text-xs font-medium">{feature.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="bg-white/20 rounded-full h-2 w-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-white text-center mt-3 text-sm">
            Initializing Smart Engine... {progress}%
          </p>
        </motion.div>

        {/* Version Info */}
        <motion.div
          className="text-white/60 text-xs text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          Version 2.1.0 • Powered by AI
        </motion.div>
      </div>
    </div>
  );
}
