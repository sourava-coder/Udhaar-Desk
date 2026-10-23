import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCustomerBalance,
  calculateOldestPendingDays,
  calculateWeeklyRecovered,
  calculateTotalDue,
  formatCurrency,
  generateUpiUrl,
  generateWhatsAppReminderMessage,
} from './khataCalculations';
import { Customer, Transaction, ShopInfo } from '../types';

test('calculateCustomerBalance sums Udhaar and subtracts Jama', () => {
  const transactions: Transaction[] = [
    { id: '1', type: 'UDHAAR', amount: 1000, items: 'Ration', date: '2026-09-01' },
    { id: '2', type: 'UDHAAR', amount: 500, items: 'Oil', date: '2026-09-10' },
    { id: '3', type: 'JAMA', amount: 700, items: 'Cash', date: '2026-09-15' },
  ];
  assert.equal(calculateCustomerBalance(transactions), 800);
});

test('calculateCustomerBalance returns 0 for zero or fully paid balance', () => {
  const transactions: Transaction[] = [
    { id: '1', type: 'UDHAAR', amount: 500, items: 'Sugar', date: '2026-09-01' },
    { id: '2', type: 'JAMA', amount: 500, items: 'Cash', date: '2026-09-05' },
  ];
  assert.equal(calculateCustomerBalance(transactions), 0);
  assert.equal(calculateOldestPendingDays(transactions), 0);
});

test('calculateOldestPendingDays accurately calculates days from oldest unpaid udhaar', () => {
  const asOf = new Date('2026-10-22');
  const transactions: Transaction[] = [
    // Paid off by the 600 Jama:
    { id: '1', type: 'UDHAAR', amount: 500, items: 'Flour', date: '2026-08-01' },
    // Partially covered (100 covered, 400 remaining unpaid, date 2026-09-10):
    { id: '2', type: 'UDHAAR', amount: 500, items: 'Spices', date: '2026-09-10' },
    { id: '3', type: 'JAMA', amount: 600, items: 'Payment', date: '2026-09-15' },
  ];

  // Oldest unpaid is 2026-09-10. Days from 2026-09-10 to 2026-10-22 is 42 days.
  const days = calculateOldestPendingDays(transactions, asOf);
  assert.equal(days, 42);
  assert.equal(days >= 30, true);
});

test('calculateWeeklyRecovered sums Jama within the 7-day window', () => {
  const asOf = new Date('2026-10-22');
  const mockCustomers: Customer[] = [
    {
      id: 'c1',
      name: 'Ramesh',
      phone: '9876543210',
      createdAt: '2026-09-01',
      transactions: [
        { id: 't1', type: 'JAMA', amount: 1500, items: 'Cash', date: '2026-10-20' }, // in 7-day window
        { id: 't2', type: 'JAMA', amount: 500, items: 'Cash', date: '2026-10-01' }, // older than 7 days
      ],
    },
    {
      id: 'c2',
      name: 'Sunita',
      phone: '9876543211',
      createdAt: '2026-09-01',
      transactions: [
        { id: 't3', type: 'JAMA', amount: 800, items: 'UPI', date: '2026-10-18' }, // in 7-day window
      ],
    },
  ];

  const weeklyRecovered = calculateWeeklyRecovered(mockCustomers, asOf, 7);
  assert.equal(weeklyRecovered, 2300); // 1500 + 800
});

test('calculateTotalDue sums positive balances across all customers', () => {
  const mockCustomers: Customer[] = [
    {
      id: 'c1',
      name: 'Ramesh',
      phone: '9876543210',
      createdAt: '2026-09-01',
      transactions: [{ id: 't1', type: 'UDHAAR', amount: 1200, items: 'Rice', date: '2026-10-01' }],
    },
    {
      id: 'c2',
      name: 'Sunita',
      phone: '9876543211',
      createdAt: '2026-09-01',
      transactions: [
        { id: 't2', type: 'UDHAAR', amount: 800, items: 'Oil', date: '2026-10-01' },
        { id: 't3', type: 'JAMA', amount: 800, items: 'Cash', date: '2026-10-05' },
      ],
    },
  ];

  assert.equal(calculateTotalDue(mockCustomers), 1200);
});

test('formatCurrency formats Indian Rupee values with symbol', () => {
  assert.equal(formatCurrency(1250), '₹1,250');
  assert.equal(formatCurrency(0), '₹0');
  assert.equal(formatCurrency(100000), '₹1,00,000');
});

test('generateUpiUrl creates valid UPI deep link', () => {
  const url = generateUpiUrl({
    upiId: 'shreekirana@okhdfcbank',
    merchantName: 'Shree Kirana',
    amount: 750,
    note: 'Bill Payment',
  });
  assert.ok(url.startsWith('upi://pay?'));
  assert.ok(url.includes('pa=shreekirana%40okhdfcbank'));
  assert.ok(url.includes('am=750.00'));
});

test('generateWhatsAppReminderMessage includes amount, days and upi link', () => {
  const shop: ShopInfo = {
    name: 'Gupta Kirana Store',
    upiId: 'guptakirana@upi',
    phone: '9876500000',
  };
  const customer: Customer = {
    id: 'c1',
    name: 'Ramesh Tailor',
    phone: '9876543210',
    createdAt: '2026-09-01',
    transactions: [],
  };

  const msg = generateWhatsAppReminderMessage(customer, 2450, 36, shop);
  assert.ok(msg.includes('Ramesh Tailor'));
  assert.ok(msg.includes('₹2,450'));
  assert.ok(msg.includes('36 days'));
  assert.ok(msg.includes('guptakirana@upi'));
  assert.ok(msg.includes('upi://pay?'));
});
