'use client'

import React, { useState, useEffect } from 'react'
import PageTemplate, { 
  FilterSection, 
  DataTable, 
  ActionButton, 
  ActionButtons, 
  SortableHeader, 
  SearchInput, 
  FilterSelect, 
  EmptyState, 
  LoadingSpinner, 
  ErrorState 
} from '@/components/ui/PageTemplate'
import { useLanguage } from '@/contexts/LanguageContext'
import toast from 'react-hot-toast'

// Generic interface for any data item
interface BaseItem {
  id: string
  [key: string]: any
}

// Props interface for the template
interface PageTemplateWithI18nProps<T extends BaseItem> {
  // Page configuration
  pageKey: string // e.g., 'customers', 'workOrders', 'invoices'
  titleKey: string // e.g., 'customers.title'
  descriptionKey: string // e.g., 'customers.description'
  
  // API configuration
  apiEndpoint: string
  createEndpoint?: string
  updateEndpoint?: string
  deleteEndpoint?: string
  
  // Table configuration
  columns: {
    key: string
    labelKey: string
    sortable?: boolean
    render?: (item: T) => React.ReactNode
  }[]
  
  // Form configuration (for create/edit)
  formFields?: {
    key: string
    labelKey: string
    type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'date'
    required?: boolean
    options?: { value: string; labelKey: string }[]
    validation?: (value: any) => string | null
  }[]
  
  // Actions
  showCreateButton?: boolean
  showEditButton?: boolean
  showDeleteButton?: boolean
  customActions?: (item: T) => React.ReactNode
  
  // Filters
  filters?: {
    key: string
    labelKey: string
    type: 'select' | 'text' | 'date'
    options?: { value: string; labelKey: string }[]
  }[]
  
  // Callbacks
  onItemClick?: (item: T) => void
  onBeforeCreate?: (data: any) => any
  onBeforeUpdate?: (id: string, data: any) => any
  onAfterCreate?: (item: T) => void
  onAfterUpdate?: (item: T) => void
  onAfterDelete?: (id: string) => void
  
  // Custom components
  customHeader?: React.ReactNode
  customFilters?: React.ReactNode
  customTable?: React.ReactNode
  customEmptyState?: React.ReactNode
}

