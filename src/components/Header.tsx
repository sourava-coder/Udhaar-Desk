import React, { useState } from 'react';
import { useKhata } from '../context/KhataContext';
import { Store, QrCode, Volume2, VolumeX, ShieldAlert, User as UserIcon, ChevronDown, Globe } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { AppLanguage } from '../utils/translations';

export const Header: React.FC = () => {
  const {
    shopInfo,
    currentUser,
    language,
    setLanguage,
    t,
    setIsUpiModalOpen,
    setIsUserModalOpen,
    overdueCount,
    setCurrentScreen,
  } = useKhata();

  const [isMuted, setIsMuted] = useState(sounds.getIsMuted());
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleToggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const handleSelectLang = (lang: AppLanguage) => {
    setLanguage(lang);
    setShowLangMenu(false);
  };

  return (
    <header className="shrink-0 bg-indigo-900 text-white px-2.5 sm:px-4 lg:px-8 py-2.5 sticky top-0 z-40 shadow-md border-b border-indigo-800">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-2">
        {/* Left: Brand & Shop Info */}
        <div
          className="flex min-w-0 flex-1 items-center gap-2 cursor-pointer"
          onClick={() => setCurrentScreen('home')}
        >
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-indigo-950 flex items-center justify-center font-black shadow-inner shrink-0">
            <Store className="w-4 h-4 text-indigo-950" />
          </div>
          <div className="min-w-0 truncate max-w-[130px] sm:max-w-[200px] lg:max-w-[320px]">
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-sm tracking-tight leading-none text-white">
                UdhaarDesk
              </h1>
              <span className="hidden min-[360px]:inline text-[9px] bg-indigo-700/80 text-amber-300 font-bold px-1 py-0.5 rounded border border-indigo-500/40">
                {t.appTag}
              </span>
            </div>
            <p className="text-[11px] text-indigo-200 truncate mt-0.5 font-medium leading-tight">
              {currentUser ? currentUser.shopName : shopInfo.name || t.appName}
            </p>
          </div>
        </div>

        {/* Right: Language Selector + Overdue Alert + Sound + UPI + Profile */}
        <div className="relative flex shrink-0 items-center gap-1 sm:gap-1.5">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="text-[11px] bg-indigo-800/90 hover:bg-indigo-700 border border-indigo-600/70 text-amber-300 px-1.5 sm:px-2 py-1.5 rounded-xl flex items-center gap-1 font-bold transition shadow-xs cursor-pointer"
              title="Change Language / भाषा बदलें / ଭାଷା ବଦଳାନ୍ତୁ"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {language === 'en' ? 'EN' : language === 'hi' ? 'हि' : 'ଓଡ଼ି'}
              </span>
              <ChevronDown className="hidden min-[360px]:block w-3 h-3 text-indigo-300" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-1.5 w-32 bg-slate-900 border border-indigo-700/80 rounded-2xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => handleSelectLang('en')}
                  className={`w-full text-left px-3 py-2 text-xs font-bold transition flex items-center justify-between ${
                    language === 'en'
                      ? 'bg-amber-400 text-indigo-950 font-black'
                      : 'text-slate-200 hover:bg-indigo-800'
                  }`}
                >
                  <span>English</span>
                  {language === 'en' && <span className="text-[10px]">✓</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectLang('hi')}
                  className={`w-full text-left px-3 py-2 text-xs font-bold transition flex items-center justify-between ${
                    language === 'hi'
                      ? 'bg-amber-400 text-indigo-950 font-black'
                      : 'text-slate-200 hover:bg-indigo-800'
                  }`}
                >
                  <span>हिन्दी (Hindi)</span>
                  {language === 'hi' && <span className="text-[10px]">✓</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectLang('or')}
                  className={`w-full text-left px-3 py-2 text-xs font-bold transition flex items-center justify-between ${
                    language === 'or'
                      ? 'bg-amber-400 text-indigo-950 font-black'
                      : 'text-slate-200 hover:bg-indigo-800'
                  }`}
                >
                  <span>ଓଡ଼ିଆ (Odia)</span>
                  {language === 'or' && <span className="text-[10px]">✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* Overdue Red Alert (Only after login/signup) */}
          {currentUser && overdueCount > 0 && (
            <button
              onClick={() => setCurrentScreen('reminders')}
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-2 py-1 rounded-lg animate-pulse"
              title={`${overdueCount} ${t.alerts}`}
            >
              <ShieldAlert className="w-3 h-3" />
              <span>{overdueCount}</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={handleToggleMute}
            className="p-1.5 bg-indigo-800/80 hover:bg-indigo-700 text-indigo-200 hover:text-white rounded-lg transition"
            aria-label={isMuted ? t.soundOff : t.soundOn}
            title={isMuted ? t.soundOff : t.soundOn}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-300" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-emerald-300" />
            )}
          </button>

          {/* UPI Setup: STRICTLY only visible after login / signup */}
          {currentUser && (
            <button
              onClick={() => setIsUpiModalOpen(true)}
              className="text-[11px] bg-indigo-800 hover:bg-indigo-700 border border-indigo-500/60 text-white px-2 py-1.5 rounded-xl flex items-center gap-1 font-semibold transition active:scale-95 shadow-xs"
              title={t.upiSetup}
            >
              <QrCode className="w-3 h-3 text-amber-300" />
              <span className="hidden sm:inline">UPI</span>
            </button>
          )}

          {/* User Profile button (Strictly shows current user only, NO public users list) */}
          {currentUser ? (
            <button
              onClick={() => setIsUserModalOpen(true)}
              className="flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-indigo-950 px-2 py-1 rounded-xl text-xs font-black shadow-xs transition active:scale-95 cursor-pointer border border-amber-300"
              title={t.myAccount}
              aria-label={t.myAccount}
            >
              <div className="w-5 h-5 rounded-md bg-indigo-900 text-white flex items-center justify-center text-[10px] font-bold">
                {currentUser.name[0] || 'U'}
              </div>
              <span className="text-[11px] max-w-[65px] truncate hidden sm:inline">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setIsUserModalOpen(true)}
              className="text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-1.5 rounded-xl flex items-center gap-1"
            >
              <UserIcon className="w-3 h-3" />
              <span>{t.login}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
