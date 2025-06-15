'use client'

import { useRouter } from 'next/navigation'
import { logoutAction } from './actions'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await logoutAction()
    router.refresh()
    router.push('/admin/login?token=f8c53b9aa2471c4fcf875a867462600db76bb03cceabc7d294425a3d63903f9f')
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Logout
    </button>
  )
} 