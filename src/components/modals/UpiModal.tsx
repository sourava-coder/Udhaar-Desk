import React, { useState, useEffect } from 'react';
import { useKhata } from '../../context/KhataContext';
import { X, Building2, Smartphone, Check, Sparkles } from 'lucide-react';

export const UpiModal: React.FC = () => {
  const { currentUser, shopInfo, updateShopInfo, isUpiModalOpen, setIsUpiModalOpen, showToast } = useKhata();
  const [name, setName] = useState(shopInfo.name);
  const [upiId, setUpiId] = useState(shopInfo.upiId);
  const [phone, setPhone] = useState(shopInfo.phone);

  useEffect(() => {
    if (isUpiModalOpen && currentUser) {
      setName(shopInfo.name);
      setUpiId(shopInfo.upiId);
      setPhone(shopInfo.phone);
    }
  }, [isUpiModalOpen, shopInfo, currentUser]);

  if (!isUpiModalOpen || !currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !upiId.trim()) {
      showToast('Kripya Dukaan ka Naam aur UPI ID dono bharein');
      return;
    }
    updateShopInfo({
      name: name.trim(),
      upiId: upiId.trim(),
      phone: phone.trim(),
    });
    setIsUpiModalOpen(false);
  };

  const commonHandles = ['@okhdfcbank', '@okaxis', '@paytm', '@ybl', '@upi'];

  const appendHandle = (handle: string) => {
    const prefix = upiId.includes('@') ? upiId.split('@')[0] : upiId;
    if (prefix) {
      setUpiId(`${prefix}${handle}`);
    } else {
      setUpiId(`9876543210${handle}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-800">Dukaan UPI Setup</h3>
              <p className="text-[11px] text-slate-500">Grahak seedhe ispar payment bhejenge</p>
            </div>
          </div>
          <button
            onClick={() => setIsUpiModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Dukaan / Vyapari Naam
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Gupta Kirana & General Store"
              required
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Dukaan UPI ID (VPA)
            </label>
            <div className="relative">
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. guptakirana@upi ya 9876543210@paytm"
                required
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {/* Quick UPI Handle suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[10px] text-slate-500 flex items-center mr-1">
                <Sparkles className="w-3 h-3 text-amber-500 mr-0.5" /> Suggest:
              </span>
              {commonHandles.map((handle) => (
                <button
                  type="button"
                  key={handle}
                  onClick={() => appendHandle(handle)}
                  className="text-[10px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 px-2 py-0.5 rounded-md font-mono transition"
                >
                  {handle}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Dukaan Phone Number (WhatsApp)
            </label>
            <div className="relative">
              <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 text-[11px] text-amber-900 leading-relaxed">
            💡 <strong>Kirana Tip:</strong> Yahi UPI ID grahak ke WhatsApp message aur QR code me automatic jude gi, taaki grahak 1-click me GooglePay ya PhonePe se payment kar sakein.
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsUpiModalOpen(false)}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition"
            >
              Radd Karein
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Karein</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
