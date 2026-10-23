import React from 'react';
import { KhataProvider, useKhata } from './context/KhataContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/screens/HomeScreen';
import { AddEntryScreen } from './components/screens/AddEntryScreen';
import { ReminderScreen } from './components/screens/ReminderScreen';
import { CustomerKhataScreen } from './components/screens/CustomerKhataScreen';
import { OwnerReportScreen } from './components/screens/OwnerReportScreen';
import { AuthScreen } from './components/screens/AuthScreen';
import { UpiModal } from './components/modals/UpiModal';
import { QrModal } from './components/modals/QrModal';
import { UserModal } from './components/modals/UserModal';
import { CheckCircle2, LoaderCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentScreen,
    toastMessage,
    currentUser,
    isAuthLoading,
    isCloudReady,
    cloudError,
  } = useKhata();

  return (
    <div className="h-dvh w-full overflow-hidden bg-slate-50 selection:bg-indigo-600 selection:text-white relative">
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-slate-50">
        <Header />

        <main id="app-content" className="app-content min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-5 md:px-7 md:py-6 xl:px-10 xl:py-8">
          <div className={`mx-auto w-full ${currentUser ? 'max-w-screen-2xl' : 'max-w-3xl'}`}>
            {isAuthLoading ? (
              <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-slate-600">
                <LoaderCircle className="h-8 w-8 animate-spin text-indigo-600" />
                <span className="text-sm font-semibold">Checking secure account...</span>
              </div>
            ) : !currentUser ? (
              <AuthScreen />
            ) : !isCloudReady ? (
              <div role="alert" className="mx-auto mt-8 max-w-xl rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-950">
                {cloudError ? (
                  <>
                    <h2 className="font-extrabold">Could not load your cloud ledger</h2>
                    <p className="mt-2 break-words">{cloudError}</p>
                    <p className="mt-2">Check the Supabase table setup and network, then refresh this page.</p>
                  </>
                ) : (
                  <div className="flex items-center gap-2 font-semibold">
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                    Loading your cloud ledger...
                  </div>
                )}
              </div>
            ) : (
              <>
                {currentScreen === 'home' && <HomeScreen />}
                {currentScreen === 'add' && <AddEntryScreen />}
                {currentScreen === 'reminders' && <ReminderScreen />}
                {currentScreen === 'customer' && <CustomerKhataScreen />}
                {currentScreen === 'reports' && <OwnerReportScreen />}
              </>
            )}
          </div>
        </main>

        {currentUser && (
          <>
            <BottomNav />
            <UpiModal />
            <QrModal />
          </>
        )}
        <UserModal />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="absolute bottom-18 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 max-w-[90%]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <KhataProvider>
      <AppContent />
    </KhataProvider>
  );
}