export default function PageTemplateWithI18n<T extends BaseItem>({
  pageKey,
  titleKey,
  descriptionKey,
  apiEndpoint,
  createEndpoint,
  updateEndpoint,
  deleteEndpoint,
  columns,
  formFields = [],
  showCreateButton = true,
  showEditButton = true,
  showDeleteButton = true,
  customActions,
  filters = [],
  onItemClick,
  onBeforeCreate,
  onBeforeUpdate,
  onAfterCreate,
  onAfterUpdate,
  onAfterDelete,
  customHeader,
  customFilters,
  customTable,
  customEmptyState
}: PageTemplateWithI18nProps<T>) {
  const { t } = useLanguage()
  
  // State management
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [sortField, setSortField] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<T | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(apiEndpoint, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setItems(data.data || [])
        } else {
          setError(data.error || t('common.fetchError'))
        }
      } else {
        setError(t('common.fetchError'))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.unknownError'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Handle filtering
  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({})
    setSearchTerm('')
  }

  // Filter and sort data
  const filteredAndSortedItems = React.useMemo(() => {
    let filtered = [...items]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Apply filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(item => item[key] === value)
      }
    })

    // Apply sorting
    if (sortField) {
      filtered.sort((a, b) => {
        const aValue = a[sortField]
        const bValue = b[sortField]
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [items, searchTerm, activeFilters, sortField, sortDirection])

  // Handle create
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsSubmitting(true)
      
      const dataToSend = onBeforeCreate ? onBeforeCreate(formData) : formData
      
      const response = await fetch(createEndpoint || apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dataToSend)
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          toast.success(t(`${pageKey}.createSuccess`))
          setShowCreateModal(false)
          setFormData({})
          fetchData()
          onAfterCreate?.(result.data)
        } else {
          toast.error(result.error || t(`${pageKey}.createError`))
        }
      } else {
        toast.error(t(`${pageKey}.createError`))
      }
    } catch (err) {
      toast.error(t(`${pageKey}.createError`))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle edit
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedItem) return
    
    try {
      setIsSubmitting(true)
      
      const dataToSend = onBeforeUpdate ? onBeforeUpdate(selectedItem.id, formData) : formData
      
      const response = await fetch(updateEndpoint || `${apiEndpoint}/${selectedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dataToSend)
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          toast.success(t(`${pageKey}.updateSuccess`))
          setShowEditModal(false)
          setSelectedItem(null)
          setFormData({})
          fetchData()
          onAfterUpdate?.(result.data)
        } else {
          toast.error(result.error || t(`${pageKey}.updateError`))
        }
      } else {
        toast.error(t(`${pageKey}.updateError`))
      }
    } catch (err) {
      toast.error(t(`${pageKey}.updateError`))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!selectedItem) return
    
    try {
      setIsSubmitting(true)
      
      const response = await fetch(deleteEndpoint || `${apiEndpoint}/${selectedItem.id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          toast.success(t(`${pageKey}.deleteSuccess`))
          setShowDeleteModal(false)
          setSelectedItem(null)
          fetchData()
          onAfterDelete?.(selectedItem.id)
        } else {
          toast.error(result.error || t(`${pageKey}.deleteError`))
        }
      } else {
        toast.error(t(`${pageKey}.deleteError`))
      }
    } catch (err) {
      toast.error(t(`${pageKey}.deleteError`))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle form input changes
  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Open edit modal
  const openEditModal = (item: T) => {
    setSelectedItem(item)
    setFormData(item)
    setShowEditModal(true)
  }

  // Open delete modal
  const openDeleteModal = (item: T) => {
    setSelectedItem(item)
    setShowDeleteModal(true)
  }

  // Loading state
  if (loading) {
    return (
      <PageTemplate
        title={t(titleKey)}
        description={t(descriptionKey)}
        showCreateButton={false}
      >
        <LoadingSpinner />
      </PageTemplate>
    )
  }

  // Error state
  if (error) {
    return (
      <PageTemplate
        title={t(titleKey)}
        description={t(descriptionKey)}
        showCreateButton={false}
      >
        <ErrorState error={error} onRetry={fetchData} />
      </PageTemplate>
    )
  }

  return (
    <PageTemplate
      title={t(titleKey)}
      description={t(descriptionKey)}
      showCreateButton={showCreateButton}
      createButtonText={t(`${pageKey}.createButton`)}
      onCreateClick={() => setShowCreateModal(true)}
      itemCount={filteredAndSortedItems.length}
      itemName={t(`${pageKey}.itemName`)}
    >
      {customHeader}

      {/* Filters */}
      {(filters.length > 0 || !customFilters) && (
        <FilterSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={t(`${pageKey}.searchPlaceholder`)}
            />
            
            {filters.map(filter => (
              <FilterSelect
                key={filter.key}
                value={activeFilters[filter.key] || ''}
                onChange={(value) => handleFilterChange(filter.key, value)}
                options={filter.options?.map(option => ({
                  value: option.value,
                  label: t(option.labelKey)
                })) || []}
                placeholder={t(filter.labelKey)}
              />
            ))}
            
            <div className="flex items-center gap-2">
              <ActionButton onClick={clearFilters} variant="default">
                {t('common.clearFilters')}
              </ActionButton>
              <ActionButton onClick={fetchData} variant="default">
                {t('common.refresh')}
              </ActionButton>
            </div>
          </div>
        </FilterSection>
      )}

      {customFilters}

      {/* Table */}
      {customTable || (
        <DataTable>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map(column => (
                  column.sortable ? (
                    <SortableHeader
                      key={column.key}
                      field={column.key}
                      currentSort={sortField}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    >
                      {t(column.labelKey)}
                    </SortableHeader>
                  ) : (
                    <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t(column.labelKey)}
                    </th>
                  )
                ))}
                {(showEditButton || showDeleteButton || customActions) && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.actions')}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedItems.length === 0 ? (
                customEmptyState || (
                  <EmptyState
                    message={t(`${pageKey}.noItems`)}
                    actionText={t(`${pageKey}.createFirst`)}
                    onAction={() => setShowCreateModal(true)}
                  />
                )
              ) : (
                filteredAndSortedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {columns.map(column => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {column.render ? column.render(item) : item[column.key]}
                      </td>
                    ))}
                    {(showEditButton || showDeleteButton || customActions) && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <ActionButtons>
                          {customActions ? customActions(item) : (
                            <>
                              {showEditButton && (
                                <ActionButton onClick={() => openEditModal(item)}>
                                  {t('common.edit')}
                                </ActionButton>
                              )}
                              {showDeleteButton && (
                                <ActionButton onClick={() => openDeleteModal(item)} variant="danger">
                                  {t('common.delete')}
                                </ActionButton>
                              )}
                            </>
                          )}
                        </ActionButtons>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </DataTable>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{t(`${pageKey}.createTitle`)}</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleCreate} className="space-y-4">
                {formFields.map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700">
                      {t(field.labelKey)} {field.required && '*'}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        value={formData[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required={field.required}
                      >
                        <option value="">{t('common.select')}</option>
                        {field.options?.map(option => (
                          <option key={option.value} value={option.value}>
                            {t(option.labelKey)}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        value={formData[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required={field.required}
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
                
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSubmitting ? t('common.creating') : t('common.create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{t(`${pageKey}.editTitle`)}</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleEdit} className="space-y-4">
                {formFields.map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700">
                      {t(field.labelKey)} {field.required && '*'}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        value={formData[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required={field.required}
                      >
                        <option value="">{t('common.select')}</option>
                        {field.options?.map(option => (
                          <option key={option.value} value={option.value}>
                            {t(option.labelKey)}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        value={formData[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required={field.required}
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
                
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSubmitting ? t('common.updating') : t('common.update')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{t(`${pageKey}.deleteTitle`)}</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">
                  {t(`${pageKey}.deleteConfirmation`)}
                </p>
                
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {isSubmitting ? t('common.deleting') : t('common.delete')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTemplate>
  )
}
