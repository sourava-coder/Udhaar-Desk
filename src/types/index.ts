export type TransactionType = 'UDHAAR' | 'JAMA';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  items: string;
  date: string; // ISO date string YYYY-MM-DD
  createdAt?: number; // timestamp
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  notes?: string;
  transactions: Transaction[];
  createdAt: string;
}

export interface ShopInfo {
  name: string;
  upiId: string;
  phone: string;
  address?: string;
}

export type ScreenId = 'home' | 'add' | 'reminders' | 'customer' | 'reports';

export interface CustomerStats {
  balance: number;
  oldestPendingDays: number;
  isOverdue: boolean; // >= 30 days pending with positive balance
  lastTransactionDate: string | null;
  totalUdhaar: number;
  totalJama: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  shopName: string;
  password?: string;
  upiId?: string;
  address?: string;
  createdAt: string;
}
