import React, { useState } from 'react';
import { MOCK_PLANTS } from '../constants';
import { getTraditionalAdvice, getPlantDetails } from '../services/geminiService';
import { Plant } from '../types';
import { LeafIcon } from './Icons';

const NaturalView: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'plants' | 'consult'>('plants');
  const [symptom, setSymptom] = useState('');
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // State for Plants Catalog
  const [searchQuery, setSearchQuery] = useState('');
  const [plants, setPlants] = useState<Plant[]>(MOCK_PLANTS);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [isSearchingPlant, setIsSearchingPlant] = useState(false);

  const handleConsult = async () => {
    if (!symptom.trim()) return;
    setLoading(true);
    setAdvice(null);
    try {
      const result = await getTraditionalAdvice(symptom);
      setAdvice(result);
    } catch (e) {
      setAdvice("Lo siento, no pude consultar en este momento.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchPlant = async () => {
      if (!searchQuery.trim()) return;

      // Filter local first
      const localResults = MOCK_PLANTS.filter(p => 
        p.nameSpanish.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.nameKichwa.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (localResults.length > 0) {
          setPlants(localResults);
          return;
      }

      // If not found locally, use AI to find it
      setIsSearchingPlant(true);
      try {
          const newPlant = await getPlantDetails(searchQuery);
          setPlants([newPlant]); // Show only the found plant
      } catch (error) {
          console.error("Error finding plant", error);
          // Fallback to show all if failed
          setPlants(MOCK_PLANTS); 
      } finally {
          setIsSearchingPlant(false);
      }
  };

  const clearSearch = () => {
      setSearchQuery('');
      setPlants(MOCK_PLANTS);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] bg-gray-50 relative">
       {/* Header */}
       <div className="bg-amber-50 p-4 sticky top-0 z-10 border-b border-amber-100 shadow-sm">
          <h2 className="text-xl font-bold text-amber-900">Medicina Natural</h2>
          <div className="flex space-x-2 mt-4">
              <button 
                onClick={() => setSelectedTab('plants')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${selectedTab === 'plants' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-amber-900 border border-amber-200'}`}
              >
                Catálogo y Recetas
              </button>
              <button 
                onClick={() => setSelectedTab('consult')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${selectedTab === 'consult' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-amber-900 border border-amber-200'}`}
              >
                Consultar Síntoma
              </button>
          </div>
       </div>

       <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-6 no-scrollbar">
          {selectedTab === 'plants' ? (
              <div className="space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchPlant()}
                        placeholder="Buscar planta (ej: Ruda, Matico)..."
                        className="w-full pl-4 pr-10 py-3 rounded-xl border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                      />
                      {searchQuery ? (
                           <button onClick={clearSearch} className="absolute right-3 top-3 text-gray-400">
                               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                 <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                               </svg>
                           </button>
                      ) : (
                        <button onClick={handleSearchPlant} className="absolute right-3 top-3 text-amber-600">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                            </svg>
                        </button>
                      )}
                  </div>

                  {isSearchingPlant && (
                      <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                          <span className="ml-2 text-amber-700 text-sm">Consultando a la abuela IA...</span>
                      </div>
                  )}

                  {!isSearchingPlant && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {plants.map(plant => (
                            <button 
                                key={plant.id} 
                                onClick={() => setSelectedPlant(plant)}
                                className="flex items-center bg-white border border-amber-100 rounded-xl p-4 shadow-sm hover:border-amber-300 transition-all active:scale-[0.99] group"
                            >
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mr-4 group-hover:bg-amber-200 transition-colors">
                                    <LeafIcon className="w-6 h-6 text-amber-600" />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="font-bold text-amber-900 text-base">{plant.nameSpanish}</h3>
                                    <p className="text-xs text-amber-600 italic">{plant.nameKichwa}</p>
                                    <p className="text-xs text-gray-500 line-clamp-1 mt-1">{plant.uses}</p>
                                </div>
                                <div className="text-amber-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </button>
                        ))}
                        {plants.length === 0 && (
                            <div className="col-span-1 sm:col-span-2 text-center text-gray-500 text-sm py-8 bg-white rounded-2xl border border-dashed border-gray-200">
                                <p>No encontré esa planta. <br/>Intenta buscar otra.</p>
                            </div>
                        )}
                    </div>
                  )}
              </div>
          ) : (
              <div className="space-y-4">
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                      <label className="block text-sm font-bold text-amber-900 mb-2">¿Qué malestar tienes?</label>
                      <textarea 
                        value={symptom}
                        onChange={(e) => setSymptom(e.target.value)}
                        placeholder="Ej: Tengo dolor de estómago y un poco de frío..."
                        className="w-full p-3 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-gray-900 bg-white placeholder-gray-400"
                        rows={3}
                      />
                      <button 
                        onClick={handleConsult}
                        disabled={loading || !symptom}
                        className="mt-3 w-full bg-amber-600 text-white font-bold py-3 rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50 shadow-md"
                      >
                        {loading ? 'Consultando Sabiduría...' : 'Buscar Remedio'}
                      </button>
                  </div>

                  {advice && (
                      <div className="bg-white p-5 rounded-2xl shadow-sm border border-amber-100 animate-fade-in">
                         <h3 className="font-bold text-lg text-amber-800 mb-3">Consejo de Kawsay</h3>
                         <div className="prose prose-sm prose-amber text-gray-700 whitespace-pre-wrap">
                            {advice}
                         </div>
                         
                         <p className="mt-4 text-xs text-gray-400 text-center border-t border-gray-100 pt-2">
                             Advertencia: Esta información es educativa. Consulta siempre a un médico profesional.
                         </p>
                      </div>
                  )}
              </div>
          )}
       </div>

       {/* Plant Details Modal Overlay */}
       {selectedPlant && (
           <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedPlant(null)}>
               <div 
                className="bg-white w-full sm:max-w-md h-[85vh] sm:h-auto sm:max-h-[85vh] rounded-t-[30px] sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-slide-up"
                onClick={e => e.stopPropagation()}
               >
                   {/* Header without Image */}
                   <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 pb-8 pt-12 relative">
                        <button 
                            onClick={() => setSelectedPlant(null)}
                            className="absolute top-4 right-4 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                               <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                           </svg>
                       </button>
                       <div className="flex items-center mb-2">
                           <div className="bg-white/20 p-2 rounded-lg mr-3">
                                <LeafIcon className="w-8 h-8 text-white" />
                           </div>
                           <div>
                                <h2 className="text-2xl font-bold text-white leading-tight">{selectedPlant.nameSpanish}</h2>
                                <p className="text-amber-100 font-medium italic text-lg">{selectedPlant.nameKichwa}</p>
                           </div>
                       </div>
                   </div>
                   
                   {/* Scrollable Content */}
                   <div className="flex-1 min-h-0 p-6 overflow-y-auto pb-40 -mt-4 bg-white rounded-t-[30px]">
                        <div className="mb-6">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                                  <path d="M10 2a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 0110 2z" />
                                  <path d="M4.5 7c.389 0 .735.187.953.478A9.487 9.487 0 0110 3.75c1.785 0 3.454.503 4.873 1.393l1.784-1.19a.75.75 0 11.833 1.248l-1.552 1.035a9.469 9.469 0 011.454 4.06c.127.036.258.077.393.122a.75.75 0 01.493.949l-1.5 4.5a.75.75 0 01-1.36-.62l.946-2.839a7.977 7.977 0 00-3.587-1.556l-1.165 3.495a.75.75 0 01-1.422-.474l1.113-3.338a8.023 8.023 0 00-4.235.09l1.385 3.462a.75.75 0 11-1.392.557l-1.278-3.195a7.98 7.98 0 00-2.98 1.26l1.035 2.588a.75.75 0 01-1.393.557l-1.163-2.907a.75.75 0 01.59-.996c.55-.12 1.077-.207 1.578-.263A2.25 2.25 0 014.5 7z" />
                                </svg>
                                Usos Principales
                            </h4>
                            <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">{selectedPlant.uses}</p>
                        </div>

                        {/* Recipe Card Style */}
                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-6 relative overflow-hidden shadow-sm">
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-amber-100 rounded-full opacity-50"></div>
                            <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center relative z-10">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-amber-600">
                                    <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                                </svg>
                                Receta Medicinal
                            </h3>
                            
                            <div className="mb-5 relative z-10">
                                <h4 className="text-sm font-bold text-amber-900 mb-2 uppercase tracking-wide text-[10px]">Ingredientes</h4>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    {selectedPlant.ingredients?.map((ing, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <span className="mr-2 text-amber-400">•</span>
                                            {ing}
                                        </li>
                                    )) || <li className="text-gray-400 italic">Información no disponible</li>}
                                </ul>
                            </div>

                            <div className="relative z-10 bg-white/60 rounded-xl p-3 backdrop-blur-sm border border-white/50">
                                <h4 className="text-sm font-bold text-amber-900 mb-2 uppercase tracking-wide text-[10px]">Preparación</h4>
                                <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                                    {selectedPlant.preparation || "Información no disponible"}
                                </p>
                            </div>
                        </div>

                        {selectedPlant.contraindications && (
                            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5">
                                    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <h4 className="text-xs font-bold text-red-800 uppercase">Contraindicaciones</h4>
                                    <p className="text-sm text-red-700 mt-1">{selectedPlant.contraindications}</p>
                                </div>
                            </div>
                        )}
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};

export default NaturalView;