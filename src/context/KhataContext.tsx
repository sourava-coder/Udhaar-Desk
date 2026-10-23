import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer, ShopInfo, ScreenId, TransactionType, Transaction, User } from '../types';
import {
  calculateCustomerBalance,
  calculateOldestPendingDays,
  calculateTotalDue,
  calculateWeeklyRecovered,
  getWhatsAppWebUrl,
  generateWhatsAppBillMessage,
  generateWhatsAppReminderMessage,
} from '../utils/khataCalculations';
import { validateSignupData } from '../utils/userStorage';
import { sounds } from '../utils/soundEffects';
import { AppLanguage, Translations, translations } from '../utils/translations';
import { isSupabaseConfigured, supabase } from '../utils/supabase';

interface KhataContextType {
  // Language Support (Hindi, English, Odia)
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: Translations;

  // User Authentication & Management
  users: User[];
  currentUser: User | null;
  isAuthLoading: boolean;
  isCloudReady: boolean;
  cloudError: string | null;
  isCloudConfigured: boolean;
  isUserModalOpen: boolean;
  setIsUserModalOpen: (open: boolean) => void;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: {
    name: string;
    email: string;
    shopName: string;
    password?: string;
    upiId?: string;
    address?: string;
  }) => Promise<{ success: boolean; error?: string; message?: string; user?: User }>;
  logout: () => Promise<void>;
  deleteAccount: (userId: string) => Promise<void>;

  // Khata Data (Scoped to active real user)
  customers: Customer[];
  shopInfo: ShopInfo;
  currentScreen: ScreenId;
  selectedCustomerId: string | null;
  searchQuery: string;
  filterStatus: 'all' | 'overdue' | 'active' | 'cleared';
  isUpiModalOpen: boolean;
  isQrModalOpen: boolean;
  qrModalCustomer: Customer | null;
  toastMessage: string | null;

  // Actions
  setCurrentScreen: (screen: ScreenId) => void;
  setSelectedCustomerId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: 'all' | 'overdue' | 'active' | 'cleared') => void;
  setIsUpiModalOpen: (open: boolean) => void;
  setIsQrModalOpen: (open: boolean) => void;
  setQrModalCustomer: (customer: Customer | null) => void;
  updateShopInfo: (info: ShopInfo) => void;
  addCustomer: (name: string, phone: string, address?: string) => Customer;
  addTransaction: (params: {
    customerId: string;
    type: TransactionType;
    amount: number;
    items: string;
    date: string;
    sendWhatsApp?: boolean;
  }) => { transaction: Transaction; customer: Customer; waUrl?: string };
  quickRecordJama: (customerId: string, amount: number) => void;
  deleteTransaction: (customerId: string, transactionId: string) => void;
  deleteCustomer: (customerId: string) => void;
  showToast: (msg: string) => void;
  openWhatsAppReminder: (customerId: string) => void;
  openUpiQrForCustomer: (customerId: string) => void;
  resetToDefaultData: () => void;

  // Computed summary
  totalDue: number;
  weeklyRecovered: number;
  overdueCount: number;
  totalCustomersCount: number;
}

const KhataContext = createContext<KhataContextType | undefined>(undefined);

