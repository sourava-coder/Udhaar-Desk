import { Customer, Transaction, ShopInfo } from '../types';

/**
 * Calculates net balance due for a customer:
 * Udhaar (credit given) adds to due, Jama (payment received) reduces due.
 */
export function calculateCustomerBalance(transactions: Transaction[]): number {
  if (!transactions || transactions.length === 0) return 0;
  return transactions.reduce((acc, tx) => {
    const amount = Number(tx.amount) || 0;
    return tx.type === 'UDHAAR' ? acc + amount : acc - amount;
  }, 0);
}

/**
 * Calculates the age in days of the oldest unpaid Udhaar using FIFO matching.
 * If balance <= 0, returns 0.
 */
export function calculateOldestPendingDays(
  transactions: Transaction[],
  asOfDate: Date = new Date()
): number {
  const balance = calculateCustomerBalance(transactions);
  if (balance <= 0) return 0;

  // Filter and sort chronologically
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let remainingJama = sorted
    .filter((t) => t.type === 'JAMA')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const udhaars = sorted.filter((t) => t.type === 'UDHAAR');
  if (udhaars.length === 0) return 0;

  let oldestUnpaidDate: string | null = null;

  for (const u of udhaars) {
    const uAmount = Number(u.amount) || 0;
    if (remainingJama >= uAmount) {
      remainingJama -= uAmount;
    } else {
      // This is the earliest udhaar not fully covered by payments
      oldestUnpaidDate = u.date;
      break;
    }
  }

  if (!oldestUnpaidDate) {
    oldestUnpaidDate = udhaars[0].date;
  }

  const unpaidTime = new Date(oldestUnpaidDate).getTime();
  const currentTime = asOfDate.getTime();
  const diffMs = currentTime - unpaidTime;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}

/**
 * Calculates money recovered (Jama) in the past 7 days (or custom days)
 */
export function calculateWeeklyRecovered(
  customers: Customer[],
  asOfDate: Date = new Date(),
  daysWindow: number = 7
): number {
  const cutoff = new Date(asOfDate.getTime() - daysWindow * 24 * 60 * 60 * 1000);
  cutoff.setHours(0, 0, 0, 0);

  let total = 0;
  for (const c of customers) {
    for (const t of c.transactions) {
      if (t.type === 'JAMA') {
        const tDate = new Date(t.date);
        if (tDate >= cutoff && tDate <= asOfDate) {
          total += Number(t.amount) || 0;
        }
      }
    }
  }
  return total;
}

/**
 * Calculates total outstanding udhaar in market
 */
export function calculateTotalDue(customers: Customer[]): number {
  return customers.reduce((sum, c) => {
    const bal = calculateCustomerBalance(c.transactions);
    return bal > 0 ? sum + bal : sum;
  }, 0);
}

/**
 * Formats amount into Indian currency display format
 */
export function formatCurrency(amount: number): string {
  const rounded = Math.round(Number(amount) || 0);
  return '₹' + rounded.toLocaleString('en-IN');
}

/**
 * Generates an Indian standard UPI payment URL
 */
export function generateUpiUrl(options: {
  upiId: string;
  merchantName: string;
  amount: number;
  note?: string;
}): string {
  const pa = encodeURIComponent(options.upiId.trim());
  const pn = encodeURIComponent(options.merchantName.trim());
  const am = Math.max(0, Number(options.amount) || 0).toFixed(2);
  const tn = encodeURIComponent(options.note || 'Udhaar Bill Chukti');
  return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&tn=${tn}&cu=INR`;
}

/**
 * Generates a polite Hinglish WhatsApp bill message
 */
export function generateWhatsAppBillMessage(
  customer: Customer,
  tx: Transaction,
  shop: ShopInfo,
  currentDue: number
): string {
  const upiLink = generateUpiUrl({
    upiId: shop.upiId,
    merchantName: shop.name,
    amount: currentDue,
    note: `Bill: ${customer.name}`,
  });

  if (tx.type === 'UDHAAR') {
    return (
      `*${shop.name} - New Purchase Bill* 🧾\n` +
      `Dear *${customer.name}*,\n\n` +
      `A new credit purchase has been recorded in your ledger:\n` +
      `📅 *Date:* ${tx.date}\n` +
      `📦 *Items:* ${tx.items || 'Grocery / Store Items'}\n` +
      `💵 *New Bill Amount:* ${formatCurrency(tx.amount)}\n\n` +
      `---------------------------\n` +
      `📌 *Total Balance Due:* *${formatCurrency(currentDue)}*\n` +
      `---------------------------\n\n` +
      (currentDue > 0
        ? `To pay securely via UPI (Google Pay, PhonePe, Paytm, BHIM), please click:\n👉 ${upiLink}\n\n`
        : '') +
      `Store: *${shop.name}*\n` +
      `UPI ID: ${shop.upiId}\n` +
      `Thank you for your business!`
    );
  } else {
    return (
      `*${shop.name} - Payment Receipt* ✅\n` +
      `Dear *${customer.name}*,\n\n` +
      `We have received your payment of *${formatCurrency(tx.amount)}*. Thank you!\n\n` +
      `📅 *Date:* ${tx.date}\n` +
      `📌 *Remaining Balance Due:* *${formatCurrency(currentDue)}*\n\n` +
      `Store: *${shop.name}*`
    );
  }
}

/**
 * Generates a polite, effective English payment reminder for overdue payments
 */
export function generateWhatsAppReminderMessage(
  customer: Customer,
  balance: number,
  daysPending: number,
  shop: ShopInfo
): string {
  const upiLink = generateUpiUrl({
    upiId: shop.upiId,
    merchantName: shop.name,
    amount: balance,
    note: `Payment - ${shop.name}`,
  });

  return (
    `*Payment Reminder - ${shop.name}* 🔔\n` +
    `Dear *${customer.name}*,\n\n` +
    `This is a gentle reminder that an outstanding payment of *${formatCurrency(balance)}* is pending for *${daysPending} days* on your ledger account.\n\n` +
    `Kindly clear your pending dues at your earliest convenience using the secure UPI link below:\n` +
    `👉 *Pay via UPI:* ${upiLink}\n\n` +
    `Store UPI ID: \`${shop.upiId}\`\n` +
    `(Works on PhonePe, Google Pay, Paytm, BHIM, and all UPI apps)\n\n` +
    `If you have already made this payment, kindly share the receipt with us so we can update your ledger.\n\n` +
    `Thank you,\n` +
    `*${shop.name}*\n` +
    (shop.phone ? `Contact: ${shop.phone}` : '')
  );
}

/**
 * Creates WhatsApp share web link
 */
export function getWhatsAppWebUrl(phone: string, message: string): string {
  // Strip non-digits
  const cleanPhone = phone.replace(/\D/g, '');
  // Format with India 91 prefix if 10-digit
  const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  return `https://api.whatsapp.com/send?phone=${fullPhone}&text=${encodeURIComponent(message)}`;
}
