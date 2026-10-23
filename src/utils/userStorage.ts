import { User, Customer } from '../types';

export function getUserStorageKeys(userId: string) {
  return {
    customersKey: `udhaardesk_customers_${userId}`,
    shopKey: `udhaardesk_shop_${userId}`,
  };
}

export function validateSignupData(data: {
  name: string;
  email: string;
  shopName: string;
  password?: string;
}): { valid: boolean; error?: string } {
  if (!data.name || data.name.trim().length < 2) {
    return { valid: false, error: 'Kripya apna poora naam darj karein (kam se kam 2 akshar).' };
  }
  const email = data.email?.trim() || '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, error: 'Kripya sahi email address darj karein.' };
  }
  if (!data.shopName || data.shopName.trim().length < 2) {
    return { valid: false, error: 'Dukaan ka naam likhna zaroori hai.' };
  }
  if (data.password !== undefined && data.password.trim().length < 6) {
    return { valid: false, error: 'Supabase ke liye PIN / password kam se kam 6 akshar/ank ka hona chahiye.' };
  }
  return { valid: true };
}

export function authenticateUser(
  users: User[],
  phone: string,
  password?: string
): { success: boolean; user?: User; error?: string } {
  const cleanPhone = phone.replace(/\D/g, '');
  const user = users.find((u) => u.phone.replace(/\D/g, '') === cleanPhone);

  if (!user) {
    return { success: false, error: 'Yeh mobile number registered nahi hai. Kripya naya khata (Sign Up) banayein.' };
  }

  if (user.password && password && user.password !== password.trim()) {
    return { success: false, error: 'Galat Password / PIN darj kiya gaya hai.' };
  }

  return { success: true, user };
}

// Cleans legacy demo accounts if present
export function filterOutDemoUsers(users: User[]): User[] {
  return users.filter((u) => u.id !== 'user_gupta_1' && u.id !== 'user_verma_2');
}
