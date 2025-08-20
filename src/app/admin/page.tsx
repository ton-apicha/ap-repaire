'use client'

import React from 'react'
import Layout from '@/components/layout/Layout'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  UsersIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline'

const adminFeatures = [
  {
    name: 'userManagement',
    title: 'admin.userManagement',
    description: 'admin.userManagement',
    icon: UsersIcon,
    href: '/admin/users',
    color: 'bg-blue-500',
  },
  {
    name: 'systemSettings',
    title: 'admin.systemSettings',
    description: 'admin.systemSettings',
    icon: Cog6ToothIcon,
    href: '/admin/settings',
    color: 'bg-green-500',
  },
  {
    name: 'reports',
    title: 'admin.reports',
    description: 'admin.reports',
    icon: ChartBarIcon,
    href: '/admin/reports',
    color: 'bg-purple-500',
  },
  {
    name: 'backup',
    title: 'admin.backup',
    description: 'admin.backup',
    icon: ArchiveBoxIcon,
    href: '/admin/backup',
    color: 'bg-yellow-500',
  },
  {
    name: 'logs',
    title: 'admin.logs',
    description: 'admin.logs',
    icon: DocumentTextIcon,
    href: '/admin/logs',
    color: 'bg-red-500',
  },
  {
    name: 'permissions',
    title: 'admin.permissions',
    description: 'admin.permissions',
    icon: ShieldCheckIcon,
    href: '/admin/permissions',
    color: 'bg-indigo-500',
  },
]

export default function Admin() {
  const { t } = useLanguage()

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('admin.title')}</h1>
          <p className="mt-2 text-gray-600">ระบบจัดการหลังบ้านสำหรับผู้ดูแลระบบ</p>
        </div>

        {/* Admin Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminFeatures.map((feature) => (
            <div
              key={feature.name}
              className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${feature.color}`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {t(feature.title)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {t(feature.description)}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    เข้าสู่ระบบ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* System Status */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">สถานะระบบ</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">ฐานข้อมูล</p>
                  <p className="text-sm text-green-600">ออนไลน์</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">เซิร์ฟเวอร์</p>
                  <p className="text-sm text-green-600">ออนไลน์</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">การสำรองข้อมูล</p>
                  <p className="text-sm text-green-600">ล่าสุด 2 ชม.ที่แล้ว</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">ความปลอดภัย</p>
                  <p className="text-sm text-green-600">ปกติ</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">การดำเนินการด่วน</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <ArchiveBoxIcon className="h-4 w-4 mr-2" />
              สำรองข้อมูล
            </button>
            <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <ChartBarIcon className="h-4 w-4 mr-2" />
              สร้างรายงาน
            </button>
            <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              <Cog6ToothIcon className="h-4 w-4 mr-2" />
              ตั้งค่าระบบ
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
