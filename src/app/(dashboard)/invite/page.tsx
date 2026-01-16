'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, Mail, Shield } from 'lucide-react';
import { projectApi } from '@/lib/services/project.service';
import { toast } from 'sonner';
import { useCurrentUser } from '@/lib/hooks/useAuth';

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    const acceptInvitation = async () => {
      try {
        // Get parameters from URL
        const email = searchParams.get('email');
        const token = searchParams.get('token');
        const projectId = searchParams.get('projectId');

        // Validate parameters
        if (!email || !token || !projectId) {
          setStatus('error');
          setErrorMessage('Invalid invitation link. Missing required parameters.');
          return;
        }

        // Wait for user to be loaded
        if (userLoading) {
          return;
        }

        // Check if user is logged in
        if (!currentUser) {
          // Redirect to login with return URL
          const returnUrl = `/invite?email=${email}&token=${token}&projectId=${projectId}`;
          router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
          return;
        }

        // Check if logged-in user matches invitation email
        if (currentUser.email !== email) {
          setStatus('error');
          setErrorMessage(
            `This invitation was sent to ${email}. Please log in with the correct account.`
          );
          return;
        }

        // Accept invitation
        const response = await projectApi.acceptInvite({
          email,
          token,
          projectId,
        });

        setProjectName(response.name || 'the project');
        setStatus('success');
        toast.success('Successfully joined the project!');

        // Redirect to project page after 2 seconds
        setTimeout(() => {
          router.push(`/projects/${projectId}`);
        }, 2000);
      } catch (error: any) {
        setStatus('error');
        const message = error.response?.data?.message || error.message || 'Failed to accept invitation';
        setErrorMessage(message);
        toast.error(message);
      }
    };

    acceptInvitation();
  }, [searchParams, currentUser, userLoading, router]);

  if (userLoading || status === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardContent className="pt-12 pb-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Invitation</h2>
                <p className="text-gray-600">Please wait while we verify your invitation...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Invitation Accepted!</CardTitle>
            <CardDescription className="text-base mt-2">
              You have successfully joined {projectName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">Welcome to the team!</p>
                  <p>You can now access all project resources and collaborate with your team members.</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Redirecting to project page...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <XCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Invitation Failed</CardTitle>
            <CardDescription className="text-base mt-2">
              We couldn't process your invitation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-medium mb-1">Error Details:</p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Go to Dashboard
              </Button>
              <Button
                onClick={() => router.push('/login')}
                variant="outline"
                className="w-full"
              >
                Login with Different Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}