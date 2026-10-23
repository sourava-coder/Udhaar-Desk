import React, { useState } from 'react';
import { useKhata } from '../../context/KhataContext';
import {
  X,
  Store,
  Phone,
  Mail,
  CreditCard,
  LogOut,
  Check,
  ShieldCheck,
  Users,
  Trash2,
  MapPin,
  AlertTriangle,
} from 'lucide-react';
import { formatCurrency } from '../../utils/khataCalculations';

export const UserModal: React.FC = () => {
  const {
    currentUser,
    isUserModalOpen,
    setIsUserModalOpen,
    deleteAccount,
    logout,
    totalDue,
    customers,
    t,
  } = useKhata();

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  if (!isUserModalOpen || !currentUser) return null;

  const handleExecuteDelete = async () => {
    await deleteAccount(currentUser.id);
    setIsConfirmingDelete(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-indigo-950 flex items-center justify-center font-black shadow-inner">
              <Store className="w-5 h-5 text-indigo-950" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm leading-tight text-white">
                {t.myAccount}
              </h3>
              <p className="text-[11px] text-indigo-200 font-medium">
                {t.privacyGuarantee}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsConfirmingDelete(false);
              setIsUserModalOpen(false);
            }}
            className="p-1 rounded-full text-indigo-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation Screen for Delete */}
        {isConfirmingDelete ? (
          <div className="p-5 text-center space-y-4">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h4 className="font-black text-base text-slate-900">
                {t.confirmDeleteAccountTitle}
              </h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {t.confirmDeleteAccountDesc(currentUser.shopName)}
              </p>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-left text-xs space-y-1">
              <div className="flex justify-between text-slate-700">
                <span className="font-bold">Dukaan:</span>
                <span className="font-extrabold text-slate-900">{currentUser.shopName}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span className="font-bold">{t.customers}:</span>
                <span className="font-extrabold text-slate-900">{customers.length}</span>
              </div>
              <div className="flex justify-between text-rose-700 font-bold">
                <span>{t.totalDue}:</span>
                <span className="font-black">{formatCurrency(totalDue)}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                {t.cancelAction}
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md transition active:scale-95 cursor-pointer"
              >
                {t.confirmDeleteAccountYes}
              </button>
            </div>
          </div>
        ) : (
          /* Normal Profile View */
          <div className="p-4 overflow-y-auto space-y-4 text-slate-800">
            {/* Active User Store Card */}
            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl relative">
              <span className="absolute top-3 right-3 text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <Check className="w-3 h-3" />
                <span>Active</span>
              </span>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-700 text-white flex items-center justify-center font-black text-base shrink-0 shadow-md">
                  {currentUser.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="pr-14">
                  <h4 className="font-extrabold text-slate-900 text-base leading-tight">
                    {currentUser.shopName}
                  </h4>
                  <p className="text-xs font-semibold text-indigo-900 mt-0.5">
                    {currentUser.name}
                  </p>
                  {currentUser.email ? (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="break-all">{currentUser.email}</span>
                    </div>
                  ) : currentUser.phone ? (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>+91 {currentUser.phone}</span>
                    </div>
                  ) : null}
                  {currentUser.upiId && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono text-[11px]">{currentUser.upiId}</span>
                    </div>
                  )}
                  {currentUser.address && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{currentUser.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick stats for this user */}
              <div className="mt-3.5 pt-3 border-t border-indigo-200/60 grid grid-cols-2 gap-2 text-center">
                <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-xs">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">{t.customers}</div>
                  <div className="text-base font-black text-slate-800 flex items-center justify-center gap-1">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>{customers.length}</span>
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-xs">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">{t.totalDue}</div>
                  <div className="text-base font-black text-red-600">
                    {formatCurrency(totalDue)}
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Guarantee Banner */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-2 text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-medium">
                {t.privacyGuarantee}
              </span>
            </div>

            {/* Account Actions */}
            <div className="space-y-2 pt-1">
              {/* Logout Button */}
              <button
                onClick={logout}
                className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <LogOut className="w-4 h-4 text-slate-600" />
                <span>{t.logout}</span>
              </button>

              {/* Delete Account Button */}
              <button
                onClick={() => setIsConfirmingDelete(true)}
                className="w-full py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Trash2 className="w-4 h-4 text-rose-500" />
                <span>{t.deleteStoreAccountBtn}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
