import React from 'react';
import { ViewName } from '../types';
import { HomeIcon, LeafIcon, ChatIcon, MapIcon, HeartIcon } from './Icons';

interface BottomNavProps {
  currentView: ViewName;
  onChangeView: (view: ViewName) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView }) => {
  
  const navItems = [
    { id: ViewName.HOME, label: 'Inicio', icon: HomeIcon },
    { id: ViewName.NATURAL, label: 'Natural', icon: LeafIcon },
    { id: ViewName.CHAT, label: 'Chat IA', icon: ChatIcon },
    { id: ViewName.MAP, label: 'Mapa', icon: MapIcon },
    { id: ViewName.AUXILIO, label: 'Auxilio', icon: HeartIcon },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-4 pt-2 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
      <div className="flex justify-between items-end max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`flex flex-col items-center w-14 transition-colors duration-200 ${
                isActive ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`p-1 rounded-xl ${isActive ? 'bg-emerald-50' : 'bg-transparent'}`}>
                <item.icon className={`w-6 h-6 ${isActive ? 'stroke-2' : 'stroke-1.5'}`} />
              </div>
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
