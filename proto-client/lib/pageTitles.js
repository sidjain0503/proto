'use client'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/chat': 'Chat',
  '/documents': 'Documents',
  '/chains': 'Chains',
  '/models': 'Models',
  '/usage': 'Usage',
  '/prompts': 'Prompts',
  '/settings': 'Organization',
  '/settings/profile': 'Profile',
  '/settings/billing': 'Billing',
  '/settings/team': 'Team',
  '/pricing': 'Pricing',
}

export const getPageTitle = (pathname) => {
  if (pathname.startsWith('/chat/')) return 'Chat'
  if (pathname.startsWith('/settings/')) {
    return PAGE_TITLES[pathname] || 'Settings'
  }
  return PAGE_TITLES[pathname] || 'Proto'
}
