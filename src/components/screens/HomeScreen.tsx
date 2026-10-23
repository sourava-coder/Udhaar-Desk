import React from 'react';
import { useKhata } from '../../context/KhataContext';
import {
  calculateCustomerBalance,
  calculateOldestPendingDays,
  formatCurrency,
} from '../../utils/khataCalculations';
import {
  Search,
  PlusCircle,
  AlertTriangle,
  QrCode,
  MessageCircle,
  ChevronRight,
  Clock,
  CheckCircle2,
  X,
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    customers,
    totalDue,
    overdueCount,
    setCurrentScreen,
    setSelectedCustomerId,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    openWhatsAppReminder,
    openUpiQrForCustomer,
    t,
  } = useKhata();

  const handleOpenCustomer = (id: string) => {
    setSelectedCustomerId(id);
    setCurrentScreen('customer');
    document.getElementById('app-content')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter customers based on search and status tabs
  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.address && c.address.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    const bal = calculateCustomerBalance(c.transactions);
    const days = calculateOldestPendingDays(c.transactions);

    if (filterStatus === 'overdue') {
      return bal > 0 && days >= 30;
    }
    if (filterStatus === 'active') {
      return bal > 0;
    }
    if (filterStatus === 'cleared') {
      return bal <= 0;
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-4">
      {/* SUMMARY BANNER */}
      <div className="bg-gradient-to-br from-rose-600 via-red-600 to-amber-700 text-white rounded-3xl p-5 shadow-xl shadow-red-200/50 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-red-100 font-extrabold flex items-center gap-1">
              {t.totalDue}
            </span>
            <h2 className="text-3xl font-black mt-1 tracking-tight text-white drop-shadow-xs">
              {formatCurrency(totalDue)}
            </h2>
            <p className="text-xs text-red-100/90 mt-1">
              {t.totalDueSubtitle}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-3.5 py-2.5 rounded-2xl text-center border border-white/20">
            <span className="block text-2xl font-black leading-none text-white">
              {customers.length}
            </span>
            <span className="text-[10px] uppercase font-bold text-red-100">{t.customers}</span>
          </div>
        </div>

        {/* 30+ Days Red Alert Warning Box */}
        {overdueCount > 0 ? (
          <div className="mt-4 bg-red-950/60 border border-red-300/40 rounded-2xl p-3 flex items-center justify-between text-xs backdrop-blur-md">
            <div className="flex items-center gap-2 font-semibold">
              <span className="p-1 bg-red-500 rounded-lg animate-pulse text-white">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <span>
                {t.overdueBannerText(overdueCount)}
              </span>
            </div>
            <button
              onClick={() => {
                setFilterStatus('overdue');
                setCurrentScreen('reminders');
              }}
              className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-900 font-extrabold text-[11px] px-3 py-1.5 rounded-xl shadow-xs transition cursor-pointer"
            >
              {t.sendReminderBtn}
            </button>
          </div>
        ) : (
          <div className="mt-3 bg-emerald-900/40 border border-emerald-300/30 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs text-emerald-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{t.noOverdueSub}</span>
          </div>
        )}
      </div>

      {/* QUICK ACTION BUTTONS */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => {
            setSelectedCustomerId(null);
            setCurrentScreen('add');
          }}
          className="bg-indigo-700 hover:bg-indigo-800 active:scale-95 text-white p-3.5 rounded-2xl font-extrabold flex items-center justify-center gap-2.5 shadow-md shadow-indigo-200 transition text-sm cursor-pointer"
        >
          <PlusCircle className="w-5 h-5 text-amber-300" />
          <span>{t.addUdhaarBtn}</span>
        </button>

        <button
          onClick={() => setCurrentScreen('reminders')}
          className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 p-3.5 rounded-2xl font-extrabold flex items-center justify-center gap-2.5 shadow-md shadow-amber-200 transition text-sm cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 text-emerald-950" />
          <span>{t.remindersBtn}</span>
        </button>
      </div>

      {/* SEARCH INPUT */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-9 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* FILTER PILLS */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
            filterStatus === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {t.filterAll} ({customers.length})
        </button>

        <button
          onClick={() => setFilterStatus('overdue')}
          className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1 cursor-pointer ${
            filterStatus === 'overdue'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{t.filterOverdue} ({overdueCount})</span>
        </button>

        <button
          onClick={() => setFilterStatus('active')}
          className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
            filterStatus === 'active'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {t.filterPending}
        </button>

        <button
          onClick={() => setFilterStatus('cleared')}
          className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
            filterStatus === 'cleared'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {t.filterCleared}
        </button>
      </div>

      {/* CUSTOMERS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2 flex justify-between items-center px-1">
          <span className="text-xs font-extrabold uppercase text-slate-500">
            {t.customerListTitle} ({filteredCustomers.length})
          </span>
          <span className="text-[11px] text-red-600 font-bold">
            {t.redWarningNote}
          </span>
        </div>

        {customers.length === 0 ? (
          <div className="md:col-span-2 bg-white rounded-3xl p-8 text-center text-slate-400 border border-dashed border-slate-300 shadow-xs">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <PlusCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-extrabold text-slate-800">{t.noCustomersYet}</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              {t.noCustomersSubtitle}
            </p>
            <button
              onClick={() => setCurrentScreen('add')}
              className="mt-4 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-4 py-2.5 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
            >
              {t.addFirstCustomerBtn}
            </button>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="md:col-span-2 bg-white rounded-2xl p-8 text-center text-slate-400 border border-dashed border-slate-200">
            <Search className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-600">{t.noSearchResults}</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
              }}
              className="mt-3 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl cursor-pointer"
            >
              {t.resetFilterBtn}
            </button>
          </div>
        ) : (
          filteredCustomers.map((customer) => {
            const balance = calculateCustomerBalance(customer.transactions);
            const days = calculateOldestPendingDays(customer.transactions);
            const isOverdue = days >= 30 && balance > 0;

            return (
              <div
                key={customer.id}
                className={`bg-white border rounded-2xl p-3.5 transition-all shadow-xs hover:shadow-md ${
                  isOverdue
                    ? 'border-red-400 bg-red-50/30 ring-1 ring-red-400'
                    : 'border-slate-200 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  {/* Left: Avatar & Info */}
                  <div
                    onClick={() => handleOpenCustomer(customer.id)}
                    className="flex items-start gap-3 flex-1 cursor-pointer"
                  >
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-base shadow-xs shrink-0 ${
                        isOverdue
                          ? 'bg-red-600 text-white'
                          : balance > 0
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {customer.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-extrabold text-sm text-slate-900 leading-tight truncate">
                          {customer.name}
                        </h4>
                        {isOverdue && (
                          <span className="text-[10px] bg-red-600 text-white font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 animate-pulse">
                            <AlertTriangle className="w-2.5 h-2.5" /> 30+ Din
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {customer.phone} {customer.address ? `• ${customer.address}` : ''}
                      </p>

                      {/* Days Pending Badge */}
                      <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                        {balance > 0 ? (
                          <span
                            className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-md ${
                              isOverdue
                                ? 'bg-red-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            <Clock className="w-3 h-3 mr-1" />
                            {t.daysPending(days)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {t.allCleared}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Net Balance & Arrow */}
                  <div
                    onClick={() => handleOpenCustomer(customer.id)}
                    className="text-right cursor-pointer shrink-0"
                  >
                    <span
                      className={`text-[10px] uppercase font-extrabold block ${
                        balance > 0 ? 'text-slate-400' : 'text-emerald-600'
                      }`}
                    >
                      {balance > 0 ? t.totalPendingDue : t.clearedStatus}
                    </span>
                    <span
                      className={`text-lg font-black block tracking-tight ${
                        balance > 0
                          ? isOverdue
                            ? 'text-red-600'
                            : 'text-slate-900'
                          : 'text-emerald-700'
                      }`}
                    >
                      {formatCurrency(balance)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-300 ml-auto mt-0.5" />
                  </div>
                </div>

                {/* Quick Action Footer Buttons on Card */}
                {balance > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openUpiQrForCustomer(customer.id)}
                      className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5 text-indigo-700" />
                      <span>{t.showQrBtn}</span>
                    </button>

                    <button
                      onClick={() => openWhatsAppReminder(customer.id)}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 text-white shadow-xs cursor-pointer ${
                        isOverdue
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{isOverdue ? t.sendReminderAction : t.whatsappAction}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
