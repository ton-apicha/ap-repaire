'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  CpuChipIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  DocumentTextIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline'
import { useLanguage } from '@/contexts/LanguageContext'
// import { useSession, signOut } from 'next-auth/react'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()
  // const { data: session } = useSession()
  const session = null // TEMPORARILY DISABLED FOR TESTING

  const navigation = [
    { name: t('dashboard.title'), href: '/dashboard', icon: HomeIcon },
    { name: t('workOrders.title'), href: '/work-orders', icon: ClipboardDocumentListIcon },
    { name: t('customers.title'), href: '/customers', icon: UsersIcon },
    { name: t('technicians.title'), href: '/technicians', icon: WrenchScrewdriverIcon },
    { name: t('miners.title'), href: '/miners', icon: CpuChipIcon },
    { name: t('invoice.title'), href: '/invoices', icon: DocumentTextIcon },
    { name: t('payment.title'), href: '/payments', icon: CreditCardIcon },
    { name: t('admin.title'), href: '/admin', icon: Cog6ToothIcon },
  ]

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 flex flex-col h-screen ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 flex-shrink-0">
        {!collapsed && (
          <h1 className="text-xl font-bold">AP Repair</h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded p-1 hover:bg-gray-800"
        >
          {collapsed ? (
            <ChevronRightIcon className="h-5 w-5" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-8 overflow-y-auto">
        <div className="px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`mb-2 flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="ml-3">{item.name}</span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 p-4 border-t border-gray-800">
        {!collapsed ? (
          <>
            {/* Language Selector */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-300">
                {t('common.language')}
              </label>
              <div className="flex space-x-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as 'en' | 'th' | 'zh')}
                    className={`flex items-center rounded px-2 py-1 text-xs ${
                      language === lang.code
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-1">{lang.flag}</span>
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* User Info and Sign Out - TEMPORARILY DISABLED */}
            {/* {session && (
              <div className="space-y-3">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-200 truncate">
                      {session.user?.name || session.user?.email}
                    </span>
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      {session.user?.role}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                    className="flex w-full items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="ml-2">{t('auth.signOut')}</span>
                  </button>
                </div>
              </div>
            )} */}
          </>
        ) : (
          /* Collapsed Footer */
          <div className="flex flex-col items-center space-y-4">
            {/* Language buttons for collapsed state */}
            <div className="flex flex-col space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as 'en' | 'th' | 'zh')}
                  className={`p-2 rounded ${
                    language === lang.code
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                  title={lang.name}
                >
                  <span className="text-sm">{lang.flag}</span>
                </button>
              ))}
            </div>
            
            {/* Sign Out button for collapsed state - TEMPORARILY DISABLED */}
            {/* {session && (
              <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                className="p-2 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                title={t('auth.signOut')}
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
              </button>
            )} */}
          </div>
        )}
      </div>
    </div>
  )
}
