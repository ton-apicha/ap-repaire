'use client'

import React from 'react'
import PageTemplateWithI18n from '@/components/templates/PageTemplateWithI18n'

// Define the data interface
interface Suppliers {
  id: string
  name: string
  createdAt?: string
  updatedAt?: string
}

export default function SuppliersPage() {
  return (
    <PageTemplateWithI18n<Suppliers>
      pageKey="suppliers"
      titleKey="suppliers.title"
      descriptionKey="suppliers.description"
      apiEndpoint="/api/suppliers"
      columns={[
        {
          key: 'name',
          labelKey: 'suppliers.fields.name',
          sortable: true
        },
        {
          key: 'createdAt',
          labelKey: 'suppliers.fields.createdAt',
          sortable: true
        }
      ]}
      formFields={[
        {
          key: 'name',
          labelKey: 'suppliers.fields.name',
          type: 'text',
          required: true
        }
      ]}
      filters={[
        
      ]}
      showCreateButton={true}
      showEditButton={true}
      showDeleteButton={true}
    />
  )
}
