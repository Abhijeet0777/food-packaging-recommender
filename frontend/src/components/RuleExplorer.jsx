import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, AlertTriangle, ArrowRight, BookOpen } from 'lucide-react';

export default function RuleExplorer({ rules = [] }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(rules.map(r => r.category))];

  const filtered = rules.filter(r => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.scientificExplanation.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            <h2 className="text-xl font-extrabold text-slate-900">Explainable AI Rule Base (XAI Rules)</h2>
          </div>
          <p className="text-xs text-slate-500">
            Forward-chaining production rules encoding packaging science constraints, lipid kinetics, and ASTM barrier benchmarks.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search rule or keyword..."
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

      {/* Rules List */}
      <div className="space-y-4">
        {filtered.map((rule) => (
          <div
            key={rule.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-100">
                  {rule.id}
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-brand-50 text-brand-800 border border-brand-200">
                  {rule.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-500">Priority:</span>
                <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full ${
                  rule.priority >= 90
                    ? 'bg-rose-100 text-rose-800'
                    : rule.priority >= 80
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {rule.priority}/100 {rule.priority >= 95 ? '(Hard Constraint)' : ''}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {rule.name}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {rule.description}
              </p>
            </div>

            {/* Condition & Action Logic Box */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 font-mono text-[11px] space-y-1.5">
              <div className="flex items-start gap-2">
                <span className="text-brand-700 font-bold uppercase tracking-wider shrink-0">IF:</span>
                <span className="text-slate-800 font-semibold">{rule.triggerCondition}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-700 font-bold uppercase tracking-wider shrink-0">THEN:</span>
                <span className="text-slate-700">Action: {rule.action}</span>
              </div>
            </div>

            {/* Scientific Explanation */}
            <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                <span>Scientific Justification & Chemical Rationale:</span>
              </div>
              <p className="text-emerald-800 leading-relaxed">
                {rule.scientificExplanation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
