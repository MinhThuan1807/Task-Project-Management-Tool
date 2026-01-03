'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Zap, Users, BarChart3 } from 'lucide-react';

interface LandingPageNewProps {
  onNavigateToLogin: () => void;
}

export function LandingPageNew({ onNavigateToLogin }: LandingPageNewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600" />
            <span className="text-xl font-bold">TaskFlow</span>
          </div>
          <Button onClick={onNavigateToLogin} variant="outline">
            Sign In
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Manage Projects with
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}Ease & Efficiency
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Streamline your workflow, collaborate with your team, and deliver projects faster with our powerful task management platform.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={onNavigateToLogin}
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-blue-600" />}
            title="Lightning Fast"
            description="Built with performance in mind. Manage thousands of tasks without breaking a sweat."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-purple-600" />}
            title="Team Collaboration"
            description="Work together seamlessly with real-time updates and notifications."
          />
          <FeatureCard
            icon={<BarChart3 className="h-8 w-8 text-pink-600" />}
            title="Powerful Analytics"
            description="Track progress with detailed insights and comprehensive reporting."
          />
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose TaskFlow?</h2>
          <div className="space-y-4">
            <BenefitItem text="Intuitive drag-and-drop interface" />
            <BenefitItem text="Customizable workflows and sprints" />
            <BenefitItem text="Real-time collaboration tools" />
            <BenefitItem text="Advanced reporting and analytics" />
            <BenefitItem text="Seamless integrations" />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
      <span className="text-gray-700">{text}</span>
    </div>
  );
}