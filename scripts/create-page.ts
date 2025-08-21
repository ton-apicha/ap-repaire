#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { createNewPageWithTranslations, addTranslationKeys } from '../src/utils/translationHelper'

interface CreatePageOptions {
  pageKey: string
  pageName: string
  apiEndpoint: string
  columns: Array<{
    key: string
    labelKey: string
    sortable?: boolean
  }>
  formFields?: Array<{
    key: string
    labelKey: string
    type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'date'
    required?: boolean
    options?: Array<{ value: string; labelKey: string }>
  }>
  filters?: Array<{
    key: string
    labelKey: string
    type: 'select' | 'text' | 'date'
    options?: Array<{ value: string; labelKey: string }>
  }>
}

function createPageFile(options: CreatePageOptions): string {
  const { pageKey, pageName, apiEndpoint, columns, formFields = [], filters = [] } = options
  
  // Helper function to determine field type
  function getTypeFromKey(key: string): string {
    if (key.includes('date') || key.includes('Date')) return 'string'
    if (key.includes('amount') || key.includes('price') || key.includes('quantity')) return 'number'
    if (key.includes('email')) return 'string'
    if (key.includes('phone')) return 'string'
    return 'string'
  }
  
  return `'use client'

import React from 'react'
import PageTemplateWithI18n from '@/components/templates/PageTemplateWithI18n'

// Define the data interface
interface ${pageName} {
  id: string
  ${columns.map(col => `${col.key}: ${getTypeFromKey(col.key)}`).join('\n  ')}
  createdAt?: string
  updatedAt?: string
}

export default function ${pageName}Page() {
  return (
    <PageTemplateWithI18n<${pageName}>
      pageKey="${pageKey}"
      titleKey="${pageKey}.title"
      descriptionKey="${pageKey}.description"
      apiEndpoint="${apiEndpoint}"
      columns={[
        ${columns.map(col => `{
          key: '${col.key}',
          labelKey: '${col.labelKey}',
          sortable: ${col.sortable || false}
        }`).join(',\n        ')}
      ]}
      formFields={[
        ${formFields.map(field => `{
          key: '${field.key}',
          labelKey: '${field.labelKey}',
          type: '${field.type}',
          required: ${field.required || false}${field.options ? `,
          options: [
            ${field.options.map(opt => `{
              value: '${opt.value}',
              labelKey: '${opt.labelKey}'
            }`).join(',\n            ')}
          ]` : ''}
        }`).join(',\n        ')}
      ]}
      filters={[
        ${filters.map(filter => `{
          key: '${filter.key}',
          labelKey: '${filter.labelKey}',
          type: '${filter.type}'${filter.options ? `,
          options: [
            ${filter.options.map(opt => `{
              value: '${opt.value}',
              labelKey: '${opt.labelKey}'
            }`).join(',\n            ')}
          ]` : ''}
        }`).join(',\n        ')}
      ]}
      showCreateButton={true}
      showEditButton={true}
      showDeleteButton={true}
    />
  )
}
`
}

function updateTranslationFiles(translations: any) {
  const localesDir = path.join(process.cwd(), 'src', 'locales')
  
  // Update English translations
  const enPath = path.join(localesDir, 'en.ts')
  const enContent = fs.readFileSync(enPath, 'utf-8')
  const enMatch = enContent.match(/export const en = ({[\s\S]*})/)
  if (enMatch) {
    const enObj = eval(`(${enMatch[1]})`)
    const updatedEn = addTranslationKeys(enObj, translations.en, 'en')
    const newEnContent = enContent.replace(
      /export const en = {[\s\S]*}/,
      `export const en = ${JSON.stringify(updatedEn, null, 2).replace(/"([^"]+)":/g, '$1:')}`
    )
    fs.writeFileSync(enPath, newEnContent)
  }
  
  // Update Thai translations
  const thPath = path.join(localesDir, 'th.ts')
  const thContent = fs.readFileSync(thPath, 'utf-8')
  const thMatch = thContent.match(/export const th = ({[\s\S]*})/)
  if (thMatch) {
    const thObj = eval(`(${thMatch[1]})`)
    const updatedTh = addTranslationKeys(thObj, translations.th, 'th')
    const newThContent = thContent.replace(
      /export const th = {[\s\S]*}/,
      `export const th = ${JSON.stringify(updatedTh, null, 2).replace(/"([^"]+)":/g, '$1:')}`
    )
    fs.writeFileSync(thPath, newThContent)
  }
  
  // Update Chinese translations
  const zhPath = path.join(localesDir, 'zh.ts')
  const zhContent = fs.readFileSync(zhPath, 'utf-8')
  const zhMatch = zhContent.match(/export const zh = ({[\s\S]*})/)
  if (zhMatch) {
    const zhObj = eval(`(${zhMatch[1]})`)
    const updatedZh = addTranslationKeys(zhObj, translations.zh, 'zh')
    const newZhContent = zhContent.replace(
      /export const zh = {[\s\S]*}/,
      `export const zh = ${JSON.stringify(updatedZh, null, 2).replace(/"([^"]+)":/g, '$1:')}`
    )
    fs.writeFileSync(zhPath, newZhContent)
  }
}

