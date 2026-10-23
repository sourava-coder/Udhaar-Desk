import React, { useState } from 'react';
import { useKhata } from '../../context/KhataContext';
import {
  calculateCustomerBalance,
  calculateOldestPendingDays,
  formatCurrency,
  generateWhatsAppReminderMessage,
} from '../../utils/khataCalculations';
import { Customer } from '../../types';
import {
  Bell,
  AlertTriangle,
  MessageCircle,
  Phone,
  CheckCircle2,
  Copy,
  Check,
  Eye,
  X,
} from 'lucide-react';

export const ReminderScreen: React.FC = () => {
  const {
    customers,
    shopInfo,
    setCurrentScreen,
    setSelectedCustomerId,
    openWhatsAppReminder,
    showToast,
    t,
  } = useKhata();

  const [previewCustomer, setPreviewCustomer] = useState<Customer | null>(null);
  const [copied, setCopied] = useState(false);

  // Filter 30+ days overdue customers
  const overdueCustomers = customers
    .map((c) => {
      const balance = calculateCustomerBalance(c.transactions);
      const days = calculateOldestPendingDays(c.transactions);
      return {
        customer: c,
        balance,
        days,
        isOverdue: balance > 0 && days >= 30,
      };
    })
    .filter((item) => item.isOverdue)
    .sort((a, b) => b.days - a.days);

  const totalOverdueAmount = overdueCustomers.reduce((sum, item) => sum + item.balance, 0);

  const handleOpenKhata = (id: string) => {
    setSelectedCustomerId(id);
    setCurrentScreen('customer');
  };

  const handleCopyMessage = (msg: string) => {
    navigator.clipboard.writeText(msg);
    setCopied(true);
    showToast('English reminder copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 pb-4">
      {/* REMINDER BANNER */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white rounded-3xl p-5 shadow-xl shadow-orange-200">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 bg-black/20 text-amber-100 text-[11px] font-extrabold px-2.5 py-1 rounded-full w-fit mb-2 backdrop-blur-xs">
              <Bell className="w-3.5 h-3.5 text-amber-200 animate-bounce" />
              <span>{t.remindersTitle}</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              {formatCurrency(totalOverdueAmount)}
            </h2>
            <p className="text-xs text-orange-100 font-medium mt-1">
              {t.remindersSubtitle}
            </p>
          </div>

          <div className="bg-white/20 px-3 py-2 rounded-2xl text-center backdrop-blur-md">
            <span className="block text-2xl font-black leading-none text-white">
              {overdueCustomers.length}
            </span>
            <span className="text-[10px] font-bold text-orange-100">{t.customers}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs font-black text-slate-700 px-1">
        <span>{t.allOverdueCustomers} ({overdueCustomers.length})</span>
        <span className="text-red-600">{t.redWarningNote}</span>
      </div>

      {/* OVERDUE LIST */}
      {overdueCustomers.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border-2 border-dashed border-emerald-300 space-y-3">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="font-black text-base text-slate-800">
            {t.noOverdueCustomers}
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {t.noOverdueSub}
          </p>
          <button
            onClick={() => setCurrentScreen('home')}
            className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-4 py-2 rounded-xl transition cursor-pointer"
          >
            {t.resetFilterBtn}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {overdueCustomers.map(({ customer, balance, days }) => {
            return (
              <div
                key={customer.id}
                className="bg-white border-2 border-red-300 rounded-3xl p-4 shadow-xs hover:shadow-md transition space-y-3.5"
              >
                {/* Header (Click to open khata) */}
                <div
                  onClick={() => handleOpenKhata(customer.id)}
                  className="flex justify-between items-start gap-2 cursor-pointer active:opacity-80 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-base text-slate-900 leading-tight hover:text-indigo-700 transition">
                        {customer.name}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      {customer.phone} {customer.address ? `• ${customer.address}` : ''}
                    </p>

                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <span className="bg-red-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-xs">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{t.daysPending(days)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase text-red-500 block">
                      {t.totalPendingDue}
                    </span>
                    <span className="text-xl font-black text-red-600 tracking-tight">
                      {formatCurrency(balance)}
                    </span>
                    <span className="text-[10px] text-indigo-600 font-bold block mt-0.5">
                      {t.viewLedger} &gt;
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  {/* WhatsApp Reminder (English) */}
                  <button
                    onClick={() => openWhatsAppReminder(customer.id)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black py-3 px-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-200 transition cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t.sendEnglishWhatsApp}</span>
                  </button>

                  {/* Direct Call */}
                  <a
                    href={`tel:${customer.phone}`}
                    className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl flex items-center justify-center transition active:scale-95"
                    title={t.callCustomer}
                  >
                    <Phone className="w-4 h-4 text-indigo-700" />
                  </a>

                  {/* Preview Reminder Message */}
                  <button
                    onClick={() => setPreviewCustomer(customer)}
                    className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl flex items-center justify-center transition active:scale-95 cursor-pointer"
                    title="Preview English Message"
                  >
                    <Eye className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: PREVIEW ENGLISH REMINDER MESSAGE */}
      {previewCustomer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <h4 className="font-extrabold text-sm text-slate-900">
                  English WhatsApp Message
                </h4>
              </div>
              <button
                onClick={() => setPreviewCustomer(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* English Message preview box */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-3 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {generateWhatsAppReminderMessage(
                previewCustomer,
                calculateCustomerBalance(previewCustomer.transactions),
                calculateOldestPendingDays(previewCustomer.transactions),
                shopInfo
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() =>
                  handleCopyMessage(
                    generateWhatsAppReminderMessage(
                      previewCustomer,
                      calculateCustomerBalance(previewCustomer.transactions),
                      calculateOldestPendingDays(previewCustomer.transactions),
                      shopInfo
                    )
                  )
                }
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => {
                  const custId = previewCustomer.id;
                  setPreviewCustomer(null);
                  openWhatsAppReminder(custId);
                }}
                className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
