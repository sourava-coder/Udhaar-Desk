import React, { useState, useEffect } from 'react';
import { useKhata } from '../../context/KhataContext';
import { TransactionType } from '../../types';
import {
  Receipt,
  UserPlus,
  Send,
  Calendar,
  IndianRupee,
  Package,
  CheckCircle2,
  MessageCircle,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export const AddEntryScreen: React.FC = () => {
  const {
    customers,
    selectedCustomerId,
    setSelectedCustomerId,
    setCurrentScreen,
    addCustomer,
    addTransaction,
    showToast,
    t,
  } = useKhata();

  const [entryType, setEntryType] = useState<TransactionType>('UDHAAR');
  const [selectedCustId, setSelectedCustId] = useState<string>(
    selectedCustomerId || (customers.length > 0 ? customers[0].id : 'NEW')
  );

  // New customer inputs if creating new
  const [isNewCust, setIsNewCust] = useState(customers.length === 0);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');

  // Transaction details
  const [amount, setAmount] = useState<string>('');
  const [items, setItems] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [sendWhatsApp, setSendWhatsApp] = useState<boolean>(true);

  // WhatsApp post-save modal state
  const [savedResult, setSavedResult] = useState<{
    customerName: string;
    amount: number;
    waUrl?: string;
    customerId: string;
  } | null>(null);

  useEffect(() => {
    if (selectedCustomerId) {
      setSelectedCustId(selectedCustomerId);
      setIsNewCust(false);
    }
  }, [selectedCustomerId]);

  const quickKiranaItems = [
    'Aata 10kg',
    'Sarson Tel 1L',
    'Chini 2kg',
    'Chai Patti',
    'Toor Dal 1kg',
    'Surf Excel',
    'Doodh & Dahi',
    'Snacks & Biscuit',
    'Masale',
  ];

  const handleAppendItem = (item: string) => {
    if (!items.trim()) {
      setItems(item);
    } else {
      setItems(`${items}, ${item}`);
    }
  };

  const handleAmountIncrement = (val: number) => {
    const current = Number(amount) || 0;
    setAmount(String(current + val));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      showToast(t.amountLabel);
      return;
    }

    let targetCustId = selectedCustId;
    let targetCustName = '';

    if (isNewCust || selectedCustId === 'NEW') {
      if (!newName.trim()) {
        showToast(t.customerFullName);
        return;
      }
      const created = addCustomer(newName, newPhone, newAddress);
      targetCustId = created.id;
      targetCustName = created.name;
    } else {
      const found = customers.find((c) => c.id === selectedCustId);
      if (!found) {
        showToast('Customer error');
        return;
      }
      targetCustName = found.name;
    }

    const { waUrl } = addTransaction({
      customerId: targetCustId,
      type: entryType,
      amount: numAmount,
      items: items.trim() || (entryType === 'UDHAAR' ? 'General Grocery / Goods' : 'Ledger Payment'),
      date,
      sendWhatsApp,
    });

    if (sendWhatsApp && waUrl) {
      try {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      } catch {
        // Handled in modal
      }
    }

    setSavedResult({
      customerName: targetCustName,
      amount: numAmount,
      waUrl,
      customerId: targetCustId,
    });
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentScreen('home')}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer"
            aria-label={t.backBtn}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-700" />
            <span>{t.newEntryTitle}</span>
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-5 lg:space-y-0">
        {/* TOGGLE: Udhaar Diya vs Jama Mila */}
        <div className="grid grid-cols-2 gap-2.5 bg-slate-100 p-1.5 rounded-2xl lg:col-span-2">
          <button
            type="button"
            onClick={() => setEntryType('UDHAAR')}
            className={`py-3 px-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              entryType === 'UDHAAR'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{t.gaveCreditTab}</span>
          </button>

          <button
            type="button"
            onClick={() => setEntryType('JAMA')}
            className={`py-3 px-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              entryType === 'JAMA'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{t.receivedCashTab}</span>
          </button>
        </div>

        {/* CUSTOMER SELECTOR / NEW CUSTOMER */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase text-slate-700">
              {t.customerLabel}
            </label>
            <button
              type="button"
              onClick={() => setIsNewCust(!isNewCust)}
              className="text-xs text-indigo-700 font-extrabold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isNewCust ? t.selectExistingCustomer : '+ Naya Grahak'}</span>
            </button>
          </div>

          {!isNewCust ? (
            <select
              value={selectedCustId}
              onChange={(e) => {
                if (e.target.value === 'NEW') {
                  setIsNewCust(true);
                } else {
                  setSelectedCustId(e.target.value);
                }
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-3.5 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
              <option value="NEW">+ Naya Grahak Jodein</option>
            </select>
          ) : (
            <div className="space-y-3 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  {t.customerFullName}
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Mukesh Bhai"
                  className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    {t.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98XXXXXXXX"
                    className="w-full border border-slate-300 rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    {t.addressLabel}
                  </label>
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="e.g. Gali 3"
                    className="w-full border border-slate-300 rounded-2xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AMOUNT INPUT */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-3">
          <label className="block text-xs font-black uppercase text-slate-700">
            {t.amountLabel}
          </label>

          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-2xl font-black text-slate-400">
              <IndianRupee className="w-6 h-6 text-slate-500" />
            </span>
            <input
              type="number"
              min="1"
              step="any"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl pl-12 pr-4 py-3.5 text-2xl font-black text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
            />
          </div>

          {/* Quick amount chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">
              {t.quickAddLabel}
            </span>
            {[100, 200, 500, 1000, 2000].map((inc) => (
              <button
                type="button"
                key={inc}
                onClick={() => handleAmountIncrement(inc)}
                className="bg-slate-100 hover:bg-indigo-100 hover:text-indigo-800 text-slate-700 font-extrabold text-xs px-2.5 py-1.5 rounded-xl transition active:scale-95 cursor-pointer"
              >
                +{inc}
              </button>
            ))}
            {amount && (
              <button
                type="button"
                onClick={() => setAmount('')}
                className="text-[11px] text-red-600 font-bold px-2 py-1 hover:underline cursor-pointer"
              >
                {t.clearAmount}
              </button>
            )}
          </div>
        </div>

        {/* ITEMS BREAKDOWN */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-slate-500" />
              <span>{t.itemsLabel}</span>
            </label>
            <span className="text-[10px] text-slate-400 font-medium">{t.itemsHint}</span>
          </div>

          <textarea
            value={items}
            onChange={(e) => setItems(e.target.value)}
            rows={2}
            placeholder={
              entryType === 'UDHAAR'
                ? 'e.g. Aata 10kg, Mustard Oil 2L, Sugar 2kg'
                : 'e.g. Paid in Cash / Paid via UPI'
            }
            className="w-full border border-slate-300 rounded-2xl p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Quick Kirana Item suggestions */}
          <div className="pt-1">
            <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1 mb-1.5">
              <Sparkles className="w-3 h-3 text-amber-500" /> {t.fastChipsLabel}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickKiranaItems.map((chip) => (
                <button
                  type="button"
                  key={chip}
                  onClick={() => handleAppendItem(chip)}
                  className="text-[11px] bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 px-2.5 py-1 rounded-xl font-semibold transition active:scale-95 cursor-pointer"
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* DATE PICKER */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs">
          <label className="block text-xs font-black uppercase text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>{t.dateLabel}</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* WHATSAPP BILL OPTION TOGGLE (Always English) */}
        <div
          onClick={() => setSendWhatsApp(!sendWhatsApp)}
          className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-3.5 flex items-center justify-between cursor-pointer select-none transition hover:bg-emerald-100/70 lg:col-span-2"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-2xl shadow-xs">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-emerald-950">
                {t.sendWhatsAppCheckbox}
              </h4>
              <p className="text-[11px] text-emerald-800 font-medium">
                {t.sendWhatsAppHint}
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={sendWhatsApp}
            onChange={(e) => setSendWhatsApp(e.target.checked)}
            className="w-5 h-5 accent-emerald-600 rounded-lg cursor-pointer"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className={`w-full py-4 px-4 rounded-2xl font-black text-base shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-white cursor-pointer lg:col-span-2 ${
            entryType === 'UDHAAR'
              ? 'bg-red-600 hover:bg-red-700 shadow-red-200'
              : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
          }`}
        >
          <Send className="w-5 h-5" />
          <span>
            {entryType === 'UDHAAR' ? t.saveCreditBtn : t.saveCashBtn}
          </span>
        </button>
      </form>

      {/* POST-SAVE CONFIRMATION MODAL */}
      {savedResult && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                {t.entrySuccessTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {t.entrySuccessDesc(savedResult.customerName, String(savedResult.amount))}
              </p>
            </div>

            {savedResult.waUrl ? (
              <div className="space-y-2">
                <a
                  href={savedResult.waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition active:scale-95 text-sm"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Send English Bill via WhatsApp</span>
                </a>
              </div>
            ) : null}

            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSavedResult(null);
                  setAmount('');
                  setItems('');
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                {t.writeAnotherBillBtn}
              </button>

              <button
                type="button"
                onClick={() => {
                  const targetId = savedResult.customerId;
                  setSavedResult(null);
                  setSelectedCustomerId(targetId);
                  setCurrentScreen('customer');
                }}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                {t.viewLedgerBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
