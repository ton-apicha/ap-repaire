'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { en } from '@/locales/en'
import { th } from '@/locales/th'
import { zh } from '@/locales/zh'

type Language = 'en' | 'th' | 'zh'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en,
  th,
  zh,
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en') // เปลี่ยนเริ่มต้นเป็นภาษาอังกฤษ
  const [isClient, setIsClient] = useState(false)

  // ตรวจสอบว่าเรียกใช้ในฝั่ง client หรือไม่
  useEffect(() => {
    setIsClient(true)
    // โหลดภาษาที่บันทึกไว้จาก localStorage
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && ['en', 'th', 'zh'].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  // บันทึกภาษาเมื่อมีการเปลี่ยนแปลง
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    if (isClient) {
      localStorage.setItem('language', lang)
    }
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: unknown = translations[language]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        // Fallback: ลองหาในภาษาอังกฤษก่อน ถ้าไม่มีให้ return key
        let fallbackValue: unknown = translations['en']
        for (const fallbackK of keys) {
          if (fallbackValue && typeof fallbackValue === 'object' && fallbackK in fallbackValue) {
            fallbackValue = (fallbackValue as Record<string, unknown>)[fallbackK]
          } else {
            return key // ถ้าไม่มีในภาษาอังกฤษด้วยให้ return key เดิม
          }
        }
        return typeof fallbackValue === 'string' ? fallbackValue : key
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
