import React, { useState } from 'react';
import { Layers, Search, Filter, ShieldCheck, Leaf, DollarSign } from 'lucide-react';

export default function MaterialCatalog({ materials = [] }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(materials.map(m => m.category))];

  const filtered = materials.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.code.toLowerCase().includes(search.toLowerCase()) ||
      m.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-brand-600" />
            <h2 className="text-xl font-extrabold text-slate-900">Packaging Materials Knowledge Base</h2>
          </div>
          <p className="text-xs text-slate-500">
            Comprehensive physical, gas barrier (WVTR/OTR), recyclability, and food compliance engineering specifications.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search material or code..."
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

      {/* Grid of Materials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((mat) => (
          <div
            key={mat.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {mat.code}
                </span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-brand-50 text-brand-800 border border-brand-200">
                  {mat.category}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 mt-2">
                {mat.name}
              </h3>

              <p className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">
                {mat.description}
              </p>

              {/* Technical Barrier Grid */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">WVTR (Moisture)</span>
                  <span className="font-mono font-bold text-slate-800">{mat.wvtr} g/m²/d</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">OTR (Oxygen)</span>
                  <span className="font-mono font-bold text-slate-800">{mat.otr} cc/m²/d</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">UV Barrier</span>
                  <span className="font-mono font-bold text-slate-800">{mat.uvBarrierScore}/10</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Grease Kit</span>
                  <span className="font-mono font-bold text-slate-800">{mat.greaseResistance}/12</span>
                </div>
              </div>
            </div>

            {/* Bottom Footer: Sustainability & Cost */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-slate-600 text-[11px] truncate max-w-[140px]">
                  {mat.isBiodegradable ? 'Compostable' : mat.recyclabilityCode}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-bold text-slate-700">Cost: {mat.costIndex}/5</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
