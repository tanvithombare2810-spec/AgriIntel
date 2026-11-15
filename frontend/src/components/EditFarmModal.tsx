import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  MapPin, 
  Layers, 
  Droplets, 
  Calendar, 
  Sparkles, 
  Check, 
  Sprout,
  Compass,
  ArrowRight
} from 'lucide-react';
import { Farm } from '../types';
import { Language, translations } from '../i18n';

interface EditFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  farm: Farm;
  onSave: (updated: Partial<Farm>) => Promise<void>;
  language: Language;
}

const REGION_PRESETS = [
  {
    id: 'tamilnadu',
    label: 'Tamil Nadu (Paddy / Thanjavur)',
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    village: 'Kumbakonam',
    crop: 'paddy',
    soilType: 'clay_paddy',
    irrigationType: 'flooded_paddy',
    lat: 10.7870,
    lng: 79.1378
  },
  {
    id: 'andhra',
    label: 'Andhra Pradesh (Chilli / Guntur)',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    village: 'Tenali',
    crop: 'chilli',
    soilType: 'red_sandy_loam',
    irrigationType: 'drip',
    lat: 16.3067,
    lng: 80.4365
  },
  {
    id: 'telangana',
    label: 'Telangana (Warangal / Turmeric)',
    state: 'Telangana',
    district: 'Warangal',
    village: 'Hanamkonda',
    crop: 'paddy',
    soilType: 'clay_paddy',
    irrigationType: 'canal',
    lat: 17.9689,
    lng: 79.5941
  },
  {
    id: 'karnataka',
    label: 'Karnataka (Ragi & Paddy / Shimoga)',
    state: 'Karnataka',
    district: 'Shivamogga',
    village: 'Bhadravati',
    crop: 'ragi',
    soilType: 'red_sandy_loam',
    irrigationType: 'tank_irrigation',
    lat: 13.9299,
    lng: 75.5681
  },
  {
    id: 'maharashtra',
    label: 'Maharashtra (Soybean / Latur)',
    state: 'Maharashtra',
    district: 'Latur',
    village: 'Ausa',
    crop: 'soybean',
    soilType: 'black',
    irrigationType: 'rainfed',
    lat: 18.2333,
    lng: 76.7167
  },
  {
    id: 'north_plains',
    label: 'North India (Paddy & Wheat / Punjab)',
    state: 'Punjab',
    district: 'Ludhiana',
    village: 'Khanna',
    crop: 'wheat',
    soilType: 'alluvial',
    irrigationType: 'canal',
    lat: 30.7071,
    lng: 76.2168
  }
];

const CROPS = [
  { id: 'paddy', label: 'Paddy / Rice (भात / நெல் / ধান / వరి)', baseYield: 46.0 },
  { id: 'chilli', label: 'Chilli (मिरची / மிளகாய் / मिर्च / మిరప)', baseYield: 28.0 },
  { id: 'turmeric', label: 'Turmeric (हळद / மஞ்சள் / हल्दी / పసుపు)', baseYield: 65.0 },
  { id: 'groundnut', label: 'Groundnut (भुईमूग / வேர்க்கடலை / मूंगफली)', baseYield: 22.0 },
  { id: 'ragi', label: 'Ragi / Finger Millet (नाचणी / கேழ்வரகு / रागी)', baseYield: 26.0 },
  { id: 'soybean', label: 'Soybean (सोयाबीन)', baseYield: 18.0 },
  { id: 'cotton', label: 'Cotton (कापूस / பருத்தி / कपास)', baseYield: 22.0 },
  { id: 'tur', label: 'Tur / Arhar (तूर / துவரை / अरहर)', baseYield: 14.5 },
  { id: 'wheat', label: 'Wheat (गहू / கோதுமை / गेहूं)', baseYield: 32.0 },
  { id: 'onion', label: 'Onion (कांदा / வெங்காயம் / प्याज)', baseYield: 160.0 },
  { id: 'maize', label: 'Maize (मका / மக்காச்சோளம் / मक्का)', baseYield: 38.0 },
  { id: 'sugarcane', label: 'Sugarcane (ऊस / கரும்பு / गन्ना)', baseYield: 780.0 },
  { id: 'jowar', label: 'Jowar (ज्वारी / சோளம் / ज्वार)', baseYield: 24.0 },
  { id: 'gram', label: 'Gram / Chana (हरभरा / கொண்டைக்கடலை / चना)', baseYield: 16.5 }
];

const SOILS = [
  { id: 'clay_paddy', label: 'Wetland Clay (गाळाची चिकणमाती / களிமண்)', mult: 1.15, desc: 'Puddled Deltaic Soil for Paddy (+15%)' },
  { id: 'red_sandy_loam', label: 'Red Sandy Loam (तांबडी / செம்மண்)', mult: 0.98, desc: 'Optimal for Groundnut, Chilli & Ragi' },
  { id: 'black', label: 'Black Cotton Soil (काळी माती / नल्ल రేగడి)', mult: 1.10, desc: '+10% moisture retention' },
  { id: 'alluvial', label: 'Alluvial Loam (गाळाची सुपीक माती)', mult: 1.12, desc: '+12% high natural fertility' },
  { id: 'loamy', label: 'Medium Loamy (मध्यम पोयटा)', mult: 1.05, desc: '+5% good drainage' },
  { id: 'laterite', label: 'Laterite (जांभी माती)', mult: 0.92, desc: '-8% high leaching' },
  { id: 'sandy', label: 'Sandy (वालुकामय)', mult: 0.85, desc: '-15% rapid leaching' }
];

