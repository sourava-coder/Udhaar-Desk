import React, { useState } from 'react';
import { useKhata } from '../../context/KhataContext';
import {
  Store,
  LogIn,
  UserPlus,
  ShieldCheck,
  Lock,
  Mail,
  User as UserIcon,
  AlertCircle,
  Building2,
  CreditCard,
  MapPin,
  Globe,
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, signup, users, language, setLanguage, t } = useKhata();

  // Tab state: default to login if users already exist, or signup if fresh
  const [tab, setTab] = useState<'login' | 'signup'>(users.length === 0 ? 'signup' : 'login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Signup form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [shopName, setShopName] = useState('');
  const [password, setPassword] = useState('');
  const [upiId, setUpiId] = useState('');
  const [address, setAddress] = useState('');
  const [signupError, setSignupError] = useState<string | null>(null);
  const [confirmationNotice, setConfirmationNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);
    if (!loginEmail.trim()) {
      setLoginError(
        language === 'en'
          ? 'Please enter your email address.'
          : language === 'or'
          ? 'ଦୟାକରି ଆପଣଙ୍କ ଇମେଲ୍ ଠିକଣା ଦିଅନ୍ତୁ।'
          : 'कृपया अपना ईमेल पता दर्ज करें।'
      );
      setIsSubmitting(false);
      return;
    }
    try {
      const res = await login(loginEmail, loginPassword);
      if (!res.success) setLoginError(res.error || 'Login error');
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    setConfirmationNotice(null);
    setIsSubmitting(true);
    try {
      const res = await signup({
        name,
        email,
        shopName,
        password,
        upiId,
        address,
      });
      if (!res.success) {
        setSignupError(res.error || 'Signup error');
      } else if (res.message) {
        setConfirmationNotice(res.message);
        setTab('login');
      }
    } catch (error) {
      setSignupError(error instanceof Error ? error.message : 'Signup error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[600px] justify-between pb-4">
      <div className="space-y-4">
        {/* Language Selector Top Bar */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t.selectLanguage}:</span>
          </span>
          <div className="inline-flex bg-slate-200 p-0.5 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                language === 'en' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                language === 'hi' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => setLanguage('or')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                language === 'or' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              ଓଡ଼ିଆ
            </button>
          </div>
        </div>

        {/* Brand Banner */}
        <div className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 p-5 rounded-3xl text-white shadow-lg border border-indigo-800/80 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-400 text-indigo-950 font-black shadow-md mb-2">
            <Store className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black tracking-tight">{t.authHeaderTitle}</h2>
          <p className="text-xs text-indigo-200 mt-1 max-w-xs mx-auto">
            {t.authHeaderSubtitle}
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[11px] font-bold text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.authIsolatedNotice}</span>
          </div>
        </div>

        {/* Tab Switcher: Sign Up vs Login */}
        <div className="flex bg-slate-200 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setTab('signup');
              setSignupError(null);
              setConfirmationNotice(null);
            }}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'signup'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t.signupTab}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setLoginError(null);
            }}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'login'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{t.loginTab}</span>
          </button>
        </div>

        {/* SIGN UP FORM */}
        {tab === 'signup' && (
          <form
            onSubmit={handleSignup}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3"
          >
            <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <UserPlus className="w-4 h-4 text-emerald-600" />
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  {t.signupHeading}
                </h3>
                <p className="text-[10px] text-slate-400">
                  {t.signupSubheading}
                </p>
              </div>
            </div>

            {signupError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <span>{signupError}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {t.yourFullName}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder={language === 'en' ? 'e.g. Ramesh Kumar' : language === 'or' ? 'ଯଥା: ରମେଶ କୁମାର' : 'उदा: रमेश कुमार'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {t.yourShopName}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder={language === 'en' ? 'e.g. Shri Ganesh Provisions' : language === 'or' ? 'ଯଥା: ଶ୍ରୀ ଗଣେଶ ଭଣ୍ଡାର' : 'उदा: श्री गणेश प्रोविजन स्टोर'}
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {t.emailAddress}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="e.g. name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {t.securityPin}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {t.upiIdOptional}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. dukaan@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {t.shopAddressOptional}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Shop 12, Main Market"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-extrabold text-sm shadow-md hover:shadow-lg transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.signupSubmitBtn}</span>
            </button>
          </form>
        )}

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <form
            onSubmit={handleLogin}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3.5"
          >
            <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <LogIn className="w-4 h-4 text-indigo-600" />
              <h3 className="font-extrabold text-sm text-slate-900">{t.loginHeading}</h3>
            </div>

            {loginError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {confirmationNotice && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                {confirmationNotice}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {t.emailAddress}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="e.g. name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {t.securityPin}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="current-password"
                  placeholder="PIN"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-extrabold text-sm shadow-md hover:shadow-lg transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{t.loginSubmitBtn}</span>
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setTab('signup')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold hover:underline cursor-pointer"
              >
                {t.newShopkeeper}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Footer: Privacy Notice (Strictly NO download links!) */}
      <div className="mt-4">
        <p className="text-[10px] text-center text-slate-400 font-medium leading-relaxed">
          {t.privacyFooterNote}
        </p>
      </div>
    </div>
  );
};
