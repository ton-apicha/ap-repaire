export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'USER';
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  company?: string;
  taxId?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface Technician {
  id: string;
  name: string;
  email?: string;
  phone: string;
  speciality?: string;
  hourlyRate?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface MinerModel {
  id: string;
  brand: string;
  model: string;
  series?: string;
  hashRate?: string;
  power?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customer: Customer;
  technicianId?: string;
  technician?: Technician;
  minerModelId?: string;
  minerModel?: MinerModel;
  serialNumber?: string;
  issue: string;
  diagnosis?: string;
  solution?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'WAITING_PARTS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  estimatedCost?: number;
  actualCost?: number;
  startDate?: Date;
  completedDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  invoices?: Invoice[];
}

// Invoice System Types
export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customer: Customer;
  workOrderId?: string;
  workOrder?: WorkOrder;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED' | 'PARTIAL';
  issueDate: Date;
  dueDate: Date;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  notes?: string;
  terms?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUser: User;
  items: InvoiceItem[];
  payments: Payment[];
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  type: 'SERVICE' | 'PARTS' | 'LABOR' | 'OTHER';
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CHECK' | 'DIGITAL_WALLET' | 'OTHER';
  reference?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInvoiceData {
  customerId: string;
  workOrderId?: string;
  issueDate: Date;
  dueDate: Date;
  items: CreateInvoiceItemData[];
  notes?: string;
  terms?: string;
  taxRate?: number;
  discountAmount?: number;
}

export interface CreateInvoiceItemData {
  description: string;
  quantity: number;
  unitPrice: number;
  type: 'SERVICE' | 'PARTS' | 'LABOR' | 'OTHER';
}

export interface CreatePaymentData {
  invoiceId: string;
  amount: number;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CHECK' | 'DIGITAL_WALLET' | 'OTHER';
  paymentDate?: Date;
  reference?: string;
  notes?: string;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

// NextAuth type declarations
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'USER';
    }
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'USER';
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'USER';
  }
}