const IRRIGATIONS = [
  { id: 'flooded_paddy', label: 'Paddy Submersion (भातशेती तुडुंब पाणी / வயல் நீர்)', mult: 1.25, desc: 'Continuous flooded wetland (+25%)' },
  { id: 'tank_irrigation', label: 'Tank / Eri (तलाव / ஏரி பாசனம்)', mult: 1.15, desc: 'Rainwater irrigation tanks (+15%)' },
  { id: 'canal', label: 'Canal (कालवा / पाटपाणी / வாய்க்கால்)', mult: 1.15, desc: '+15% river canal supply' },
  { id: 'drip', label: 'Drip (ठिबक सिंचन / சொட்டு நீர்)', mult: 1.25, desc: '+25% precision fertigation' },
  { id: 'sprinkler', label: 'Sprinkler (तुषार सिंचन / தெளிப்பு)', mult: 1.15, desc: '+15% uniform moisture' },
  { id: 'borewell', label: 'Borewell / Well (बोअरवेल / विहीर)', mult: 1.12, desc: '+12% assured groundwater' },
  { id: 'rainfed', label: 'Rainfed (जिरायती / மானாவாரி)', mult: 1.00, desc: '100% monsoon dependent' }
];

export const EditFarmModal: React.FC<EditFarmModalProps> = ({
  isOpen,
  onClose,
  farm,
  onSave,
  language
}) => {
  const t = translations[language];

  const [name, setName] = useState(farm.name || 'Patil Farm');
  const [stateName, setStateName] = useState(farm.state || 'Maharashtra');
  const [district, setDistrict] = useState(farm.district || 'Latur');
  const [village, setVillage] = useState(farm.village || 'Ausa');
  const [crop, setCrop] = useState(farm.crop || 'soybean');
  const [areaHectares, setAreaHectares] = useState<number>(farm.areaHectares || 3.5);
  const [soilType, setSoilType] = useState(farm.soilType || 'black');
  const [irrigationType, setIrrigationType] = useState(farm.irrigationType || 'rainfed');
  const [sowingDate, setSowingDate] = useState(farm.sowingDate || '2026-06-20');
  const [lat, setLat] = useState<number>(farm.lat || 18.2333);
  const [lng, setLng] = useState<number>(farm.lng || 76.7167);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(farm.name || 'Patil Farm');
      setStateName(farm.state || 'Maharashtra');
      setDistrict(farm.district || 'Latur');
      setVillage(farm.village || 'Ausa');
      setCrop(farm.crop || 'soybean');
      setAreaHectares(farm.areaHectares || 3.5);
      setSoilType(farm.soilType || 'black');
      setIrrigationType(farm.irrigationType || 'rainfed');
      setSowingDate(farm.sowingDate || '2026-06-20');
      setLat(farm.lat || 18.2333);
      setLng(farm.lng || 76.7167);
    }
  }, [isOpen, farm]);

  if (!isOpen) return null;

  // Real-time calculation of agronomic yield and total harvest
  const selectedCrop = CROPS.find(c => c.id === crop) || CROPS[0];
  const selectedSoil = SOILS.find(s => s.id === soilType) || SOILS[0];
  const selectedIrrig = IRRIGATIONS.find(i => i.id === irrigationType) || IRRIGATIONS[0];

  const safeArea = Math.max(0.1, Number(areaHectares) || 0.1);
  const projectedYield = Math.round(selectedCrop.baseYield * selectedSoil.mult * selectedIrrig.mult * 10) / 10;
  const projectedTotalHarvest = Math.round(safeArea * projectedYield * 100) / 100;
  const acres = Math.round(safeArea * 2.471 * 10) / 10;

  const applyPreset = (preset: typeof REGION_PRESETS[0]) => {
    setStateName(preset.state);
    setDistrict(preset.district);
    setVillage(preset.village);
    setCrop(preset.crop);
    setSoilType(preset.soilType);
    setIrrigationType(preset.irrigationType);
    setLat(preset.lat);
    setLng(preset.lng);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        name,
        state: stateName,
        district,
        village,
        crop,
        commodity: crop,
        areaHectares: safeArea,
        soilType,
        irrigationType,
        sowingDate,
        lat,
        lng,
        expectedYieldQPerHa: projectedYield,
        totalHarvestQ: projectedTotalHarvest
      });
      onClose();
    } catch (err) {
      console.error('Failed to save farm edits:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div 
        className="w-full max-w-lg bg-card rounded-3xl border border-border shadow-2xl max-h-[92vh] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-farm-title"
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              🌱
            </div>
            <div>
              <h2 id="edit-farm-title" className="font-outfit font-bold text-base text-foreground leading-tight">
                Edit Farm & Agricultural Parameters
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Pan-India Regions, South Rice Paddies, Soils, Area & Mandi Intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-muted-foreground hover:text-foreground rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1 overscroll-contain">
          
          {/* Quick Regional Presets */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-primary" />
              <span>Quick Region Presets (दक्षिण व उत्तर भारत शेती)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {REGION_PRESETS.map((p) => {
                const isActive = stateName === p.state && district === p.district;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className={`px-2.5 py-1.5 rounded-xl text-left border text-[11px] transition-all cursor-pointer truncate ${
                      isActive
                        ? 'bg-primary text-white border-primary font-bold shadow-xs'
                        : 'bg-card border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Farm Basic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Farm Name (शेताचे नाव)
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs sm:text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                State (राज्य)
              </label>
              <input
                type="text"
                required
                placeholder="State (e.g. Tamil Nadu, Maharashtra)"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs sm:text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                District (जिल्हा)
              </label>
              <input
                type="text"
                required
                placeholder="District (e.g. Thanjavur, Latur)"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs sm:text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Village (गाव)
              </label>
              <input
                type="text"
                required
                placeholder="Village"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs sm:text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Active Crop Selection */}
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5 flex items-center justify-between">
              <span>Active Crop (लागवड केलेले पीक)</span>
              <span className="text-[11px] text-primary font-bold">Base: {selectedCrop.baseYield} qtl/ha</span>
            </label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-xs sm:text-sm outline-none focus:border-primary transition-colors font-medium"
            >
              {CROPS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Farm Area (Hectares + Acres) */}
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Farm Area (शेत क्षेत्र)
              </label>
              <span className="text-xs font-bold font-outfit text-primary tabular-nums">
                {areaHectares} Hectares = {acres} Acres
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0.2"
                max="50"
                step="0.1"
                required
                value={areaHectares === 0 ? '' : areaHectares}
                onChange={(e) => setAreaHectares(e.target.value === '' ? 0 : parseFloat(e.target.value))}
                className="w-28 px-3 py-2 rounded-xl border border-border bg-card text-foreground text-sm font-bold text-center outline-none focus:border-primary"
              />
              <input
                type="range"
                min="0.5"
                max="15"
                step="0.1"
                value={areaHectares}
                onChange={(e) => setAreaHectares(parseFloat(e.target.value))}
                className="flex-1 accent-primary h-2 bg-muted rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Soil Type Selector */}
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">
              Soil Type (मातीचा प्रकार - Deltaic, Sandy Loam, Black, etc.)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SOILS.map((s) => {
                const isSelected = soilType === s.id;
                return (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setSoilType(s.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary/10 border-primary text-primary font-bold shadow-xs'
                        : 'bg-card border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <p className="text-xs">{s.label}</p>
                    <span className="text-[10px] text-muted-foreground block font-normal mt-0.5">
                      {s.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Irrigation Method Selector */}
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">
              Irrigation Facility (पाणीपुरवठा - Wetland Submersion, Tank/Eri, Canal, etc.)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {IRRIGATIONS.map((i) => {
                const isSelected = irrigationType === i.id;
                return (
                  <button
                    type="button"
                    key={i.id}
                    onClick={() => setIrrigationType(i.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary/10 border-primary text-primary font-bold shadow-xs'
                        : 'bg-card border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <p className="text-xs">{i.label}</p>
                    <span className="text-[10px] text-muted-foreground block font-normal mt-0.5">
                      {i.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sowing Date Picker & Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Sowing Date (पेरणी तारीख)
              </label>
              <input
                type="date"
                required
                value={sowingDate}
                onChange={(e) => setSowingDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs sm:text-sm outline-none focus:border-primary transition-colors font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Map Coordinates (Latitude / Longitude)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value) || 18.2333)}
                  className="w-1/2 px-2.5 py-2 rounded-xl border border-border bg-card text-foreground text-xs outline-none focus:border-primary font-mono"
                  placeholder="Lat"
                />
                <input
                  type="number"
                  step="0.0001"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value) || 76.7167)}
                  className="w-1/2 px-2.5 py-2 rounded-xl border border-border bg-card text-foreground text-xs outline-none focus:border-primary font-mono"
                  placeholder="Lng"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Real-Time Output Preview */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 space-y-2">
            <div className="flex items-center gap-1.5 text-primary text-xs font-bold">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Dynamic Projection as per Edits:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-card border border-border/80">
                <span className="text-[10px] text-muted-foreground block">Projected Yield / Ha</span>
                <span className="text-sm font-extrabold font-outfit text-foreground tabular-nums">
                  {projectedYield} qtl/ha
                </span>
              </div>
              <div className="p-2 rounded-xl bg-card border border-border/80">
                <span className="text-[10px] text-muted-foreground block">Total Harvest Volume</span>
                <span className="text-sm font-extrabold font-outfit text-primary tabular-nums">
                  {projectedTotalHarvest} quintals
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving…' : 'Save & Recalculate'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFarmModal;
