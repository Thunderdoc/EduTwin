import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Trophy, Zap, Star, Target, TrendingUp, Award, Gift, Crown, Flame, Medal, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  earnedDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  deadline: string;
}

export default function GamificationPage() {
  const { userProfile } = useApp();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'achievements' | 'challenges' | 'leaderboard'>('overview');

  // Mock data - in real app, fetch from backend
  const [userStats] = useState({
    level: 12,
    currentXP: 2450,
    nextLevelXP: 3000,
    totalXP: 14450,
    streak: 12,
    longestStreak: 28,
    badges: 18,
    rank: 'Scholar',
    nextRank: 'Expert',
  });

  const achievements: Achievement[] = [
    {
      id: '1',
      title: '7-Day Streak',
      description: 'Complete lessons for 7 consecutive days',
      icon: <Flame className="w-6 h-6" />,
      earned: true,
      earnedDate: '2025-03-25',
      rarity: 'common',
    },
    {
      id: '2',
      title: 'Quiz Master',
      description: 'Score 100% on any quiz',
      icon: <Trophy className="w-6 h-6" />,
      earned: true,
      earnedDate: '2025-03-28',
      rarity: 'rare',
    },
    {
      id: '3',
      title: 'Speed Learner',
      description: 'Complete 5 lessons in one day',
      icon: <Zap className="w-6 h-6" />,
      earned: true,
      earnedDate: '2025-04-01',
      rarity: 'epic',
    },
    {
      id: '4',
      title: 'Knowledge Seeker',
      description: 'Complete 50 lessons total',
      icon: <Star className="w-6 h-6" />,
      earned: false,
      rarity: 'rare',
    },
    {
      id: '5',
      title: 'Perfect Month',
      description: 'Maintain a 30-day streak',
      icon: <Crown className="w-6 h-6" />,
      earned: false,
      rarity: 'legendary',
    },
    {
      id: '6',
      title: 'Early Bird',
      description: 'Complete lessons before 8 AM for 5 days',
      icon: <Medal className="w-6 h-6" />,
      earned: false,
      rarity: 'common',
    },
  ];

  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'Daily Practice',
      description: 'Complete 3 lessons today',
      progress: 2,
      target: 3,
      reward: 100,
      difficulty: 'easy',
      deadline: 'Today',
    },
    {
      id: '2',
      title: 'Quiz Champion',
      description: 'Score above 80% on 5 quizzes this week',
      progress: 3,
      target: 5,
      reward: 250,
      difficulty: 'medium',
      deadline: '3 days',
    },
    {
      id: '3',
      title: 'Consistency King',
      description: 'Study for 7 consecutive days',
      progress: 12,
      target: 7,
      reward: 500,
      difficulty: 'hard',
      deadline: 'Ongoing',
    },
  ];

  const leaderboard = [
    { rank: 1, name: 'Alex Kumar', xp: 24500, avatar: '👨‍💻', isCurrentUser: false },
    { rank: 2, name: 'Priya Singh', xp: 22100, avatar: '👩‍🎓', isCurrentUser: false },
    { rank: 3, name: userProfile?.name || 'You', xp: 14450, avatar: '🎯', isCurrentUser: true },
    { rank: 4, name: 'Raj Patel', xp: 13200, avatar: '📚', isCurrentUser: false },
    { rank: 5, name: 'Sara Chen', xp: 12800, avatar: '🌟', isCurrentUser: false },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-500';
      case 'rare': return 'from-blue-400 to-blue-500';
      case 'epic': return 'from-purple-400 to-purple-500';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const progressPercentage = (userStats.currentXP / userStats.nextLevelXP) * 100;

  const handleClaimReward = (challengeTitle: string, reward: number) => {
    toast.success(`🎉 Claimed ${reward} XP for completing "${challengeTitle}"!`);
    // In a real app, this would update the user's XP in the backend
  };

  const handleContinueChallenge = (challengeTitle: string) => {
    toast.info(`Keep going! Complete "${challengeTitle}" to earn rewards.`);
    navigate('/autonomous-learning');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/dashboard"
            className="p-2 rounded-xl bg-white/80 backdrop-blur-sm hover:bg-white transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Achievements & Rewards
            </h1>
            <p className="text-gray-600">Track your progress and earn rewards</p>
          </div>
        </div>

        {/* Level & XP Card */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-6 mb-6 text-white shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-4 border-white/30">
                {userStats.level}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{userStats.rank}</h2>
                <p className="text-white/80">{userProfile?.name || 'Student'}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-5 h-5 text-orange-300" />
                <span className="text-2xl font-bold">{userStats.streak}</span>
              </div>
              <p className="text-sm text-white/80">Day Streak</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Level {userStats.level} Progress</span>
              <span>{userStats.currentXP} / {userStats.nextLevelXP} XP</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-300 to-orange-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-sm text-white/80 mt-2">
              {userStats.nextLevelXP - userStats.currentXP} XP to reach {userStats.nextRank}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{userStats.badges}</p>
            <p className="text-sm text-gray-600">Badges Earned</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <Zap className="w-8 h-8 text-purple-500 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{userStats.totalXP.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total XP</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <Flame className="w-8 h-8 text-orange-500 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{userStats.longestStreak}</p>
            <p className="text-sm text-gray-600">Longest Streak</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <TrendingUp className="w-8 h-8 text-green-500 mb-2" />
            <p className="text-2xl font-bold text-gray-900">#{leaderboard.find(u => u.isCurrentUser)?.rank}</p>
            <p className="text-sm text-gray-600">Leaderboard Rank</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-2">
          <button
            onClick={() => setSelectedTab('achievements')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              selectedTab === 'achievements'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🏆 Achievements
          </button>
          <button
            onClick={() => setSelectedTab('challenges')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              selectedTab === 'challenges'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🎯 Challenges
          </button>
          <button
            onClick={() => setSelectedTab('leaderboard')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              selectedTab === 'leaderboard'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            👥 Leaderboard
          </button>
        </div>

        {/* Content Area */}
        {selectedTab === 'achievements' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`bg-white rounded-2xl p-6 shadow-lg ${
                  achievement.earned ? 'ring-2 ring-yellow-400' : 'opacity-60'
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getRarityColor(achievement.rarity)} flex items-center justify-center mb-4 ${achievement.earned ? '' : 'grayscale'}`}>
                  <div className="text-white">{achievement.icon}</div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{achievement.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                {achievement.earned ? (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Trophy className="w-4 h-4" />
                    Earned {achievement.earnedDate}
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">Not yet earned</div>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'challenges' && (
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{challenge.title}</h3>
                    <p className="text-sm text-gray-600">{challenge.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress: {challenge.progress} / {challenge.target}</span>
                    <span className="text-gray-600">Deadline: {challenge.deadline}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-yellow-600">
                    <Zap className="w-5 h-5" />
                    <span className="font-semibold">+{challenge.reward} XP</span>
                  </div>
                  {challenge.progress >= challenge.target ? (
                    <button
                      onClick={() => handleClaimReward(challenge.title, challenge.reward)}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all"
                    >
                      Claim Reward
                    </button>
                  ) : (
                    <button
                      onClick={() => handleContinueChallenge(challenge.title)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
                    >
                      Continue
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'leaderboard' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <h2 className="text-xl font-bold mb-1">Global Leaderboard</h2>
              <p className="text-white/80">Compete with learners worldwide</p>
            </div>
            <div className="divide-y">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className={`p-4 flex items-center gap-4 ${
                    user.isCurrentUser ? 'bg-purple-50 border-l-4 border-purple-600' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    user.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white' :
                    user.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                    user.rank === 3 ? 'bg-gradient-to-br from-orange-300 to-orange-400 text-white' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {user.rank <= 3 ? <Crown className="w-5 h-5" /> : user.rank}
                  </div>
                  <div className="text-3xl">{user.avatar}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.xp.toLocaleString()} XP</p>
                  </div>
                  {user.isCurrentUser && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                      You
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
