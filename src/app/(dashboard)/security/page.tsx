import SecurityStatus from '@/components/security/SecurityStatus'
import ChangePasswordForm from '@/components/security/ChangePasswordForm'
import TwoFactorAuth from '@/components/security/TwoFactorAuth'
import ActiveSessions from '@/components/security/ActiveSessions'
import DangerZone from '@/components/security/DangerZone'

export default function SecurityPage() {
  const activeSessions = [
    {
      device: 'Windows PC',
      location: 'Ho Chi Minh City, Vietnam',
      ip: '192.168.1.100',
      lastActive: 'Active now',
      current: true
    },
    {
      device: 'iPhone 14 Pro',
      location: 'Ho Chi Minh City, Vietnam',
      ip: '192.168.1.101',
      lastActive: '2 hours ago',
      current: false
    },
    {
      device: 'Chrome on MacBook',
      location: 'Hanoi, Vietnam',
      ip: '192.168.1.102',
      lastActive: '1 day ago',
      current: false
    }
  ]

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="p-8 max-w-5xl mx-auto">
        <div className="space-y-6">
          <SecurityStatus />
          <ChangePasswordForm />
          <TwoFactorAuth />
          <ActiveSessions sessions={activeSessions} />
          <DangerZone />
        </div>
      </div>
    </div>
  )
}