export const KhataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Language Support (Hindi, English, Odia)
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem('udhaardesk_lang');
      if (saved === 'en' || saved === 'hi' || saved === 'or') return saved;
    } catch {
      // fallback
    }
    return 'en';
  });

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('udhaardesk_lang', lang);
    } catch {
      // ignore
    }
  };

  const t = translations[language] || translations.hi;

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(isSupabaseConfigured);
  const [readyUserId, setReadyUserId] = useState<string | null>(null);
  const [cloudError, setCloudError] = useState<string | null>(null);
  const currentUserId = currentUser?.id;
  const users = currentUser ? [currentUser] : [];

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [shopInfo, setShopInfo] = useState<ShopInfo>({
    name: 'Meri Dukaan',
    upiId: 'dukaan@upi',
    phone: '',
    address: '',
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'overdue' | 'active' | 'cleared'>('all');
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrModalCustomer, setQrModalCustomer] = useState<Customer | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const toUser = (authUser: {
    id: string;
    email?: string;
    phone?: string;
    created_at?: string;
    user_metadata?: Record<string, unknown>;
  }): User => {
    const metadata = authUser.user_metadata || {};
    const phoneNumber = (authUser.phone || '').replace(/^\+91/, '').replace(/\D/g, '');
    return {
      id: authUser.id,
      name: String(metadata.name || ''),
      email: authUser.email || '',
      phone: String(metadata.shop_phone || phoneNumber),
      shopName: String(metadata.shop_name || ''),
      upiId: String(metadata.upi_id || ''),
      address: String(metadata.address || ''),
      createdAt: (authUser.created_at || new Date().toISOString()).split('T')[0],
    };
  };

  useEffect(() => {
    if (!supabase) {
      setIsAuthLoading(false);
      return;
    }

    let isMounted = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setCurrentUser(session?.user ? toUser(session.user) : null);
        setIsAuthLoading(false);
      }
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return;
      if (error) setCloudError(error.message);
      setCurrentUser(data.session?.user ? toUser(data.session.user) : null);
      setIsAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setSelectedCustomerId(null);
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUser || !supabase) {
      setCustomers([]);
      setReadyUserId(null);
      setCloudError(null);
      setSelectedCustomerId(null);
      if (!currentUser) {
        setShopInfo({ name: 'Meri Dukaan', upiId: 'dukaan@upi', phone: '', address: '' });
      }
      return;
    }

    let isMounted = true;
    setReadyUserId(null);
    setCloudError(null);

    const client = supabase;
    const loadStoreData = async () => {
      try {
        const { data, error } = await client
          .from('store_data')
          .select('customers, shop_info')
          .eq('user_id', currentUser.id)
          .maybeSingle();

        if (!isMounted) return;
        if (error) {
          setCloudError(`Cloud data load failed: ${error.message}`);
          return;
        }

        if (data) {
          setCustomers((data.customers as Customer[]) || []);
          setShopInfo((data.shop_info as ShopInfo) || {
            name: currentUser.shopName,
            upiId: currentUser.upiId || '',
            phone: currentUser.phone,
            address: currentUser.address || '',
          });
        } else {
          const initialShop: ShopInfo = {
            name: currentUser.shopName,
            upiId: currentUser.upiId || '',
            phone: currentUser.phone,
            address: currentUser.address || '',
          };
          setCustomers([]);
          setShopInfo(initialShop);
          const { error: insertError } = await client.from('store_data').insert({
            user_id: currentUser.id,
            customers: [],
            shop_info: initialShop,
          });
          if (!isMounted) return;
          if (insertError) {
            setCloudError(`Cloud data setup failed: ${insertError.message}`);
            return;
          }
        }

        setReadyUserId(currentUser.id);
      } catch (error) {
        if (isMounted) {
          setCloudError(`Cloud data load failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    };

    void loadStoreData();
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser || !supabase || readyUserId !== currentUser.id) return;

    const client = supabase;
    const saveStoreData = async () => {
      try {
        const { error } = await client.from('store_data').upsert({
          user_id: currentUser.id,
          customers,
          shop_info: shopInfo,
          updated_at: new Date().toISOString(),
        });
        if (error) {
          setCloudError(`Cloud save failed: ${error.message}`);
          showToast(`Cloud save failed: ${error.message}`);
        } else {
          setCloudError(null);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        setCloudError(`Cloud save failed: ${message}`);
        showToast(`Cloud save failed: ${message}`);
      }
    };

    void saveStoreData();
  }, [customers, shopInfo, currentUser, readyUserId]);

  // Auth: Login
  const login = async (email: string, password?: string) => {
    if (!supabase) {
      return { success: false, error: 'Supabase is not configured. Add the project URL and anon key to .env.local.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || !password) {
      return { success: false, error: 'Enter a valid email address and password.' };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password.trim(),
    });
    if (error) return { success: false, error: error.message };
    const user = toUser(data.user);
    setSelectedCustomerId(null);
    setCurrentScreen('home');
    setCurrentUser(user);
    showToast(`Namaste ${user.name}! ${user.shopName} me aapka swagat hai.`);
    return { success: true };
  };

  // Auth: Sign Up
  const signup = async (userData: {
    name: string;
    email: string;
    shopName: string;
    password?: string;
    upiId?: string;
    address?: string;
  }) => {
    if (!supabase) {
      return { success: false, error: 'Supabase is not configured. Add the project URL and anon key to .env.local.' };
    }
    const validation = validateSignupData(userData);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const cleanEmail = userData.email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: userData.password?.trim() || '',
      options: {
        data: {
          name: userData.name.trim(),
          shop_name: userData.shopName.trim(),
          upi_id: userData.upiId?.trim() || '',
          address: userData.address?.trim() || '',
        },
      },
    });
    if (error) {
      if (error.message.toLowerCase().includes('email signups are disabled')) {
        return {
          success: false,
          error: 'Email signups are disabled in Supabase. In Supabase Dashboard, open Authentication → Sign In / Providers → Email and enable email signups.',
        };
      }
      return { success: false, error: error.message };
    }
    if (!data.session || !data.user) {
      return {
        success: true,
        message: `Check ${cleanEmail} for a confirmation link, then sign in with your email and password.`,
      };
    }
    const newUser = toUser(data.user);
    setSelectedCustomerId(null);
    setCurrentScreen('home');
    setCurrentUser(newUser);
    showToast(`Naya khata safal! Swagat hai, ${newUser.name}!`);
    return { success: true, user: newUser };
  };

  // Auth: Logout
  const logout = async () => {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        showToast(`Logout failed: ${error.message}`);
        return;
      }
      setCurrentUser(null);
      setSelectedCustomerId(null);
      setCurrentScreen('home');
      setIsUserModalOpen(false);
      showToast('Aap log out ho gaye hain.');
    } catch (error) {
      showToast(`Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const deleteAccount = async (userId: string) => {
    if (!supabase || currentUser?.id !== userId) return;
    try {
      const { error } = await supabase.rpc('delete_my_account');
      if (error) {
        showToast(`Account deletion failed: ${error.message}`);
        return;
      }
      await supabase.auth.signOut({ scope: 'local' });
      setCurrentUser(null);
      setCustomers([]);
      setSelectedCustomerId(null);
      setCurrentScreen('home');
      setIsUserModalOpen(false);
      showToast('Store account deleted successfully.');
    } catch (error) {
      showToast(`Account deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const updateShopInfo = (info: ShopInfo) => {
    setShopInfo(info);
    showToast('Dukaan UPI & details save ho gayi!');
  };

  const addCustomer = (name: string, phone: string, address?: string): Customer => {
    const newCust: Customer = {
      id: 'c_' + Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      address: address?.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      transactions: [],
    };
    setCustomers((prev) => [newCust, ...prev]);
    return newCust;
  };

  const addTransaction = ({
    customerId,
    type,
    amount,
    items,
    date,
    sendWhatsApp = true,
  }: {
    customerId: string;
    type: TransactionType;
    amount: number;
    items: string;
    date: string;
    sendWhatsApp?: boolean;
  }) => {
    const newTx: Transaction = {
      id: 't_' + Date.now(),
      type,
      amount: Math.abs(amount),
      items: items.trim() || (type === 'UDHAAR' ? 'Kirana Samaan' : 'Cash / UPI Jama'),
      date: date || new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
    };

    let updatedCust: Customer | null = null;
    let newBalance = 0;

    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const updatedTxs = [...c.transactions, newTx];
          newBalance = calculateCustomerBalance(updatedTxs);
          updatedCust = { ...c, transactions: updatedTxs };
          return updatedCust;
        }
        return c;
      })
    );

    // Audio feedback
    if (type === 'JAMA') {
      sounds.playCashRegister();
      showToast(`₹${amount} Jama likh liya gaya!`);
    } else {
      sounds.playUdhaarRecorded();
      showToast(`₹${amount} Udhaar likh liya gaya!`);
    }

    let waUrl: string | undefined;
    const targetCustomer = updatedCust || customers.find((c) => c.id === customerId);

    if (targetCustomer && sendWhatsApp && targetCustomer.phone) {
      const msg = generateWhatsAppBillMessage(targetCustomer, newTx, shopInfo, newBalance);
      waUrl = getWhatsAppWebUrl(targetCustomer.phone, msg);
    }

    return {
      transaction: newTx,
      customer: targetCustomer!,
      waUrl,
    };
  };

  const quickRecordJama = (customerId: string, amount: number) => {
    addTransaction({
      customerId,
      type: 'JAMA',
      amount,
      items: 'Dukaan par jama kiya (Cash/UPI)',
      date: new Date().toISOString().split('T')[0],
      sendWhatsApp: false,
    });
  };

  const deleteTransaction = (customerId: string, transactionId: string) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          return {
            ...c,
            transactions: c.transactions.filter((t) => t.id !== transactionId),
          };
        }
        return c;
      })
    );
    showToast('Entry delete ho gayi');
  };

  const deleteCustomer = (customerId: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    if (selectedCustomerId === customerId) {
      setSelectedCustomerId(null);
      setCurrentScreen('home');
    }
    showToast('Grahak khata hata diya gaya');
  };

  const openWhatsAppReminder = (customerId: string) => {
    const cust = customers.find((c) => c.id === customerId);
    if (!cust) return;
    const balance = calculateCustomerBalance(cust.transactions);
    const days = calculateOldestPendingDays(cust.transactions);
    const msg = generateWhatsAppReminderMessage(cust, balance, days, shopInfo);
    const waUrl = getWhatsAppWebUrl(cust.phone, msg);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    showToast(`WhatsApp taqaza bheja ja raha hai: ${cust.name}`);
  };

  const openUpiQrForCustomer = (customerId: string) => {
    const cust = customers.find((c) => c.id === customerId);
    if (!cust) return;
    setQrModalCustomer(cust);
    setIsQrModalOpen(true);
  };

  const resetToDefaultData = () => {
    if (!currentUser) return;
    setCustomers([]);
    const initialShop: ShopInfo = {
      name: currentUser.shopName,
      upiId: currentUser.upiId || '',
      phone: currentUser.phone,
      address: currentUser.address || '',
    };
    setShopInfo(initialShop);
    showToast('Data reset ho gaya (0 grahak)!');
  };

  // Computed metrics
  const totalDue = calculateTotalDue(customers);
  const weeklyRecovered = calculateWeeklyRecovered(customers);
  const overdueCount = customers.filter(
    (c) => calculateCustomerBalance(c.transactions) > 0 && calculateOldestPendingDays(c.transactions) >= 30
  ).length;

  return (
    <KhataContext.Provider
      value={{
        language,
        setLanguage,
        t,

        users,
        currentUser,
        isAuthLoading,
        isCloudReady: !currentUser || readyUserId === currentUser.id,
        cloudError,
        isCloudConfigured: isSupabaseConfigured,
        isUserModalOpen,
        setIsUserModalOpen,
        login,
        signup,
        logout,
        deleteAccount,

        customers,
        shopInfo,
        currentScreen,
        selectedCustomerId,
        searchQuery,
        filterStatus,
        isUpiModalOpen,
        isQrModalOpen,
        qrModalCustomer,
        toastMessage,

        setCurrentScreen,
        setSelectedCustomerId,
        setSearchQuery,
        setFilterStatus,
        setIsUpiModalOpen,
        setIsQrModalOpen,
        setQrModalCustomer,
        updateShopInfo,
        addCustomer,
        addTransaction,
        quickRecordJama,
        deleteTransaction,
        deleteCustomer,
        showToast,
        openWhatsAppReminder,
        openUpiQrForCustomer,
        resetToDefaultData,

        totalDue,
        weeklyRecovered,
        overdueCount,
        totalCustomersCount: customers.length,
      }}
    >
      {children}
    </KhataContext.Provider>
  );
};

export function useKhata() {
  const context = useContext(KhataContext);
  if (!context) {
    throw new Error('useKhata must be used within a KhataProvider');
  }
  return context;
}
