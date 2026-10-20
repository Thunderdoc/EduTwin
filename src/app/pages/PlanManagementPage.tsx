import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { toast } from 'sonner';
import {
  Crown,
  Check,
  Sparkles,
  Zap,
  Brain,
  Globe,
  Users,
  Shield,
  Star,
  Rocket,
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  Gift,
  ArrowRight,
  Info,
} from 'lucide-react';
import Navigation from '../components/Navigation';

export default function PlanManagementPage() {
  const { userPlan, userProfile } = useApp();
  const [selectedPlan, setSelectedPlan] = useState(userPlan.type);

  const plans = [
    {
      type: 'free' as const,
      name: 'Free Explorer',
      price: '₹0',
      period: 'Forever',
      icon: Gift,
      gradient: 'from-gray-500 to-gray-600',
      description: 'Perfect for getting started with AI-powered learning',
      features: [
        { text: '5 AI Tools Access', included: true },
        { text: 'Basic Digital Twin', included: true },
        { text: '5 Languages Support', included: true },
        { text: 'Offline Mode', included: true },
        { text: 'Community Support', included: true },
        { text: 'Daily Learning Goals', included: true },
        { text: 'Advanced AI Tools', included: false },
        { text: 'Priority Support', included: false },
        { text: 'Custom Learning Paths', included: false },
        { text: 'Team Collaboration', included: false },
      ],
      limits: {
        aiToolsPerDay: 10,
        storageGB: 2,
        learningPaths: 1,
      },
    },
    {
      type: 'pro' as const,
      name: 'Pro Learner',
      price: '₹499',
      period: 'per month',
      icon: Rocket,
      gradient: 'from-purple-500 to-blue-600',
      popular: true,
      description: 'Unlock the full potential of AI-enhanced learning',
      features: [
        { text: 'All 15 AI Tools', included: true },
        { text: 'Advanced Digital Twin', included: true },
        { text: '5 Languages + Voice Support', included: true },
        { text: 'Enhanced Offline Mode', included: true },
        { text: 'Priority Email Support', included: true },
        { text: 'Custom Learning Paths', included: true },
        { text: 'Advanced Analytics', included: true },
        { text: 'No Daily Limits', included: true },
        { text: 'Personalized Recommendations', included: true },
        { text: 'Team Collaboration', included: false },
      ],
      limits: {
        aiToolsPerDay: 'Unlimited',
        storageGB: 50,
        learningPaths: 10,
      },
      savings: 'Save ₹1,000 annually',
    },
    {
      type: 'enterprise' as const,
      name: 'Enterprise',
      price: '₹2,999',
      period: 'per month',
      icon: Crown,
      gradient: 'from-yellow-500 to-orange-600',
      description: 'Complete solution for schools and organizations',
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'Multi-user Management', included: true },
        { text: 'Custom Branding', included: true },
        { text: 'Dedicated Account Manager', included: true },
        { text: 'API Access', included: true },
        { text: 'Advanced Security', included: true },
        { text: 'Custom Integrations', included: true },
        { text: 'Training & Onboarding', included: true },
        { text: 'SLA Guarantee', included: true },
        { text: 'White-label Options', included: true },
      ],
      limits: {
        aiToolsPerDay: 'Unlimited',
        storageGB: 'Unlimited',
        learningPaths: 'Unlimited',
      },
      contact: true,
    },
  ];

  const handleUpgrade = (_planType: 'free' | 'pro' | 'enterprise') => {
    toast.info('Billing is not connected', { description: 'This is a product preview. No payment was taken and your plan or feature access was not changed.' });
  };

  const currentPlan = plans.find((p) => p.type === userPlan.type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <Navigation />

      <div className="lg:ml-64">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Choose Your Learning Path</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Preview the proposed plans. Billing, subscriptions, feature enforcement, and sales contact are not connected in this prototype; displayed prices are illustrative only.
          </p>
        </div>

        {/* Current Plan Alert */}
        {userProfile && (
          <Alert className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <Info className="h-4 w-4 text-purple-600" />
            <AlertTitle className="text-purple-900 font-semibold">Current Plan</AlertTitle>
            <AlertDescription className="text-purple-800">
              You are currently on the <strong>{currentPlan?.name}</strong> plan.{' '}
              Plan status is a local preview only; payment and feature access are not connected.
            </AlertDescription>
          </Alert>
        )}

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => {
            const PlanIcon = plan.icon;
            const isCurrentPlan = plan.type === userPlan.type;

            return (
              <Card
                key={plan.type}
                className={`relative overflow-hidden transition-all hover:shadow-2xl ${
                  plan.popular ? 'ring-4 ring-purple-500 scale-105' : ''
                } ${isCurrentPlan ? 'border-green-500 border-2' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                    <Star className="w-3 h-3 inline mr-1" />
                    Most Popular
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute top-0 left-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1 text-sm font-semibold rounded-br-lg">
                    <Check className="w-3 h-3 inline mr-1" />
                    Current Plan
                  </div>
                )}

                <CardHeader className="pb-8">
                  <div className={`w-14 h-14 bg-gradient-to-br ${plan.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <PlanIcon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>

                  <div className="mt-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-500">/ {plan.period}</span>
                    </div>
                    {plan.savings && (
                      <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-200">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {plan.savings}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features List */}
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400 line-through'}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Usage Limits */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">Plan Limits:</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">AI Tools/Day:</span>
                        <span className="font-semibold">{plan.limits.aiToolsPerDay}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Storage:</span>
                        <span className="font-semibold">{plan.limits.storageGB} GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Learning Paths:</span>
                        <span className="font-semibold">{plan.limits.learningPaths}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleUpgrade(plan.type)}
                    disabled={isCurrentPlan && !plan.contact}
                    className={`w-full h-12 font-semibold ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                        : plan.type === 'enterprise'
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700'
                        : ''
                    }`}
                    variant={plan.popular || plan.type === 'enterprise' ? 'default' : 'outline'}
                  >
                    {isCurrentPlan ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Current Plan
                      </>
                    ) : plan.contact ? (
                      <>
                        Contact Sales
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        {plan.type === 'free' ? 'Downgrade' : 'Upgrade Now'}
                        <Sparkles className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Comparison */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Why Upgrade?
            </CardTitle>
            <CardDescription>Unlock powerful features to accelerate your learning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg">Advanced AI Tools</h3>
                <p className="text-sm text-gray-600">
                  Access all 15 AI-powered tools including code playground, essay writer, and mock test generators.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg">Custom Learning Paths</h3>
                <p className="text-sm text-gray-600">
                  Get personalized learning paths tailored to your pace, goals, and learning style.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg">Priority Support</h3>
                <p className="text-sm text-gray-600">
                  Get help when you need it with priority email support and dedicated assistance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Usage Stats (For Pro/Enterprise) */}
        {(userPlan.type === 'pro' || userPlan.type === 'enterprise') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Your Usage This Month
              </CardTitle>
              <CardDescription>Track your learning progress and plan utilization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* AI Tools Usage */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">AI Tools Used</span>
                  <span className="text-gray-600">247 / Unlimited</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>

              {/* Storage Usage */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Storage Used</span>
                  <span className="text-gray-600">
                    12.5 GB / {userPlan.type === 'enterprise' ? 'Unlimited' : '50 GB'}
                  </span>
                </div>
                <Progress value={25} className="h-2" />
              </div>

              {/* Learning Paths */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Active Learning Paths</span>
                  <span className="text-gray-600">
                    3 / {userPlan.type === 'enterprise' ? 'Unlimited' : '10'}
                  </span>
                </div>
                <Progress value={30} className="h-2" />
              </div>

              {/* Study Time */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Study Time This Month</span>
                  <span className="text-gray-600">42.5 hours</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* FAQ Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help Choosing?</h2>
          <p className="text-gray-600 mb-6">Contact our support team for personalized recommendations</p>
          <Button size="lg" variant="outline">
            <Users className="w-4 h-4 mr-2" />
            Talk to Sales
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
}
