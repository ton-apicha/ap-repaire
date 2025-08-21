'use client'

import React, { ReactNode } from 'react'
import Layout from '@/components/layout/Layout'
import { useLanguage } from '@/contexts/LanguageContext'

interface PageTemplateProps {
  title: string
  description?: string
  children: ReactNode
  showCreateButton?: boolean
  createButtonText?: string
  onCreateClick?: () => void
  itemCount?: number
  itemName?: string
}

export default function PageTemplate({
  title,
  description,
  children,
  showCreateButton = false,
  createButtonText,
  onCreateClick,
  itemCount,
  itemName = "items"
}: PageTemplateProps) {
  const { t } = useLanguage()
  return (
    <Layout>
      <div className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <p className="mt-2 text-gray-600">
                {description || `${t('common.manage')} ${itemName.toLowerCase()}`}
                {itemCount !== undefined && ` (${itemCount} ${itemName})`}
              </p>
            </div>
            {showCreateButton && (
              <button 
                onClick={onCreateClick}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {createButtonText || t('common.create')}
              </button>
            )}
          </div>

          {/* Content */}
          {children}
        </div>
      </div>
    </Layout>
  )
}

// Reusable components for consistent styling
export const FilterSection = ({ children }: { children: ReactNode }) => (
  <div className="bg-white shadow rounded-lg p-6">
    {children}
  </div>
)

export const DataTable = ({ children }: { children: ReactNode }) => (
  <div className="bg-white shadow rounded-lg overflow-hidden">
    <div className="overflow-x-auto">
      {children}
    </div>
  </div>
)

export const ActionButton = ({ 
  onClick, 
  children, 
  variant = "default" 
}: { 
  onClick: () => void
  children: ReactNode
  variant?: "default" | "primary" | "danger"
}) => {
  const baseClasses = "inline-flex items-center px-3 py-2 border shadow-sm text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variantClasses = {
    default: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500",
    primary: "border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    danger: "border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500"
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {children}
    </button>
  )
}

export const ActionButtons = ({ children }: { children: ReactNode }) => (
  <div className="flex items-center justify-end gap-2">
    {children}
  </div>
)

export const SortableHeader = ({ 
  field, 
  currentSort, 
  sortDirection, 
  onSort, 
  children 
}: { 
  field: string
  currentSort: string
  sortDirection: 'asc' | 'desc'
  onSort: (field: string) => void
  children: ReactNode
}) => {
  const isActive = currentSort === field
  
  return (
    <th 
      onClick={() => onSort(field)}
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
    >
      <div className="flex items-center gap-1">
        {children}
        <SortIcon field={field} isActive={isActive} direction={sortDirection} />
      </div>
    </th>
  )
}

const SortIcon = ({ 
  field, 
  isActive, 
  direction 
}: { 
  field: string
  isActive: boolean
  direction: 'asc' | 'desc'
}) => {
  if (!isActive) {
    return (
      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    )
  }
  
  return direction === 'asc' ? (
    <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  ) : (
    <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

export const SearchInput = ({ 
  value, 
  onChange, 
  placeholder 
}: { 
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) => {
  const { t } = useLanguage()
  
  return (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <input
      type="text"
      placeholder={placeholder || t('common.search')}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    />
  </div>
  )
}

export const FilterSelect = ({ 
  value, 
  onChange, 
  options, 
  placeholder 
}: { 
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
}) => {
  const { t } = useLanguage()
  
  return (
  <select 
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
  >
    <option value="">{placeholder || t('common.select')}</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
  )
}

export const EmptyState = ({ 
  message, 
  actionText, 
  onAction 
}: { 
  message: string
  actionText?: string
  onAction?: () => void
}) => (
  <tr>
    <td colSpan={100} className="px-6 py-4 whitespace-nowrap text-center py-8">
      <div className="flex flex-col items-center gap-2">
        <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-gray-500">{message}</p>
        {actionText && onAction && (
          <ActionButton onClick={onAction} variant="primary">
            {actionText}
          </ActionButton>
        )}
      </div>
    </td>
  </tr>
)

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
)

export const ErrorState = ({ 
  error, 
  onRetry 
}: { 
  error: string
  onRetry?: () => void
}) => {
  const { t } = useLanguage()
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-red-500 text-lg mb-2">Error: {error}</div>
        {onRetry && (
          <ActionButton onClick={onRetry} variant="primary">
            {t('common.tryAgain')}
          </ActionButton>
        )}
      </div>
    </div>
  )
}

