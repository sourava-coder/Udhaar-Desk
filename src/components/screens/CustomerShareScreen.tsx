import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, LoaderCircle, LockKeyhole, QrCode, Store } from 'lucide-react';
import QRCode from 'qrcode';
import { Transaction } from '../../types';
import { calculateCustomerBalance, formatCurrency, generateUpiUrl } from '../../utils/khataCalculations';
import { supabase } from '../../utils/supabase';

interface CustomerShareData {
  customer: {
    name: string;
    transactions: Transaction[];
  };
  shop: {
    name: string;
    upiId: string;
  };
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

function parseShareData(value: unknown): CustomerShareData | null {
  if (!isRecord(value) || !isRecord(value.customer) || !isRecord(value.shop)) return null;

  const { customer, shop } = value;
  if (
    typeof customer.name !== 'string' ||
    !Array.isArray(customer.transactions) ||
    typeof shop.name !== 'string' ||
    typeof shop.upiId !== 'string'
  ) {
    return null;
  }

  const transactions: Transaction[] = [];
  for (const transaction of customer.transactions) {
    if (
      !isRecord(transaction) ||
      typeof transaction.id !== 'string' ||
      (transaction.type !== 'UDHAAR' && transaction.type !== 'JAMA') ||
      typeof transaction.date !== 'string' ||
      !Number.isFinite(Number(transaction.amount))
    ) {
      return null;
    }

    transactions.push({
      id: transaction.id,
      type: transaction.type,
      amount: Number(transaction.amount),
      date: transaction.date,
      items: typeof transaction.items === 'string' ? transaction.items : '',
    });
  }

  return {
    customer: { name: customer.name, transactions },
    shop: { name: shop.name, upiId: shop.upiId },
  };
}

export const CustomerShareScreen: React.FC<{ token: string }> = ({ token }) => {
  const [shareData, setShareData] = useState<CustomerShareData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showQrCode, setShowQrCode] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [qrCodeError, setQrCodeError] = useState<string | null>(null);

  useEffect(() => {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token)) {
      setErrorMessage('This ledger link is invalid or no longer available.');
      setIsLoading(false);
      return;
    }

    if (!supabase) {
      setErrorMessage('This ledger is temporarily unavailable. Please try again later.');
      setIsLoading(false);
      return;
    }

    const client = supabase;
    let isMounted = true;
    const loadShareData = async () => {
      try {
        const { data, error } = await client.rpc('get_customer_share', { p_token: token });
        if (!isMounted) return;
        if (error) {
          setErrorMessage('This ledger is temporarily unavailable. Please try again later.');
        } else {
          const parsed = parseShareData(data);
          if (parsed) {
            setShareData(parsed);
          } else {
            setErrorMessage('This ledger link is invalid or no longer available.');
          }
        }
        setIsLoading(false);
      } catch {
        if (!isMounted) return;
        setErrorMessage('This ledger is temporarily unavailable. Please try again later.');
        setIsLoading(false);
      }
    };
    void loadShareData();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const balance = shareData ? calculateCustomerBalance(shareData.customer.transactions) : 0;
  const paymentUrl =
    shareData && balance > 0 && shareData.shop.upiId
      ? generateUpiUrl({
          upiId: shareData.shop.upiId,
          merchantName: shareData.shop.name,
          amount: balance,
          note: `Bill: ${shareData.customer.name}`,
        })
      : null;

