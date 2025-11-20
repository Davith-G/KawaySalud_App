import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import HomeView from './components/HomeView';
import ChatView from './components/ChatView';
import MapView from './components/MapView';
import NaturalView from './components/NaturalView';
import AuxilioView from './components/AuxilioView';
import { ViewName } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewName>(ViewName.HOME);

  const renderView = () => {
    switch (currentView) {
      case ViewName.HOME:
        return <HomeView onChangeView={setCurrentView} />;
      case ViewName.NATURAL:
        return <NaturalView />;
      case ViewName.CHAT:
        return <ChatView />;
      case ViewName.MAP:
        return <MapView />;
      case ViewName.AUXILIO:
        return <AuxilioView />;
      default:
        return <HomeView onChangeView={setCurrentView} />;
    }
  };

  return (
    <div className="h-full w-full bg-gray-50 relative">
      {/* Global Top Bar (Except for Chat which has its own) */}
      {currentView !== ViewName.CHAT && (
        <div className="bg-gradient-to-r from-emerald-700 to-teal-600 p-4 pb-8 pt-6 shadow-sm rounded-b-[30px] relative z-0">
          <div className="flex justify-between items-center text-white">
            <div className="flex items-center space-x-3">
               <div className="bg-white p-1.5 rounded-full">
                  {/* App Logo Placeholder */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-emerald-700">
                    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                  </svg>
               </div>
               <div>
                 <h1 className="font-bold text-lg leading-none">Kawsay Salud</h1>
                 <p className="text-xs text-emerald-100 leading-tight">Comunidad y Bienestar</p>
               </div>
            </div>
            <a href="tel:911" className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center space-x-2 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 5.25V4.5z" clipRule="evenodd" />
               </svg>
               <span className="font-bold text-sm">911</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className={`relative ${currentView !== ViewName.CHAT ? '-mt-4 z-10' : ''}`}>
        {renderView()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentView={currentView} onChangeView={setCurrentView} />
    </div>
  );
};

export default App;
