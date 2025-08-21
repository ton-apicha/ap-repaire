// Translation Helper for managing new translations
export interface TranslationKeys {
  [key: string]: string | TranslationKeys
}

// Helper function to add new translation keys
export function addTranslationKeys(
  existingTranslations: TranslationKeys,
  newKeys: TranslationKeys,
  language: 'en' | 'th' | 'zh'
): TranslationKeys {
  const result = { ...existingTranslations }
  
  function mergeKeys(target: TranslationKeys, source: TranslationKeys) {
    for (const [key, value] of Object.entries(source)) {
      if (typeof value === 'object' && value !== null) {
        if (!target[key] || typeof target[key] !== 'object') {
          target[key] = {}
        }
        mergeKeys(target[key] as TranslationKeys, value)
      } else {
        target[key] = value
      }
    }
  }
  
  mergeKeys(result, newKeys)
  return result
}

// Helper function to generate translation keys for a new page
export function generatePageTranslationKeys(pageKey: string, pageName: string): TranslationKeys {
  return {
    [pageKey]: {
      title: `${pageName}`,
      description: `Manage ${pageName.toLowerCase()}`,
      createButton: `Create ${pageName}`,
      createTitle: `Create New ${pageName}`,
      editTitle: `Edit ${pageName}`,
      deleteTitle: `Delete ${pageName}`,
      deleteConfirmation: `Are you sure you want to delete this ${pageName.toLowerCase()}?`,
      createSuccess: `${pageName} created successfully`,
      createError: `Failed to create ${pageName.toLowerCase()}`,
      updateSuccess: `${pageName} updated successfully`,
      updateError: `Failed to update ${pageName.toLowerCase()}`,
      deleteSuccess: `${pageName} deleted successfully`,
      deleteError: `Failed to delete ${pageName.toLowerCase()}`,
      noItems: `No ${pageName.toLowerCase()} found`,
      createFirst: `Create your first ${pageName.toLowerCase()}`,
      itemName: pageName.toLowerCase(),
      searchPlaceholder: `Search ${pageName.toLowerCase()}...`,
      // Common field translations
      fields: {
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        description: 'Description',
        status: 'Status',
        date: 'Date',
        amount: 'Amount',
        quantity: 'Quantity',
        price: 'Price',
        total: 'Total',
        notes: 'Notes',
        reference: 'Reference',
        category: 'Category',
        type: 'Type',
        priority: 'Priority',
        assignedTo: 'Assigned To',
        createdAt: 'Created At',
        updatedAt: 'Updated At'
      },
      // Common status options
      statuses: {
        active: 'Active',
        inactive: 'Inactive',
        pending: 'Pending',
        completed: 'Completed',
        cancelled: 'Cancelled',
        draft: 'Draft',
        published: 'Published',
        archived: 'Archived'
      },
      // Common actions
      actions: {
        view: 'View',
        edit: 'Edit',
        delete: 'Delete',
        duplicate: 'Duplicate',
        export: 'Export',
        import: 'Import',
        print: 'Print',
        download: 'Download',
        share: 'Share',
        approve: 'Approve',
        reject: 'Reject',
        activate: 'Activate',
        deactivate: 'Deactivate'
      }
    }
  }
}

// Helper function to generate Thai translations
export function generateThaiTranslations(pageKey: string, pageName: string): TranslationKeys {
  const thaiNames: { [key: string]: string } = {
    customers: 'ลูกค้า',
    workOrders: 'ใบงานซ่อม',
    invoices: 'ใบแจ้งหนี้',
    payments: 'การชำระเงิน',
    technicians: 'ช่างซ่อม',
    miners: 'รุ่นเครื่องขุด',
    suppliers: 'ซัพพลายเออร์',
    inventory: 'สินค้าคงคลัง',
    reports: 'รายงาน',
    settings: 'การตั้งค่า'
  }
  
  const thaiName = thaiNames[pageKey] || pageName
  
  return {
    [pageKey]: {
      title: thaiName,
      description: `จัดการ${thaiName}`,
      createButton: `สร้าง${thaiName}`,
      createTitle: `สร้าง${thaiName}ใหม่`,
      editTitle: `แก้ไข${thaiName}`,
      deleteTitle: `ลบ${thaiName}`,
      deleteConfirmation: `คุณแน่ใจหรือไม่ที่จะลบ${thaiName}นี้?`,
      createSuccess: `สร้าง${thaiName}สำเร็จ`,
      createError: `ไม่สามารถสร้าง${thaiName}ได้`,
      updateSuccess: `อัปเดต${thaiName}สำเร็จ`,
      updateError: `ไม่สามารถอัปเดต${thaiName}ได้`,
      deleteSuccess: `ลบ${thaiName}สำเร็จ`,
      deleteError: `ไม่สามารถลบ${thaiName}ได้`,
      noItems: `ไม่พบ${thaiName}`,
      createFirst: `สร้าง${thaiName}แรกของคุณ`,
      itemName: thaiName,
      searchPlaceholder: `ค้นหา${thaiName}...`,
      fields: {
        name: 'ชื่อ',
        email: 'อีเมล',
        phone: 'เบอร์โทรศัพท์',
        address: 'ที่อยู่',
        description: 'รายละเอียด',
        status: 'สถานะ',
        date: 'วันที่',
        amount: 'จำนวนเงิน',
        quantity: 'จำนวน',
        price: 'ราคา',
        total: 'รวม',
        notes: 'หมายเหตุ',
        reference: 'อ้างอิง',
        category: 'หมวดหมู่',
        type: 'ประเภท',
        priority: 'ความสำคัญ',
        assignedTo: 'มอบหมายให้',
        createdAt: 'สร้างเมื่อ',
        updatedAt: 'อัปเดตเมื่อ'
      },
      statuses: {
        active: 'ใช้งาน',
        inactive: 'ไม่ใช้งาน',
        pending: 'รอดำเนินการ',
        completed: 'เสร็จสิ้น',
        cancelled: 'ยกเลิก',
        draft: 'ร่าง',
        published: 'เผยแพร่',
        archived: 'เก็บถาวร'
      },
      actions: {
        view: 'ดู',
        edit: 'แก้ไข',
        delete: 'ลบ',
        duplicate: 'ทำซ้ำ',
        export: 'ส่งออก',
        import: 'นำเข้า',
        print: 'พิมพ์',
        download: 'ดาวน์โหลด',
        share: 'แชร์',
        approve: 'อนุมัติ',
        reject: 'ปฏิเสธ',
        activate: 'เปิดใช้งาน',
        deactivate: 'ปิดใช้งาน'
      }
    }
  }
}

