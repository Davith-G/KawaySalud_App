import React, { useState, useEffect, useRef } from 'react';
import { findNearbyPlaces } from '../services/geminiService';
import { MapResult } from '../types';

// Declare Leaflet global
declare global {
  interface Window {
    L: any;
  }
}

const MapView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<MapResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);

  // Function to get current location
  const handleLocateMe = () => {
    if (!("geolocation" in navigator)) {
      setLocationError("Geolocalización no soportada.");
      if (!location) setLocation({ lat: -1.6635, lng: -78.6546 }); // Default Cruz Loma
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLoc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setLocation(newLoc);
        setIsLocating(false);

        // If map exists, fly to location
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([newLoc.lat, newLoc.lng], 15);
          
          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([newLoc.lat, newLoc.lng]);
            userMarkerRef.current.bindPopup("<b>Tú estás aquí</b>").openPopup();
          }
        }
      },
      (error) => {
        console.error("Error getting location", error);
        setLocationError("No pudimos obtener tu ubicación precisa.");
        setIsLocating(false);
        // Default to Cruz Loma / Chimborazo approximate location if no location set yet
        if (!location) {
          setLocation({ lat: -1.6635, lng: -78.6546 });
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // 1. Initial Locate on Mount
  useEffect(() => {
    handleLocateMe();
  }, []);

  // 2. Initialize Map
  useEffect(() => {
    if (!location || !mapContainerRef.current || !window.L) return;

    if (!mapInstanceRef.current) {
      // Init map
      const map = window.L.map(mapContainerRef.current, {
        zoomControl: false // We'll add zoom control manually if needed or keep it minimal
      }).setView([location.lat, location.lng], 15);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Custom Icon for User
      const userIcon = window.L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #10b981; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.3); box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = window.L.marker([location.lat, location.lng], { icon: userIcon }).addTo(map);
      marker.bindPopup("<b>Tú estás aquí</b>").openPopup();

      mapInstanceRef.current = map;
      userMarkerRef.current = marker;
    }
  }, [location]);


  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    
    try {
      const res = await findNearbyPlaces(query, location?.lat, location?.lng);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-[calc(100vh-60px)] flex flex-col bg-gray-50">
      
      {/* Map Container - Top Half */}
      <div className="h-1/2 w-full relative z-0 bg-gray-200">
        <div ref={mapContainerRef} className="w-full h-full" id="map" />
        
        {/* Floating Overlay for Title */}
        <div className="absolute top-4 left-4 z-[400] pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg inline-block border border-gray-200">
                <h2 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-emerald-600">
                        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
                    </svg>
                    Mapa de Salud
                </h2>
            </div>
        </div>

        {/* Locate Me Button */}
        <button
            onClick={handleLocateMe}
            className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg z-[400] text-emerald-700 active:bg-gray-50 hover:bg-gray-50 transition-all border border-gray-100"
            title="Mi ubicación"
        >
            {isLocating ? (
               <svg className="animate-spin w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
            ) : (
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
               </svg>
            )}
        </button>
      </div>

      {/* Search and Results - Bottom Half (Scrollable) */}
      <div className="flex-1 bg-white rounded-t-[30px] -mt-6 relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden">
        
        {/* Drag Handle Visual */}
        <div className="w-full flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
        </div>

        <div className="p-4 pb-0">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Buscar Servicios</label>
            <div className="flex gap-2 mb-2">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
                            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Centros de salud, Parteras..."
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-sm"
                    />
                </div>
                <button 
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="bg-emerald-600 text-white px-4 rounded-xl font-medium disabled:opacity-50 shadow-sm hover:bg-emerald-700 transition-colors"
                >
                    {isLoading ? (
                         <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                         </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
            </div>
            {locationError && <p className="text-xs text-orange-500 px-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-1">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                {locationError}
            </p>}
        </div>

        <div className="flex-1 overflow-y-auto p-4 pt-0 pb-24 no-scrollbar space-y-4">
             {!result && !isLoading && (
                 <div className="text-center py-8 opacity-50">
                    <p className="text-sm text-gray-500">Busca hospitales, clínicas o farmacias cercanas.</p>
                 </div>
             )}

             {result && (
                <>
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-sm text-blue-900">
                        {result.text}
                    </div>

                    {result.chunks.map((chunk, idx) => {
                        const mapData = chunk.maps;
                        if (!mapData) return null;
                        return (
                            <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-200 transition-colors group">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{mapData.title}</h4>
                                        {mapData.placeAnswerSources?.[0]?.reviewSnippets?.[0]?.content && (
                                            <p className="text-xs text-gray-500 mt-2 line-clamp-2 italic">
                                                "{mapData.placeAnswerSources[0].reviewSnippets[0].content}"
                                            </p>
                                        )}
                                    </div>
                                    <a 
                                        href={mapData.uri} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="ml-3 bg-emerald-50 text-emerald-600 p-2.5 rounded-xl hover:bg-emerald-100 transition-colors flex-shrink-0"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 01-1.676 0l-4.994-2.497a.375.375 0 00-.336 0l-3.868 1.935A1.875 1.875 0 012.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437zM9 6a.75.75 0 01.75.75V15a.75.75 0 01-1.5 0V6.75A.75.75 0 019 6zm6.75 3a.75.75 0 01.75.75v8.25a.75.75 0 01-1.5 0V9.75a.75.75 0 01.75-.75z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </>
             )}
        </div>
      </div>
    </div>
  );
};

export default MapView;