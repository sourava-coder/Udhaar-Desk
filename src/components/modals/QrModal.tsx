import React, { useEffect, useState } from 'react';
import { useKhata } from '../../context/KhataContext';
import { calculateCustomerBalance, formatCurrency, generateUpiUrl } from '../../utils/khataCalculations';
import QRCode from 'qrcode';
import { X, Copy, ExternalLink, Check, Smartphone, ArrowDownRight } from 'lucide-react';

export const QrModal: React.FC = () => {
  const { isQrModalOpen, setIsQrModalOpen, qrModalCustomer, shopInfo, showToast, quickRecordJama } =
    useKhata();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [customAmount, setCustomAmount] = useState<number | ''>('');

  const customerBalance = qrModalCustomer
    ? Math.max(0, calculateCustomerBalance(qrModalCustomer.transactions))
    : 0;

  const currentAmount = customAmount !== '' ? Number(customAmount) : customerBalance;

  const upiUrl = generateUpiUrl({
    upiId: shopInfo.upiId,
    merchantName: shopInfo.name,
    amount: currentAmount,
    note: `Udhaar - ${qrModalCustomer?.name || 'Kirana'}`,
  });

  useEffect(() => {
    if (isQrModalOpen && qrModalCustomer) {
      setCustomAmount(customerBalance);
    }
  }, [isQrModalOpen, qrModalCustomer, customerBalance]);

  useEffect(() => {
    if (!isQrModalOpen || !shopInfo.upiId) return;

    QRCode.toDataURL(upiUrl, {
      width: 280,
      margin: 1.5,
      color: {
        dark: '#1e1b4b',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code', err));
  }, [isQrModalOpen, upiUrl, shopInfo.upiId]);

  if (!isQrModalOpen || !qrModalCustomer) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(upiUrl);
    setCopied(true);
    showToast('UPI Pay Link copy ho gaya!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkPaid = () => {
    if (currentAmount <= 0) return;
    quickRecordJama(qrModalCustomer.id, currentAmount);
    setIsQrModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-slate-200 text-center relative max-h-[95vh] overflow-y-auto">
        <button
          onClick={() => setIsQrModalOpen(false)}
          className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pt-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full mb-1">
            <Smartphone className="w-3 h-3" /> Live Counter UPI QR
          </span>
          <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
            {qrModalCustomer.name}
          </h3>
          <p className="text-xs text-slate-500">{qrModalCustomer.phone}</p>
        </div>

        {/* Amount Section */}
        <div className="my-3 bg-slate-50 border border-slate-200 rounded-2xl p-3">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">
            Rakam (Payable Amount)
          </span>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <span className="text-2xl font-black text-slate-900">₹</span>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value === '' ? '' : Number(e.target.value))}
              className="text-2xl font-black text-slate-900 text-center w-36 bg-transparent border-b-2 border-indigo-500 focus:outline-none"
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Grahak se phonepe / googlepay se scan karwayein
          </p>
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-3 rounded-2xl border-2 border-dashed border-indigo-200 inline-block shadow-sm">
          {qrCodeDataUrl ? (
            <img
              src={qrCodeDataUrl}
              alt="UPI QR Code"
              className="w-56 h-56 mx-auto rounded-xl shadow-xs"
            />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs">
              QR Code ban raha hai...
            </div>
          )}
        </div>

        {/* Supported UPI Apps logos / text */}
        <div className="mt-2 text-[11px] font-semibold text-slate-600 flex items-center justify-center gap-1.5">
          <span className="bg-slate-100 px-2 py-0.5 rounded">GPay</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded">PhonePe</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded">Paytm</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded">BHIM</span>
        </div>

        <p className="text-[11px] font-mono text-slate-500 mt-2">
          VPA: <strong className="text-slate-800">{shopInfo.upiId}</strong>
        </p>

        {/* Action Buttons */}
        <div className="space-y-2 mt-4">
          <a
            href={upiUrl}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Pay by UPI ({formatCurrency(currentAmount)})</span>
          </a>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyLink}
              className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Copy UPI Link'}</span>
            </button>

            <button
              onClick={handleMarkPaid}
              className="py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
            >
              <ArrowDownRight className="w-4 h-4 text-emerald-600" />
              <span>Jama Likhein</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
