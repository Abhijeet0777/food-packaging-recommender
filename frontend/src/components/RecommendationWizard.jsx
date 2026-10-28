import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  AlertCircle,
  HelpCircle,
  Thermometer,
  Droplets,
  Flame,
  Wind,
  Sun,
  Shield,
  Layers,
  CheckCircle,
  Leaf,
  DollarSign,
  Clock
} from 'lucide-react';

export default function RecommendationWizard({ commodities, onRunRecommendation, isLoading }) {
  const [mode, setMode] = useState('preset'); // 'preset' | 'custom'
  const [selectedCommodityId, setSelectedCommodityId] = useState(commodities[0]?.id || 'potato-chips');

  // Priorities
  const [priorities, setPriorities] = useState({
    shelfLife: 40,
    sustainability: 30,
    cost: 20,
    physicalProtection: 10
  });

  // Custom commodity form state
  const [customCommodity, setCustomCommodity] = useState({
    name: 'Artisan Guacamole Dip',
    category: 'Fresh Produce',
    moistureContent: 75.0,
    waterActivity: 0.95,
    fatContent: 15.0,
    fatType: 'monounsaturated',
    respirationRate: 'medium',
    lightSensitivity: 'high',
    odorTransmissionRisk: 'medium',
    targetShelfLifeDays: 30,
    storageTempC: 4,
    pH: 5.5,
    primaryFailureMode: 'oxidation', // enzymatic browning of avocado
    requiresLightBlock: true,
    nitrogenFlushingRecommended: true,
    requiresBreathingPermeability: false,
    requiresDegassingValve: false,
    requiresPunctureResistance: false,
    coldCrackResistanceRequired: false
  });

  const selectedPreset = commodities.find(c => c.id === selectedCommodityId) || commodities[0];

  const handleRun = () => {
    if (mode === 'preset') {
      onRunRecommendation({
        commodityId: selectedCommodityId,
        userPriorities: priorities
      });
    } else {
      onRunRecommendation({
        customCommodity: {
          ...customCommodity,
          id: `custom-${Date.now()}`
        },
        userPriorities: priorities
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-800 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-brand-500/20 text-brand-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                Rule-Based Inference Engine
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Food Packaging AI Recommendation Wizard
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Evaluates biological respiration rates, moisture sorption isotherms (Aw), lipid oxidation kinetics, and photo-degradation against barrier engineering rules.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="bg-slate-800 p-1 rounded-xl flex items-center border border-slate-700 self-start md:self-auto">
            <button
              onClick={() => setMode('preset')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'preset'
                  ? 'bg-brand-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pre-Configured Foods ({commodities.length})
            </button>
            <button
              onClick={() => setMode('custom')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'custom'
                  ? 'bg-brand-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Custom Food Designer
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Preset Mode Selector */}
        {mode === 'preset' ? (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Food Commodity to Package:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {commodities.map((item) => {
                const isSelected = item.id === selectedCommodityId;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedCommodityId(item.id)}
                    className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between h-28 relative ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase truncate block">
                        {item.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mt-0.5">
                        {item.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {item.targetShelfLifeDays}d Shelf
                      </span>
                    </div>
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-brand-100" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Commodity Specification Summary Card */}
            {selectedPreset && (
              <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-brand-700 uppercase tracking-wider">
                      Selected Target Commodity
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {selectedPreset.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {selectedPreset.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                      Primary Risk: {selectedPreset.primaryFailureMode.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Biochemical metrics badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-3 pt-1 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-blue-500" /> Moisture / Aw
                    </div>
                    <div className="font-bold text-slate-800 mt-1">
                      {selectedPreset.moistureContent}% ({selectedPreset.waterActivity} aw)
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-500" /> Fat Profile
                    </div>
                    <div className="font-bold text-slate-800 mt-1">
                      {selectedPreset.fatContent}% ({selectedPreset.fatType})
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Wind className="w-3 h-3 text-emerald-500" /> Respiration
                    </div>
                    <div className="font-bold text-slate-800 mt-1 uppercase">
                      {selectedPreset.respirationRate.replace('_', ' ')}
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Sun className="w-3 h-3 text-orange-500" /> Light Sensitivity
                    </div>
                    <div className="font-bold text-slate-800 mt-1 uppercase">
                      {selectedPreset.lightSensitivity}
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-rose-500" /> Storage Temp
                    </div>
                    <div className="font-bold text-slate-800 mt-1">
                      {selectedPreset.storageTempC}°C
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-indigo-500" /> Target Shelf-Life
                    </div>
                    <div className="font-bold text-slate-800 mt-1">
                      {selectedPreset.targetShelfLifeDays} Days
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Custom Commodity Designer */
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Custom Commodity Parameters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Commodity Name</label>
                <input
                  type="text"
                  value={customCommodity.name}
                  onChange={(e) => setCustomCommodity({ ...customCommodity, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={customCommodity.category}
                  onChange={(e) => setCustomCommodity({ ...customCommodity, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                >
                  <option value="Snack Foods">Snack Foods</option>
                  <option value="Fresh Produce">Fresh Produce</option>
                  <option value="Meat & Seafood">Meat & Seafood</option>
                  <option value="Dairy & Infant Nutrition">Dairy & Infant Nutrition</option>
                  <option value="Bakery & Confectionery">Bakery & Confectionery</option>
                  <option value="Dry Cereals & Grains">Dry Cereals & Grains</option>
                  <option value="Frozen Foods">Frozen Foods</option>
                  <option value="Fats & Oils">Fats & Oils</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Primary Failure Mode</label>
                <select
                  value={customCommodity.primaryFailureMode}
                  onChange={(e) => setCustomCommodity({ ...customCommodity, primaryFailureMode: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                >
                  <option value="oxidation">Lipid Oxidation / Rancidity</option>
                  <option value="microbial">Microbial / Bacterial Spoilage</option>
                  <option value="mold_growth">Mold Growth</option>
                  <option value="moisture_gain">Moisture Uptake / Crispness Loss</option>
                  <option value="staling">Staling / Retrogradation</option>
                  <option value="freezer_burn">Freezer Burn / Sublimation</option>
                  <option value="aroma_loss">Volatile Aroma Loss</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Moisture Content: {customCommodity.moistureContent}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={customCommodity.moistureContent}
                  onChange={(e) => setCustomCommodity({ ...customCommodity, moistureContent: parseFloat(e.target.value) })}
                  className="w-full accent-brand-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Water Activity (Aw): {customCommodity.waterActivity}</label>
                <input
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.01"
                  value={customCommodity.waterActivity}
                  onChange={(e) => setCustomCommodity({ ...customCommodity, waterActivity: parseFloat(e.target.value) })}
                  className="w-full accent-brand-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Fat Content: {customCommodity.fatContent}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={customCommodity.fatContent}
                  onChange={(e) => setCustomCommodity({ ...customCommodity, fatContent: parseFloat(e.target.value) })}
                  className="w-full accent-brand-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Fat Profile Type</label>
                <select
                  value={customCommodity.fatType}
                  onChange={(e) => setCustomCommodity({ ...customCommodity, fatType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="none">None</option>
                  <option value="polyunsaturated">Polyunsaturated (High Rancidity Risk)</option>
                  <option value="monounsaturated">Monounsaturated</option>
                  <option value="saturated">Saturated</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Respiration Rate</label>
                <select
                  value={customCommodity.respirationRate}
                  onChange={(e) => setCustomCommodity({ ...customCommodity, respirationRate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="none">None (Non-Living)</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="very_high">Very High (Rapid Breathing)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Light Sensitivity</label>
                <select
                  value={customCommodity.lightSensitivity}
                  onChange={(e) => setCustomCommodity({ ...customCommodity, lightSensitivity: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="low">Low (Clear Film Allowed)</option>
                  <option value="medium">Medium</option>
                  <option value="high">High (Requires UV / Amber Block)</option>
                  <option value="very_high">Very High (Requires 100% Opaque Barrier)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Storage Temperature (°C)</label>
                <input
                  type="number"
                  value={customCommodity.storageTempC}
                  onChange={(e) => setCustomCommodity({ ...customCommodity, storageTempC: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Shelf Life (Days)</label>
                <input
                  type="number"
                  value={customCommodity.targetShelfLifeDays}
                  onChange={(e) => setCustomCommodity({ ...customCommodity, targetShelfLifeDays: parseInt(e.target.value) || 30 })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>

            {/* Checkbox triggers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customCommodity.requiresLightBlock}
                  onChange={(e) => setCustomCommodity({ ...customCommodity, requiresLightBlock: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span className="font-medium text-slate-700">Light Block Essential</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customCommodity.nitrogenFlushingRecommended}
                  onChange={(e) => setCustomCommodity({ ...customCommodity, nitrogenFlushingRecommended: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span className="font-medium text-slate-700">MAP / N2 Flushing</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customCommodity.requiresBreathingPermeability}
                  onChange={(e) => setCustomCommodity({ ...customCommodity, requiresBreathingPermeability: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span className="font-medium text-slate-700">Requires Breathing Film</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customCommodity.requiresPunctureResistance}
                  onChange={(e) => setCustomCommodity({ ...customCommodity, requiresPunctureResistance: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span className="font-medium text-slate-700">Puncture Resistance</span>
              </label>
            </div>
          </div>
        )}

        {/* Multi-Criteria Optimization Priorities */}
        <div className="border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-brand-600" />
                <span>Multi-Objective Decision Priorities</span>
              </h3>
              <p className="text-xs text-slate-500">
                Adjust criteria weightings to bias the scoring algorithm towards shelf-life, sustainability, or cost.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              Total Weight: {priorities.shelfLife + priorities.sustainability + priorities.cost + priorities.physicalProtection}%
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Shelf Life */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-blue-600" /> Shelf Life & Barrier
                </span>
                <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {priorities.shelfLife}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="70"
                value={priorities.shelfLife}
                onChange={(e) => setPriorities({ ...priorities, shelfLife: parseInt(e.target.value) })}
                className="w-full accent-blue-600"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                WVTR, OTR, UV and microbial defense
              </span>
            </div>

            {/* Sustainability */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" /> Eco & Recyclability
                </span>
                <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {priorities.sustainability}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={priorities.sustainability}
                onChange={(e) => setPriorities({ ...priorities, sustainability: parseInt(e.target.value) })}
                className="w-full accent-emerald-600"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                Bio-polymers, mono-PE, composting
              </span>
            </div>

            {/* Cost Optimization */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-amber-600" /> Cost Efficiency
                </span>
                <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  {priorities.cost}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={priorities.cost}
                onChange={(e) => setPriorities({ ...priorities, cost: parseInt(e.target.value) })}
                className="w-full accent-amber-600"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                Favors economical BOPP, LDPE, paper
              </span>
            </div>

            {/* Physical Protection */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-600" /> Mechanical / Seal
                </span>
                <span className="font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                  {priorities.physicalProtection}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={priorities.physicalProtection}
                onChange={(e) => setPriorities({ ...priorities, physicalProtection: parseInt(e.target.value) })}
                className="w-full accent-purple-600"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                Puncture, tensile, cold-crack integrity
              </span>
            </div>
          </div>
        </div>

        {/* Run Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle className="w-4 h-4 text-brand-600" />
            <span>Applies forward-chaining rules and ASTM standard barrier benchmarks</span>
          </div>

          <button
            onClick={handleRun}
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-brand-500/25 transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Running Expert Inference...' : 'Generate AI Recommendations'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
