import React from 'react';
import { Package, Database, Sparkles, Sliders, Layers, Apple, ShieldCheck, History } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, dbStatus, onOpenAtlasModal, onOpenHistory }) {
  const isConnected = dbStatus?.connected;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-slate-900">PackAI</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 tracking-wide uppercase">
                Explainable AI (XAI)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Intelligent Food Packaging Material Recommendation Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('wizard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'wizard'
                ? 'bg-white text-brand-700 shadow-sm font-bold'
                : 'hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Recommender Wizard</span>
          </button>

          <button
            onClick={() => setActiveTab('materials')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'materials'
                ? 'bg-white text-brand-700 shadow-sm font-bold'
                : 'hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Materials Catalog</span>
          </button>

          <button
            onClick={() => setActiveTab('commodities')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'commodities'
                ? 'bg-white text-brand-700 shadow-sm font-bold'
                : 'hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>Food Commodities</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'rules'
                ? 'bg-white text-brand-700 shadow-sm font-bold'
                : 'hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Rule-Based AI Rules</span>
          </button>
        </nav>

        {/* Status & Actions */}
        <div className="flex items-center gap-2">
          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Recommendation History"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">History</span>
          </button>

          {/* Atlas Status Pill */}
          <button
            onClick={onOpenAtlasModal}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isConnected
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isConnected ? 'bg-emerald-400' : 'bg-amber-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isConnected ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
            </span>
            <Database className="w-3.5 h-3.5 opacity-80" />
            <span>{isConnected ? 'MongoDB Atlas' : 'Local Mode'}</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex border-t border-slate-100 px-2 py-1 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('wizard')}
          className={`flex-1 py-1.5 text-xs font-semibold text-center rounded-lg whitespace-nowrap px-2.5 ${
            activeTab === 'wizard' ? 'bg-brand-50 text-brand-700' : 'text-slate-600'
          }`}
        >
          Wizard
        </button>
        <button
          onClick={() => setActiveTab('materials')}
          className={`flex-1 py-1.5 text-xs font-semibold text-center rounded-lg whitespace-nowrap px-2.5 ${
            activeTab === 'materials' ? 'bg-brand-50 text-brand-700' : 'text-slate-600'
          }`}
        >
          Materials
        </button>
        <button
          onClick={() => setActiveTab('commodities')}
          className={`flex-1 py-1.5 text-xs font-semibold text-center rounded-lg whitespace-nowrap px-2.5 ${
            activeTab === 'commodities' ? 'bg-brand-50 text-brand-700' : 'text-slate-600'
          }`}
        >
          Commodities
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`flex-1 py-1.5 text-xs font-semibold text-center rounded-lg whitespace-nowrap px-2.5 ${
            activeTab === 'rules' ? 'bg-brand-50 text-brand-700' : 'text-slate-600'
          }`}
        >
          Rules
        </button>
      </div>
    </header>
  );
}
