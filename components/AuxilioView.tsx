import React, { useState } from 'react';
import { EMERGENCY_CONTACTS, FIRST_AID_GUIDES } from '../constants';
import { PhoneIcon } from './Icons';

const AuxilioView: React.FC = () => {
  const [openGuide, setOpenGuide] = useState<string | null>(null);

  const toggleGuide = (id: string) => {
    setOpenGuide(openGuide === id ? null : id);
  };

  return (
    <div className="p-4 pb-24 h-[calc(100vh-60px)] overflow-y-auto no-scrollbar bg-gray-50">
      
      {/* Header */}
      <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Zona de Auxilio</h2>
          <p className="text-gray-500 text-sm">Mantén la calma y sigue las instrucciones.</p>
      </div>

      {/* Emergency Contacts - Prominent Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-8">
            {EMERGENCY_CONTACTS.slice(0, 2).map((contact, idx) => (
                <a 
                    key={idx} 
                    href={`tel:${contact.number}`}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl shadow-md transition-transform active:scale-95 border ${
                        contact.type === 'general' 
                        ? 'bg-red-600 text-white border-red-700' 
                        : 'bg-blue-600 text-white border-blue-700'
                    }`}
                >
                    <div className="mb-2">
                        <PhoneIcon className="w-8 h-8" />
                    </div>
                    <span className="text-3xl font-black tracking-tighter mb-1">{contact.number}</span>
                    <span className="text-xs font-medium opacity-90 uppercase tracking-wide">{contact.name}</span>
                </a>
            ))}
            <div className="col-span-2 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex justify-between items-center">
                <div>
                    <span className="block text-lg font-bold text-slate-800">{EMERGENCY_CONTACTS[2].name}</span>
                    <span className="text-xs text-gray-500">Promotor Comunitario</span>
                </div>
                <a 
                    href={`tel:${EMERGENCY_CONTACTS[2].number}`} 
                    className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-bold flex items-center hover:bg-emerald-200 transition-colors"
                >
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    {EMERGENCY_CONTACTS[2].number}
                </a>
            </div>
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
        <span className="bg-amber-100 text-amber-600 p-1 rounded mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
            </svg>
        </span>
        Guías Rápidas
      </h3>

      {/* Visual Guides List */}
      <div className="space-y-3">
        {FIRST_AID_GUIDES.map((guide) => (
          <div key={guide.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
            <button 
              onClick={() => toggleGuide(guide.id)}
              className="w-full flex items-center text-left p-4"
            >
              {/* Circular Icon - No Image */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-2xl ${openGuide === guide.id ? 'bg-red-100' : 'bg-red-50'}`}>
                  {guide.icon}
              </div>
              
              <div className="flex-1 pl-4 pr-2 flex justify-between items-center">
                  <span className="font-bold text-slate-800 text-base">{guide.title}</span>
                  
                  <div className={`text-gray-400 transition-transform duration-300 ${openGuide === guide.id ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
              </div>
            </button>
            
            {/* Expandable Content */}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openGuide === guide.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-4 pt-0 bg-white">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">Pasos a seguir:</h4>
                        <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed font-medium">
                            {guide.content}
                        </p>
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-8 mb-4">
        Esta información es una guía básica. Llame al 911 ante cualquier duda grave.
      </p>
    </div>
  );
};

export default AuxilioView;