// Helper function to generate Chinese translations
export function generateChineseTranslations(pageKey: string, pageName: string): TranslationKeys {
  const chineseNames: { [key: string]: string } = {
    customers: '客户',
    workOrders: '工作订单',
    invoices: '发票',
    payments: '付款',
    technicians: '技术人员',
    miners: '矿机型号',
    suppliers: '供应商',
    inventory: '库存',
    reports: '报告',
    settings: '设置'
  }
  
  const chineseName = chineseNames[pageKey] || pageName
  
  return {
    [pageKey]: {
      title: chineseName,
      description: `管理${chineseName}`,
      createButton: `创建${chineseName}`,
      createTitle: `创建新${chineseName}`,
      editTitle: `编辑${chineseName}`,
      deleteTitle: `删除${chineseName}`,
      deleteConfirmation: `您确定要删除这个${chineseName}吗？`,
      createSuccess: `${chineseName}创建成功`,
      createError: `创建${chineseName}失败`,
      updateSuccess: `${chineseName}更新成功`,
      updateError: `更新${chineseName}失败`,
      deleteSuccess: `${chineseName}删除成功`,
      deleteError: `删除${chineseName}失败`,
      noItems: `未找到${chineseName}`,
      createFirst: `创建您的第一个${chineseName}`,
      itemName: chineseName,
      searchPlaceholder: `搜索${chineseName}...`,
      fields: {
        name: '姓名',
        email: '邮箱',
        phone: '电话',
        address: '地址',
        description: '描述',
        status: '状态',
        date: '日期',
        amount: '金额',
        quantity: '数量',
        price: '价格',
        total: '总计',
        notes: '备注',
        reference: '参考',
        category: '类别',
        type: '类型',
        priority: '优先级',
        assignedTo: '分配给',
        createdAt: '创建时间',
        updatedAt: '更新时间'
      },
      statuses: {
        active: '活跃',
        inactive: '非活跃',
        pending: '待处理',
        completed: '已完成',
        cancelled: '已取消',
        draft: '草稿',
        published: '已发布',
        archived: '已归档'
      },
      actions: {
        view: '查看',
        edit: '编辑',
        delete: '删除',
        duplicate: '复制',
        export: '导出',
        import: '导入',
        print: '打印',
        download: '下载',
        share: '分享',
        approve: '批准',
        reject: '拒绝',
        activate: '激活',
        deactivate: '停用'
      }
    }
  }
}

// Helper function to validate translation keys
export function validateTranslationKeys(keys: TranslationKeys): string[] {
  const errors: string[] = []
  
  function validateKey(obj: TranslationKeys, path: string = '') {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key
      
      if (typeof value === 'object' && value !== null) {
        validateKey(value, currentPath)
      } else if (typeof value !== 'string') {
        errors.push(`Invalid value type at ${currentPath}: expected string, got ${typeof value}`)
      } else if (value.trim() === '') {
        errors.push(`Empty translation at ${currentPath}`)
      }
    }
  }
  
  validateKey(keys)
  return errors
}

// Helper function to merge translations for all languages
export function mergeAllLanguageTranslations(
  pageKey: string,
  pageName: string
): {
  en: TranslationKeys
  th: TranslationKeys
  zh: TranslationKeys
} {
  return {
    en: generatePageTranslationKeys(pageKey, pageName),
    th: generateThaiTranslations(pageKey, pageName),
    zh: generateChineseTranslations(pageKey, pageName)
  }
}

// Helper function to create a new page with translations
export function createNewPageWithTranslations(
  pageKey: string,
  pageName: string
): {
  translations: {
    en: TranslationKeys
    th: TranslationKeys
    zh: TranslationKeys
  }
  validationErrors: string[]
} {
  const translations = mergeAllLanguageTranslations(pageKey, pageName)
  
  const validationErrors = [
    ...validateTranslationKeys(translations.en),
    ...validateTranslationKeys(translations.th),
    ...validateTranslationKeys(translations.zh)
  ]
  
  return {
    translations,
    validationErrors
  }
}
