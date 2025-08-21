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
