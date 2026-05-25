'use client'

const PAGE_TITLES = {
  '/': 'Home',
  '/chat': 'Chat',
  '/documents': 'Documents',
  '/chains': 'Chains',
  '/models': 'Models',
  '/usage': 'Usage',
  '/prompts': 'Prompts',
  '/settings': 'Settings',
}

export const getPageTitle = (pathname) => {
  if (pathname.startsWith('/chat/')) return 'Chat'
  return PAGE_TITLES[pathname] || 'Proto'
}