  useEffect(() => {
    if (!showQrCode || !paymentUrl) {
        setQrCodeDataUrl('');
        setQrCodeError(null);
        return;
    }

    let isMounted = true;
    void QRCode.toDataURL(paymentUrl, {
        width: 240,
        margin: 1.5,
        color: {
          dark: '#1e1b4b',
          light: '#ffffff',
        },
    })
        .then((dataUrl) => {
          if (isMounted) setQrCodeDataUrl(dataUrl);
        })
        .catch((error: unknown) => {
          if (isMounted) {
            setQrCodeError(
              `Could not create the payment QR code: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
          }
        });

    return () => {
        isMounted = false;
    };
  }, [showQrCode, paymentUrl]);

  return (
    <main className="share-page bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-xl space-y-4">
        <header className="rounded-3xl bg-indigo-950 p-5 text-white shadow-lg">
          <div className="flex items-center gap-2 text-indigo-200">
            <Store className="h-5 w-5" />
            <span className="text-sm font-bold">UdhaarDesk</span>
          </div>
          {shareData && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-indigo-200">{shareData.shop.name}</p>
              <h1 className="mt-1 text-2xl font-black">{shareData.customer.name} ka Khata</h1>
            </div>
          )}
        </header>

        {isLoading ? (
          <div className="flex min-h-48 items-center justify-center gap-3 rounded-3xl bg-white text-slate-600 shadow-sm">
            <LoaderCircle className="h-6 w-6 animate-spin text-indigo-600" />
            <span className="font-semibold">Loading ledger...</span>
          </div>
        ) : errorMessage ? (
          <div role="alert" className="flex items-start gap-3 rounded-3xl border border-amber-200 bg-white p-5 text-amber-950 shadow-sm">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <p className="text-sm font-semibold">{errorMessage}</p>
          </div>
        ) : shareData ? (
          <>
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Current balance due</p>
              <p className={`mt-1 text-3xl font-black ${balance > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                {formatCurrency(balance)}
              </p>

              {balance > 0 && paymentUrl ? (
                <div className="mt-4 space-y-3">
                  <a
                    href={paymentUrl}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-black text-white shadow-md transition hover:bg-emerald-700"
                  >
                    Pay {formatCurrency(balance)} via UPI
                  </a>
                  <button
                    type="button"
                    onClick={() => setShowQrCode((visible) => !visible)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-extrabold text-indigo-800 transition hover:bg-indigo-100"
                  >
                    <QrCode className="h-4 w-4" />
                    {showQrCode ? 'Hide UPI QR code' : 'Show UPI QR code'}
                  </button>
                  {showQrCode && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
                      {qrCodeDataUrl ? (
                        <img
                          src={qrCodeDataUrl}
                          alt={`UPI payment QR code for ${formatCurrency(balance)}`}
                          className="mx-auto h-60 w-60 max-w-full rounded-xl"
                        />
                      ) : qrCodeError ? (
                        <p role="alert" className="text-sm font-semibold text-red-700">
                          {qrCodeError}
                        </p>
                      ) : (
                        <div className="flex items-center justify-center gap-2 py-8 text-sm font-semibold text-slate-500">
                          <LoaderCircle className="h-5 w-5 animate-spin" />
                          Creating payment QR code...
                        </div>
                      )}
                      <p className="mt-2 text-xs font-semibold text-slate-500">
                        Scan with any UPI app to pay {formatCurrency(balance)}.
                      </p>
                    </div>
                  )}
                </div>
              ) : balance <= 0 ? (
                <p className="mt-3 flex items-center gap-2 text-sm font-bold text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" /> No payment is currently due.
                </p>
              ) : (
                <p className="mt-3 text-sm font-semibold text-slate-600">
                  Please contact the shop to arrange payment.
                </p>
              )}
              {balance > 0 && paymentUrl && (
                <p className="mt-2 text-center text-xs text-slate-500">
                  After paying, please tell the shopkeeper so they can update your khata.
                </p>
              )}
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="font-black text-slate-800">Ledger entries</h2>
                <span className="text-xs font-bold text-slate-500">
                  {shareData.customer.transactions.length} entries
                </span>
              </div>

              {shareData.customer.transactions.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center text-sm text-slate-500">
                  No entries in this ledger yet.
                </p>
              ) : (
                shareData.customer.transactions
                  .slice()
                  .reverse()
                  .map((transaction) => {
                    const isCredit = transaction.type === 'UDHAAR';
                    return (
                      <article
                        key={transaction.id}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-extrabold text-slate-800">
                            {transaction.items || (isCredit ? 'Credit purchase' : 'Payment received')}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-slate-500">
                            {transaction.date} · {isCredit ? 'Udhaar' : 'Jama'}
                          </p>
                        </div>
                        <p className={`shrink-0 text-sm font-black ${isCredit ? 'text-red-600' : 'text-emerald-700'}`}>
                          {isCredit ? '+' : '-'} {formatCurrency(transaction.amount)}
                        </p>
                      </article>
                    );
                  })
              )}
            </section>

            <div className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 p-3 text-center text-xs font-semibold text-slate-600">
              <LockKeyhole className="h-4 w-4 shrink-0" />
              <span>View-only ledger. Only the shopkeeper can change these entries.</span>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
};
