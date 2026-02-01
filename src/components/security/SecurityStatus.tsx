'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, CheckCircle2, AlertTriangle } from 'lucide-react'

export default function SecurityStatus() {
  const [twoFactorEnabled] = useState(false)

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white">
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Account Security</h2>
            <p className="text-green-100 mt-1">
              Your account is secure and protected
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <CheckCircle2 className="w-6 h-6 mb-2" />
            <div className="text-sm font-medium">Strong Password</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <CheckCircle2 className="w-6 h-6 mb-2" />
            <div className="text-sm font-medium">Email Verified</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            {twoFactorEnabled ? (
              <>
                <CheckCircle2 className="w-6 h-6 mb-2" />
                <div className="text-sm font-medium">2FA Enabled</div>
              </>
            ) : (
              <>
                <AlertTriangle className="w-6 h-6 mb-2" />
                <div className="text-sm font-medium">2FA Disabled</div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}