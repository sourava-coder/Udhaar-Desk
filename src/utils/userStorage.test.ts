import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getUserStorageKeys,
  validateSignupData,
  authenticateUser,
  filterOutDemoUsers,
} from './userStorage';
import { User } from '../types';

test('validateSignupData enforces required fields and valid email', () => {
  const invalidName = validateSignupData({
    name: 'A',
    email: 'ramesh@example.com',
    shopName: 'Test Shop',
    password: '123456',
  });
  assert.equal(invalidName.valid, false);

  const invalidEmail = validateSignupData({
    name: 'Ramesh',
    email: 'not-an-email',
    shopName: 'Test Shop',
    password: '123',
  });
  assert.equal(invalidEmail.valid, false);

  const invalidPassword = validateSignupData({
    name: 'Ramesh Kumar',
    email: 'ramesh@example.com',
    shopName: 'Ramesh Store',
    password: '1234',
  });
  assert.equal(invalidPassword.valid, false);

  const valid = validateSignupData({
    name: 'Ramesh Kumar',
    email: 'ramesh@example.com',
    shopName: 'Ramesh Store',
    password: '123456',
  });
  assert.equal(valid.valid, true);
});

test('getUserStorageKeys generates isolated keys per user ID', () => {
  const keys1 = getUserStorageKeys('user_1');
  const keys2 = getUserStorageKeys('user_2');

  assert.equal(keys1.customersKey, 'udhaardesk_customers_user_1');
  assert.equal(keys2.customersKey, 'udhaardesk_customers_user_2');
  assert.notEqual(keys1.customersKey, keys2.customersKey);
  assert.notEqual(keys1.shopKey, keys2.shopKey);
});

test('authenticateUser verifies phone and password against user list', () => {
  const users: User[] = [
    {
      id: 'real_user_1',
      name: 'Sourav Swain',
      email: '',
      phone: '9876543210',
      shopName: 'Sourav Kirana Store',
      password: '1234',
      createdAt: '2026-10-22',
    },
  ];

  // Successful auth
  const resSuccess = authenticateUser(users, '9876543210', '1234');
  assert.equal(resSuccess.success, true);
  assert.equal(resSuccess.user?.shopName, 'Sourav Kirana Store');

  // Wrong password
  const resWrongPass = authenticateUser(users, '9876543210', '9999');
  assert.equal(resWrongPass.success, false);
  assert.match(resWrongPass.error || '', /Galat Password/i);

  // Unregistered phone
  const resUnregistered = authenticateUser(users, '9999999999', '1234');
  assert.equal(resUnregistered.success, false);
  assert.match(resUnregistered.error || '', /registered nahi hai/i);
});

test('filterOutDemoUsers strips legacy demo accounts', () => {
  const mixed: User[] = [
    { id: 'user_gupta_1', name: 'Demo Gupta', email: '', phone: '111', shopName: 'Shop', createdAt: '' },
    { id: 'user_verma_2', name: 'Demo Verma', email: '', phone: '222', shopName: 'Shop', createdAt: '' },
    { id: 'real_user_abc', name: 'Real User', email: '', phone: '999', shopName: 'Real Shop', createdAt: '' },
  ];
  const cleaned = filterOutDemoUsers(mixed);
  assert.equal(cleaned.length, 1);
  assert.equal(cleaned[0].id, 'real_user_abc');
});
