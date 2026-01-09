'use client';

import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Users,
  TrendingUp,
  CheckCircle2,
  Zap,
  ArrowRight,
} from 'lucide-react';

type LandingPageProps = {
  onNavigateToLogin: () => void;
};

export function LandingPageNew({ onNavigateToLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sprintos
            </h1>
          </div>
          <Button
            onClick={onNavigateToLogin}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm mb-6">
            <Zap className="w-4 h-4" />
            <span>Modern Project Management</span>
          </div>
          <h1 className="text-6xl text-gray-900 mb-6 leading-tight">
            Manage Projects with
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Speed & Agility
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Sprintos helps teams collaborate, plan sprints, and deliver projects faster with powerful
            agile tools built for modern teams.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={onNavigateToLogin}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Watch Demo
            </Button>
          </div>

          {/* Hero Image Placeholder */}
          <div className="mt-16 rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <LayoutDashboard className="w-24 h-24 text-blue-500/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-gray-900 mb-4">Everything you need to succeed</h2>
            <p className="text-xl text-gray-600">Powerful features for agile teams</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FolderKanban,
                title: 'Sprint Management',
                description: 'Plan and execute sprints with ease using our intuitive kanban boards',
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: MessageSquare,
                title: 'Team Chat',
                description: 'Built-in chat channels for seamless team communication',
                color: 'from-purple-500 to-purple-600',
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                description: 'Invite team members and manage roles with flexible permissions',
                color: 'from-green-500 to-green-600',
              },
              {
                icon: TrendingUp,
                title: 'Progress Tracking',
                description: 'Real-time insights and analytics to track project progress',
                color: 'from-orange-500 to-orange-600',
              },
              {
                icon: CheckCircle2,
                title: 'Task Management',
                description: 'Create, assign, and track tasks with priority levels',
                color: 'from-pink-500 to-pink-600',
              },
              {
                icon: LayoutDashboard,
                title: 'Custom Dashboards',
                description: 'Personalized dashboards for different project views',
                color: 'from-indigo-500 to-indigo-600',
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <CardContent className="pt-6">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10K+', label: 'Active Teams' },
              { value: '50K+', label: 'Projects Delivered' },
              { value: '99.9%', label: 'Uptime' },
              { value: '4.9/5', label: 'User Rating' },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-5xl mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl text-gray-900 mb-6">Ready to boost your productivity?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of teams using Sprintos to deliver projects faster
          </p>
          <Button
            size="lg"
            onClick={onNavigateToLogin}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8"
          >
            Get Started for Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p>© 2026 Sprintos. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
