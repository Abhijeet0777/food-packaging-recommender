import React, { useState } from 'react';
import { Apple, Search, Droplets, Flame, Wind, Sun, Thermometer, Clock } from 'lucide-react';

export default function CommodityCatalog({ commodities = [] }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(commodities.map(c => c.category))];

  const filtered = commodities.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase()) ||
      c.primaryFailureMode?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Apple className="w-5 h-5 text-brand-600" />
            <h2 className="text-xl font-extrabold text-slate-900">Food Commodities Knowledge Base</h2>
          </div>
          <p className="text-xs text-slate-500">
            Biochemical profiles, water activity (Aw), respiration kinetics, and primary degradation mechanisms.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search commodity or failure mode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Commodities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {item.category}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Risk: {item.primaryFailureMode.replace('_', ' ')}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 mt-2">
                {item.name}
              </h3>

              <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              {/* Biochemical specs grid */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-blue-500" /> Moisture / Aw
                  </span>
                  <span className="font-mono font-bold text-slate-800">{item.moistureContent}% ({item.waterActivity} aw)</span>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500" /> Fat Profile
                  </span>
                  <span className="font-mono font-bold text-slate-800">{item.fatContent}% ({item.fatType})</span>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold flex items-center gap-1">
                    <Wind className="w-3 h-3 text-emerald-500" /> Respiration
                  </span>
                  <span className="font-mono font-bold text-slate-800 uppercase">{item.respirationRate}</span>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold flex items-center gap-1">
                    <Sun className="w-3 h-3 text-orange-500" /> Light Sensitivity
                  </span>
                  <span className="font-mono font-bold text-slate-800 uppercase">{item.lightSensitivity}</span>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-slate-600">
                <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                <span>{item.storageTempC}°C Storage</span>
              </div>

              <div className="flex items-center gap-1 text-slate-600 font-semibold">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>{item.targetShelfLifeDays}d Target</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
