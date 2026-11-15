import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface FieldMapProps {
  lat: number;
  lng: number;
  areaHectares: number;
  cropName: string;
  isEditing?: boolean;
  onLocationChange?: (lat: number, lng: number) => void;
}

export const FieldMap: React.FC<FieldMapProps> = ({
  lat,
  lng,
  areaHectares,
  cropName,
  isEditing = false,
  onLocationChange
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const polygonRef = useRef<L.Polygon | null>(null);

  // Compute realistic field boundary coordinates based on area in hectares
  const computePolygon = (centerLat: number, centerLng: number, hectares: number): L.LatLngTuple[] => {
    // 1 hectare = 10,000 sq m. Square parcel approx: side = sqrt(area * 10000)
    const sideMeters = Math.sqrt(Math.max(0.5, hectares) * 10000);
    const offsetLat = sideMeters / (111000 * 2);
    const offsetLng = sideMeters / (111000 * Math.cos((centerLat * Math.PI) / 180) * 2);

    return [
      [centerLat - offsetLat, centerLng - offsetLng * 1.05],
      [centerLat - offsetLat * 0.95, centerLng + offsetLng],
      [centerLat + offsetLat, centerLng + offsetLng * 0.92],
      [centerLat + offsetLat * 1.02, centerLng - offsetLng * 0.98]
    ];
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: true,
        attributionControl: false
      });

      // Esri World Imagery satellite basemap
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19
      }).addTo(map);

      // Polygon
      const initialCoords = computePolygon(lat, lng, areaHectares);
      const polygon = L.polygon(initialCoords, {
        color: '#10b981',
        weight: 3,
        fillColor: '#10b981',
        fillOpacity: 0.35,
        dashArray: '5, 5'
      }).addTo(map);
      polygonRef.current = polygon;

      // Custom Pin Marker
      const customIcon = L.divIcon({
        className: 'custom-pin',
        html: `<div style="background-color: #1b6e47; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2.5px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); cursor: pointer;">🌱</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([lat, lng], {
        icon: customIcon,
        draggable: isEditing
      }).addTo(map);

      marker.bindPopup(`<b>${cropName} Parcel</b><br/>${areaHectares} Hectares (${(areaHectares * 2.47).toFixed(1)} acres)`);
      markerRef.current = marker;

      // Drag listener
      marker.on('dragend', (e: any) => {
        const newPos = e.target.getLatLng();
        onLocationChange?.(parseFloat(newPos.lat.toFixed(5)), parseFloat(newPos.lng.toFixed(5)));
      });

      // Click on map to relocate
      map.on('click', (e: L.LeafletMouseEvent) => {
        const clickedLat = parseFloat(e.latlng.lat.toFixed(5));
        const clickedLng = parseFloat(e.latlng.lng.toFixed(5));
        onLocationChange?.(clickedLat, clickedLng);
      });

      map.fitBounds(polygon.getBounds(), { padding: [30, 30] });
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
        polygonRef.current = null;
      }
    };
  }, []);

  // Update map dynamically when props change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Update marker
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      markerRef.current.setPopupContent(`<b>${cropName} Parcel</b><br/>${areaHectares} Hectares (${(areaHectares * 2.47).toFixed(1)} acres)`);
      if (isEditing) {
        markerRef.current.dragging?.enable();
      } else {
        markerRef.current.dragging?.disable();
      }
    }

    // Update polygon
    if (polygonRef.current) {
      const updatedCoords = computePolygon(lat, lng, areaHectares);
      polygonRef.current.setLatLngs(updatedCoords);
    }
  }, [lat, lng, areaHectares, cropName, isEditing]);

  return (
    <div className="relative w-full h-64 sm:h-80 rounded-3xl overflow-hidden border border-border shadow-xs">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Vigor Overlay Badge */}
      <div className="absolute top-3 left-3 z-20 bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border/80 shadow-md text-xs font-semibold flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        <span className="text-foreground">Sentinel NDVI: 0.74 (Good)</span>
      </div>

      {/* Editing Mode Instruction Badge */}
      {isEditing && (
        <div className="absolute top-3 right-3 z-20 bg-amber-500/95 text-white backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md text-xs font-bold animate-pulse flex items-center gap-1">
          <span>📍 Tap map or drag pin to relocate</span>
        </div>
      )}

      {/* Coordinates / Map attribution */}
      <div className="absolute bottom-3 left-3 z-20 bg-black/70 text-white text-[11px] px-2.5 py-1 rounded-lg font-mono flex items-center gap-2">
        <span>Lat: {lat.toFixed(4)}</span>
        <span>•</span>
        <span>Lng: {lng.toFixed(4)}</span>
      </div>

      <div className="absolute bottom-3 right-3 z-20 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md font-mono hidden sm:block">
        ESRI / Copernicus Sentinel-2
      </div>
    </div>
  );
};
