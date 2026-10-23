import React, { useState } from 'react';
import { useKhata } from '../../context/KhataContext';
import {
  calculateCustomerBalance,
  calculateOldestPendingDays,
  formatCurrency,
  generateUpiUrl,
  generateWhatsAppBillMessage,
  getWhatsAppWebUrl,
} from '../../utils/khataCalculations';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Phone,
  QrCode,
  ExternalLink,
  Plus,
  Minus,
  Trash2,
  Share2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  X,
  History,
} from 'lucide-react';

export const CustomerKhataScreen: React.FC = () => {
  const {
    t,
    customers,
    selectedCustomerId,
    setSelectedCustomerId,
    setCurrentScreen,
    shopInfo,
    addTransaction,
    deleteTransaction,
    deleteCustomer,
    openUpiQrForCustomer,
    showToast,
  } = useKhata();

  const [isJamaModalOpen, setIsJamaModalOpen] = useState(false);
  const [jamaAmount, setJamaAmount] = useState<string>('');
  const [jamaNotes, setJamaNotes] = useState<string>('Cash Jama');
  const [sendJamaWa, setSendJamaWa] = useState(true);

  // In-app deletion dialog states (replaces window.confirm which fails in iframes)
  const [confirmDeleteCustomer, setConfirmDeleteCustomer] = useState(false);
  const [deletingTx, setDeletingTx] = useState<{ id: string; amount: number; items: string } | null>(null);

  const customer = customers.find((c) => c.id === selectedCustomerId);

  if (!customer) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center space-y-3">
        <p className="text-slate-500 font-bold">{t.customerNotFound}</p>
        <button
          onClick={() => setCurrentScreen('home')}
          className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl text-xs"
        >
          {t.backToKhataList}
        </button>
      </div>
    );
  }

  const balance = calculateCustomerBalance(customer.transactions);
  const days = calculateOldestPendingDays(customer.transactions);
  const isOverdue = days >= 30 && balance > 0;

  const upiUrl = generateUpiUrl({
    upiId: shopInfo.upiId,
    merchantName: shopInfo.name,
    amount: balance,
    note: `Bill: ${customer.name}`,
  });

  const handleOpenAddUdhaar = () => {
    setSelectedCustomerId(customer.id);
    setCurrentScreen('add');
  };

  const handleOpenJamaModal = () => {
    setJamaAmount(balance > 0 ? String(balance) : '');
    setIsJamaModalOpen(true);
  };

  const handleSaveJama = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(jamaAmount);
    if (isNaN(num) || num <= 0) {
      showToast(t.pleaseEnterValidAmount);
      return;
    }

    const { waUrl } = addTransaction({
      customerId: customer.id,
      type: 'JAMA',
      amount: num,
      items: jamaNotes.trim() || 'Payment Jama',
      date: new Date().toISOString().split('T')[0],
      sendWhatsApp: sendJamaWa,
    });

    // Celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // Ignore if unavailable
    }

    if (sendJamaWa && waUrl) {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }

    setIsJamaModalOpen(false);
  };

  const handleShareIndividualTx = (txId: string) => {
    const tx = customer.transactions.find((t) => t.id === txId);
    if (!tx) return;
    const msg = generateWhatsAppBillMessage(customer, tx, shopInfo, balance);
    const waUrl = getWhatsAppWebUrl(customer.phone, msg);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    showToast(t.whatsappLinkOpened);
  };

  const handleExecuteDeleteCustomer = () => {
    deleteCustomer(customer.id);
    setConfirmDeleteCustomer(false);
  };

  const handleExecuteDeleteTransaction = () => {
    if (deletingTx) {
      deleteTransaction(customer.id, deletingTx.id);
      setDeletingTx(null);
    }
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Top Profile Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentScreen('home')}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
            aria-label={t.backBtn}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-black text-slate-900 leading-tight">
              {customer.name}
            </h2>
            <p className="text-xs text-slate-500 font-semibold">{customer.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <a
            href={`tel:${customer.phone}`}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-indigo-700 rounded-xl transition active:scale-95"
            title={t.callCustomer}
          >
            <Phone className="w-4 h-4" />
          </a>
          <button
            onClick={() => setConfirmDeleteCustomer(true)}
            className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition active:scale-95"
            title={t.deleteCustomer}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* BALANCE BIG CARD WITH UPI PAY BUTTON */}
      <div
        className={`rounded-3xl p-5 shadow-sm border transition-all ${
          isOverdue
            ? 'bg-red-50/70 border-red-300 ring-1 ring-red-400'
            : balance > 0
            ? 'bg-white border-slate-200'
            : 'bg-emerald-50/60 border-emerald-200'
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500 block">
              {t.netDueBalance}
            </span>
            <h3
              className={`text-3xl font-black mt-1 tracking-tight ${
                balance > 0
                  ? isOverdue
                    ? 'text-red-600'
                    : 'text-slate-900'
                  : 'text-emerald-700'
              }`}
            >
              {formatCurrency(balance)}
            </h3>
          </div>

          <div className="text-right">
            {balance > 0 ? (
              <span
                className={`inline-flex items-center text-xs font-black px-3 py-1 rounded-xl shadow-xs ${
                  isOverdue
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {isOverdue ? (
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                ) : (
                  <Clock className="w-3.5 h-3.5 mr-1" />
                )}
                <span>{t.daysPendingBadge(days)}</span>
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-black px-3 py-1 rounded-xl bg-emerald-600 text-white">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                <span>{t.allClearBadge}</span>
              </span>
            )}
          </div>
        </div>

        {/* PAY BY UPI BIG BUTTON */}
        {balance > 0 ? (
          <div className="mt-4 pt-3.5 border-t border-slate-200/80 space-y-2">
            <a
              href={upiUrl}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{t.payByUpi(formatCurrency(balance))}</span>
            </a>

            <button
              onClick={() => openUpiQrForCustomer(customer.id)}
              className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-900 active:scale-95 font-black py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition text-xs"
            >
              <QrCode className="w-4 h-4 text-indigo-700" />
              <span>{t.showLiveQr}</span>
            </button>
          </div>
        ) : null}
      </div>

      {/* QUICK ENTRY ACTIONS */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleOpenAddUdhaar}
          className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black py-3.5 px-3 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-red-200 transition text-sm"
        >
          <Minus className="w-5 h-5" />
          <span>{t.gaveCreditBtnShort}</span>
        </button>

        <button
          onClick={handleOpenJamaModal}
          className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black py-3.5 px-3 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-emerald-200 transition text-sm"
        >
          <Plus className="w-5 h-5" />
          <span>{t.receivedCashBtnShort}</span>
        </button>
      </div>

      {/* TRANSACTION HISTORY */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
            <History className="w-4 h-4 text-slate-500" />
            <span>{t.ledgerHistory}</span>
          </h4>
          <span className="text-[11px] font-bold text-slate-400">
            {t.entriesCount(customer.transactions.length)}
          </span>
        </div>

        {customer.transactions.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-dashed border-slate-200">
            <Receipt className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-600">{t.noLedgerEntries}</p>
            <p className="text-xs text-slate-400 mt-1">
              {t.noLedgerEntriesSub}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {customer.transactions
              .slice()
              .reverse()
              .map((tx) => {
                const isUdhaar = tx.type === 'UDHAAR';
                return (
                  <div
                    key={tx.id}
                    className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs flex items-center justify-between gap-3 hover:border-slate-300 transition"
                  >
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <div
                        className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                          isUdhaar ? 'bg-red-600' : 'bg-emerald-600'
                        }`}
                      />
                      <div className="min-w-0">
                        <h5 className="font-extrabold text-sm text-slate-800 leading-snug truncate">
                          {tx.items || (isUdhaar ? 'Credit Bill' : 'Cash / Payment')}
                        </h5>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-semibold">
                          <span>{tx.date}</span>
                          <span>•</span>
                          <span className={isUdhaar ? 'text-red-600' : 'text-emerald-700'}>
                            {isUdhaar ? t.gaveCreditBtnShort : t.receivedCashBtnShort}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <span
                          className={`text-base font-black tracking-tight ${
                            isUdhaar ? 'text-red-600' : 'text-emerald-600'
                          }`}
                        >
                          {isUdhaar ? '-' : '+'} {formatCurrency(tx.amount)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleShareIndividualTx(tx.id)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          title="Share WhatsApp Receipt (English)"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingTx({ id: tx.id, amount: tx.amount, items: tx.items })}
                          className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title={t.deleteEntry}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* QUICK JAMA MODAL */}
      {isJamaModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">
                    {t.jamaModalTitle}
                  </h4>
                  <p className="text-[11px] text-slate-500">{customer.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsJamaModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJama} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  {t.jamaAmountLabel}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xl font-black text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={jamaAmount}
                    onChange={(e) => setJamaAmount(e.target.value)}
                    placeholder="0"
                    required
                    autoFocus
                    className="w-full pl-8 pr-4 py-2.5 border-2 border-emerald-300 rounded-2xl text-2xl font-black text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                {balance > 0 && (
                  <button
                    type="button"
                    onClick={() => setJamaAmount(String(balance))}
                    className="text-[11px] font-bold text-emerald-700 hover:underline mt-1"
                  >
                    {t.fillFullDueBtn(formatCurrency(balance))}
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  {t.paymentNoteLabel}
                </label>
                <input
                  type="text"
                  value={jamaNotes}
                  onChange={(e) => setJamaNotes(e.target.value)}
                  placeholder={t.paymentNotePlaceholder}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <span className="text-xs font-bold text-emerald-950">
                  {t.sendReceiptWhatsAppCheckbox}
                </span>
                <input
                  type="checkbox"
                  checked={sendJamaWa}
                  onChange={(e) => setSendJamaWa(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsJamaModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  {t.cancelAction}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black rounded-xl shadow-md transition"
                >
                  {t.recordJamaAction}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE CUSTOMER MODAL */}
      {confirmDeleteCustomer && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">
                {t.deleteCustomerModalTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {t.deleteCustomerModalDesc(customer.name, customer.transactions.length)}
              </p>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-xs text-rose-800 font-bold">
              {t.netDueBalance}: {formatCurrency(balance)}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConfirmDeleteCustomer(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                {t.cancelAction}
              </button>
              <button
                type="button"
                onClick={handleExecuteDeleteCustomer}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-black rounded-xl shadow-md transition"
              >
                {t.confirmDeleteYes}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE TRANSACTION MODAL */}
      {deletingTx && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">
                {t.deleteEntryModalTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {t.deleteEntryModalDesc}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-700">
              <div className="font-extrabold text-sm text-slate-900">
                {formatCurrency(deletingTx.amount)}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {deletingTx.items}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeletingTx(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                {t.cancelAction}
              </button>
              <button
                type="button"
                onClick={handleExecuteDeleteTransaction}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-black rounded-xl shadow-md transition"
              >
                {t.confirmDeleteYes}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
