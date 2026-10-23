import React from 'react';
import { useKhata } from '../../context/KhataContext';
import {
  calculateCustomerBalance,
  calculateOldestPendingDays,
  formatCurrency,
} from '../../utils/khataCalculations';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight,
  QrCode,
  User as UserIcon,
  ShieldCheck,
} from 'lucide-react';

export const OwnerReportScreen: React.FC = () => {
  const {
    customers,
    shopInfo,
    currentUser,
    totalDue,
    weeklyRecovered,
    setCurrentScreen,
    setSelectedCustomerId,
    setIsUpiModalOpen,
    setIsUserModalOpen,
    t,
  } = useKhata();

  // Find oldest dues
  const customersWithDues = customers
    .map((c) => {
      const balance = calculateCustomerBalance(c.transactions);
      const days = calculateOldestPendingDays(c.transactions);
      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        balance,
        days,
        isOverdue: days >= 30,
      };
    })
    .filter((c) => c.balance > 0)
    .sort((a, b) => b.days - a.days);

  const topOldestDues = customersWithDues.slice(0, 5);

  const handleOpenCustomer = (id: string) => {
    setSelectedCustomerId(id);
    setCurrentScreen('customer');
  };

  return (
    <div className="space-y-4 pb-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-5 lg:space-y-0">
      {/* Title */}
      <div className="flex items-center justify-between pb-1 lg:col-span-2">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-700" />
            <span>{t.reportsTitle}</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {t.reportsSubtitle}
          </p>
        </div>
      </div>

      {/* KEY METRICS GRID */}
      <div className="grid grid-cols-2 gap-3 lg:col-span-2">
        {/* Metric 1: Money recovered this week */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-3xl p-4 shadow-lg shadow-emerald-200/60 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-100">
              {t.recoveredThisWeek}
            </span>
            <div className="p-1.5 bg-white/20 rounded-xl backdrop-blur-xs">
              <TrendingUp className="w-4 h-4 text-emerald-100" />
            </div>
          </div>
          <h3 className="text-2xl font-black mt-2 tracking-tight text-white drop-shadow-xs">
            {formatCurrency(weeklyRecovered)}
          </h3>
          <p className="text-[10px] text-emerald-100 mt-1 font-medium">
            {t.recoveredThisWeekSub}
          </p>
        </div>

        {/* Metric 2: Total Due */}
        <div className="bg-gradient-to-br from-rose-500 to-red-700 text-white rounded-3xl p-4 shadow-lg shadow-red-200/60 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-red-100">
              {t.totalDue}
            </span>
            <div className="p-1.5 bg-white/20 rounded-xl backdrop-blur-xs">
              <AlertTriangle className="w-4 h-4 text-red-100" />
            </div>
          </div>
          <h3 className="text-2xl font-black mt-2 tracking-tight text-white drop-shadow-xs">
            {formatCurrency(totalDue)}
          </h3>
          <p className="text-[10px] text-red-100 mt-1 font-medium">
            {t.totalDueSubtitle}
          </p>
        </div>
      </div>

      {/* TOP OLDEST UNPAID DUES */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-3 lg:col-span-2">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>{t.oldestDuesTitle}</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              {t.oldestDuesSubtitle}
            </p>
          </div>
        </div>

        {topOldestDues.length === 0 ? (
          <div className="text-center py-6 text-slate-400">
            <p className="text-xs font-bold text-slate-600">
              {t.noOverdueCustomers}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {topOldestDues.map((c, index) => {
              return (
                <div
                  key={c.id}
                  onClick={() => handleOpenCustomer(c.id)}
                  className="py-2.5 flex items-center justify-between hover:bg-slate-50 rounded-xl px-1.5 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-black flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900">
                        {c.name}
                      </h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                            c.isOverdue
                              ? 'bg-red-100 text-red-700 font-extrabold'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {t.daysPending(c.days)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-2">
                    <div>
                      <span className="text-sm font-black text-slate-900 block">
                        {formatCurrency(c.balance)}
                      </span>
                      <span className="text-[10px] text-indigo-600 font-bold hover:underline">
                        {t.viewLedger}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DUKAAN UPI CONFIGURATION CARD */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-sm text-slate-900 leading-tight">
                {t.upiConfigTitle}
              </h4>
              <p className="text-[11px] text-slate-500">
                {t.upiConfigSub}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsUpiModalOpen(true)}
            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
          >
            {t.changeUpiBtn}
          </button>
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">{t.shopNameLabel}</span>
            <span className="font-extrabold text-slate-800">{shopInfo.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">{t.upiVpaLabel}</span>
            <span className="font-mono font-bold text-indigo-900">{shopInfo.upiId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">{t.shopPhoneLabel}</span>
            <span className="font-bold text-slate-800">{shopInfo.phone || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* USER ACCOUNT & DATA ISOLATION CARD (NO OTHER USERS SHOWN) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-sm text-slate-900 leading-tight">
                {t.myAccount}
              </h4>
              <p className="text-[11px] text-slate-500">
                {t.privacyGuarantee}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsUserModalOpen(true)}
            className="text-xs bg-amber-400 hover:bg-amber-500 text-indigo-950 font-black px-3 py-1.5 rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
          >
            {t.myAccount}
          </button>
        </div>

        {currentUser && (
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">{t.yourFullName}:</span>
              <span className="font-extrabold text-slate-800">{currentUser.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">
                {currentUser.email ? t.emailLabel : t.mobileNumber10}:
              </span>
              <span className="min-w-0 break-all text-right font-bold text-slate-800">
                {currentUser.email || currentUser.phone}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">{t.yourShopName}:</span>
              <span className="font-bold text-indigo-900">{currentUser.shopName}</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t.privacyGuarantee}</span>
        </div>
      </div>
    </div>
  );
};