function createAPIRoute(pageKey: string, pageName: string): string {
  return `import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for ${pageName}
const ${pageName}Schema = z.object({
  // Add your validation fields here
  name: z.string().min(1, 'Name is required'),
  // Add more fields as needed
})

// GET - Fetch all ${pageName}s
export async function GET() {
  try {
    const ${pageKey} = await prisma.${pageKey}.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({
      success: true,
      data: ${pageKey}
    })
  } catch (error) {
    console.error('Error fetching ${pageKey}:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ${pageKey}' },
      { status: 500 }
    )
  }
}

// POST - Create new ${pageName}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = ${pageName}Schema.parse(body)
    
    const ${pageKey} = await prisma.${pageKey}.create({
      data: validatedData
    })
    
    return NextResponse.json({
      success: true,
      data: ${pageKey}
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating ${pageKey}:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create ${pageKey}' },
      { status: 500 }
    )
  }
}

// PUT - Update ${pageName}
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      )
    }
    
    const body = await request.json()
    const validatedData = ${pageName}Schema.parse(body)
    
    const ${pageKey} = await prisma.${pageKey}.update({
      where: { id },
      data: validatedData
    })
    
    return NextResponse.json({
      success: true,
      data: ${pageKey}
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error updating ${pageKey}:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update ${pageKey}' },
      { status: 500 }
    )
  }
}

// DELETE - Delete ${pageName}
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      )
    }
    
    await prisma.${pageKey}.delete({
      where: { id }
    })
    
    return NextResponse.json({
      success: true,
      message: '${pageName} deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting ${pageKey}:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete ${pageKey}' },
      { status: 500 }
    )
  }
}
`
}

function main() {
  const args = process.argv.slice(2)
  
  if (args.length < 3) {
    console.log('Usage: npm run create-page <pageKey> <pageName> <apiEndpoint>')
    console.log('Example: npm run create-page suppliers Suppliers /api/suppliers')
    process.exit(1)
  }
  
  const [pageKey, pageName, apiEndpoint] = args
  
  console.log(`Creating new page: ${pageName} (${pageKey})`)
  
  // Generate translations
  const { translations, validationErrors } = createNewPageWithTranslations(pageKey, pageName)
  
  if (validationErrors.length > 0) {
    console.error('Translation validation errors:')
    validationErrors.forEach(error => console.error(`  - ${error}`))
    process.exit(1)
  }
  
  // Create page file
  const pageDir = path.join(process.cwd(), 'src', 'app', pageKey)
  const pageFile = path.join(pageDir, 'page.tsx')
  
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true })
  }
  
  const pageContent = createPageFile({
    pageKey,
    pageName,
    apiEndpoint,
    columns: [
      { key: 'name', labelKey: `${pageKey}.fields.name`, sortable: true },
      { key: 'createdAt', labelKey: `${pageKey}.fields.createdAt`, sortable: true }
    ],
    formFields: [
      { key: 'name', labelKey: `${pageKey}.fields.name`, type: 'text', required: true }
    ]
  })
  
  fs.writeFileSync(pageFile, pageContent)
  console.log(`✅ Created page file: ${pageFile}`)
  
  // Create API route
  const apiDir = path.join(process.cwd(), 'src', 'app', 'api', pageKey)
  const apiFile = path.join(apiDir, 'route.ts')
  
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true })
  }
  
  const apiContent = createAPIRoute(pageKey, pageName)
  fs.writeFileSync(apiFile, apiContent)
  console.log(`✅ Created API route: ${apiFile}`)
  
  // Update translation files
  updateTranslationFiles(translations)
  console.log('✅ Updated translation files')
  
  console.log('\n🎉 Page created successfully!')
  console.log(`📁 Page: src/app/${pageKey}/page.tsx`)
  console.log(`🔗 API: src/app/api/${pageKey}/route.ts`)
  console.log(`🌐 Translations: Added to all language files`)
  console.log(`\nNext steps:`)
  console.log(`1. Add the page to your navigation menu`)
  console.log(`2. Update the Prisma schema if needed`)
  console.log(`3. Customize the columns and form fields`)
  console.log(`4. Test the page functionality`)
}

if (require.main === module) {
  main()
}
