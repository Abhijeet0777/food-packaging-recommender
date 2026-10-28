import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Leaf,
  DollarSign,
  Shield,
  Clock,
  Printer,
  ChevronDown,
  ChevronUp,
  XCircle,
  FileText,
  Activity,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import RadarMetricChart from './RadarMetricChart';

export default function RecommendationResults({ results, onBackToWizard }) {
  const [expandedTraceIdx, setExpandedTraceIdx] = useState(null);
  const [showDisqualified, setShowDisqualified] = useState(false);

  if (!results) return null;

  const {
    commodity,
    userPriorities,
    topRecommendations = [],
    allEvaluations = [],
    disqualifiedCount = 0
  } = results;

  const winner = topRecommendations[0];
  const runnersUp = topRecommendations.slice(1);
  const disqualifiedList = allEvaluations.filter(m => m.isDisqualified);

  const toggleTrace = (idx) => {
    setExpandedTraceIdx(expandedTraceIdx === idx ? null : idx);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm no-print">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-700">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Explainable AI Recommendations for: <span className="text-brand-700">{commodity?.name}</span>
            </h2>
            <p className="text-xs text-slate-500">
              Evaluated {allEvaluations.length} materials across 6 barrier dimensions • {topRecommendations.length} qualified recommendations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToWizard}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
          >
            ← Modify Inputs
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export Dossier</span>
          </button>
        </div>
      </div>

      {/* Main #1 Top Recommended Material Banner */}
      {winner && (
        <div className="bg-gradient-to-br from-white via-brand-50/20 to-emerald-50/40 rounded-3xl border-2 border-brand-500/40 p-6 sm:p-8 shadow-xl shadow-brand-500/5 relative overflow-hidden">
          {/* Top Rank Badge */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-600 text-white font-black text-xs uppercase tracking-wider shadow-sm">
                <Award className="w-3.5 h-3.5" />
                Rank #1 Top Recommendation
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {winner.materialCategory}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">AI Compatibility Score</div>
                <div className="text-2xl font-black text-brand-600 font-mono">
                  {winner.overallScore}%
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-700 font-black flex items-center justify-center text-xl border border-brand-300 font-mono">
                {winner.overallScore}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7 cols: Winner Details, Why Recommended & Trade-offs */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {winner.materialCode}
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1.5">
                  {winner.materialName}
                </h3>
              </div>

              {/* Subscores Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
                  <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                    <Shield className="w-3 h-3 text-blue-500" /> Preservation
                  </div>
                  <div className="text-base font-extrabold text-slate-900 mt-1 font-mono">
                    {winner.scores?.preservation}%
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
                  <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                    <Leaf className="w-3 h-3 text-emerald-500" /> Eco / Recycled
                  </div>
                  <div className="text-base font-extrabold text-slate-900 mt-1 font-mono">
                    {winner.scores?.sustainability}%
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
                  <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-amber-500" /> Cost Score
                  </div>
                  <div className="text-base font-extrabold text-slate-900 mt-1 font-mono">
                    {winner.scores?.costEfficiency}%
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
                  <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-500" /> Est. Shelf Life
                  </div>
                  <div className="text-base font-extrabold text-indigo-600 mt-1 font-mono">
                    {winner.predictedShelfLifeDays}d
                  </div>
                </div>
              </div>

              {/* Explainable AI: Why Recommended */}
              <div className="p-4 rounded-2xl bg-white border border-brand-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-800 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  <span>XAI Explanation: Why This Material Fits {commodity?.name}</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                  {winner.whyRecommended.map((reason, i) => (
                    <li key={i} className="leading-relaxed">
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Engineering Trade-offs & Caveats */}
              <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Engineering Trade-Offs & Limitations</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                  {winner.keyTradeoffs.map((caveat, i) => (
                    <li key={i} className="leading-relaxed">
                      {caveat}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Active Packaging Add-ons */}
              {winner.activePackagingAddons && winner.activePackagingAddons.length > 0 && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span>Recommended Active / Intelligent Packaging Add-Ons</span>
                  </div>
                  <ul className="text-xs text-blue-800 space-y-1">
                    {winner.activePackagingAddons.map((addon, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>{addon}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right 5 cols: Radar Chart & Shelf Life Projection */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
                  <span>Barrier Performance Comparison</span>
                  <span className="text-[10px] text-slate-500 font-normal">Top 3 Candidates</span>
                </h4>
                <RadarMetricChart topRecommendations={topRecommendations} />
              </div>

              {/* Shelf Life Comparative Metric */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">Target vs. Projected Shelf-Life</span>
                  <span className="text-brand-400 font-mono">
                    +{Math.round(((winner.predictedShelfLifeDays - (commodity?.targetShelfLifeDays || 30)) / (commodity?.targetShelfLifeDays || 30)) * 100)}%
                  </span>
                </div>
                <div className="flex items-center justify-between font-mono">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block">Baseline Target</span>
                    <span className="text-xl font-bold text-slate-300">{commodity?.targetShelfLifeDays || 30} Days</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-brand-400" />
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-brand-400 block">Predicted with {winner.materialCode}</span>
                    <span className="text-2xl font-black text-brand-400">{winner.predictedShelfLifeDays} Days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Runner Up Options (#2, #3, #4, #5) */}
      {runnersUp.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Alternative Viable Packaging Materials ({runnersUp.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {runnersUp.map((rec, index) => {
              const isTraceExpanded = expandedTraceIdx === index;
              return (
                <div
                  key={rec.materialId}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-xs font-bold text-slate-700">
                          #{rec.rank}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {rec.materialCode}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-400">Score:</span>
                        <span className="font-mono font-extrabold text-slate-800 text-sm">
                          {rec.overallScore}%
                        </span>
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">
                      {rec.materialName}
                    </h4>

                    {/* Quick Specs */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-500 block">Barrier</span>
                        <span className="font-bold text-slate-800 font-mono">{rec.scores?.preservation}%</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-500 block">Eco</span>
                        <span className="font-bold text-slate-800 font-mono">{rec.scores?.sustainability}%</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-500 block">Cost Index</span>
                        <span className="font-bold text-slate-800 font-mono">{rec.materialSpecs?.costIndex}/5</span>
                      </div>
                    </div>

                    {/* Reasoning Snippet */}
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {rec.whyRecommended[0]}
                    </p>
                  </div>

                  {/* Rule Trace Accordion Toggle */}
                  <div className="pt-4 mt-3 border-t border-slate-100">
                    <button
                      onClick={() => toggleTrace(index)}
                      className="w-full flex items-center justify-between text-xs font-semibold text-brand-700 hover:text-brand-800"
                    >
                      <span>Rule Activation Trace ({rec.ruleTrace?.length || 0} rules fired)</span>
                      {isTraceExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {isTraceExpanded && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-2 text-xs border border-slate-200 animate-fade-in">
                        {rec.ruleTrace?.map((rt, i) => (
                          <div key={i} className="border-b border-slate-200/60 pb-2 last:border-0 last:pb-0">
                            <div className="flex items-center justify-between font-semibold text-slate-800">
                              <span>{rt.ruleName}</span>
                              <span className={`font-mono text-[11px] px-1.5 py-0.2 rounded ${
                                rt.scoreDelta >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {rt.scoreDelta >= 0 ? `+${rt.scoreDelta}` : rt.scoreDelta}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-0.5">{rt.explanation}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Disqualified Materials Section */}
      {disqualifiedList.length > 0 && (
        <div className="bg-rose-50/50 rounded-2xl border border-rose-200 p-5">
          <div
            onClick={() => setShowDisqualified(!showDisqualified)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                <XCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900">
                  Disqualified Packaging Materials ({disqualifiedList.length})
                </h4>
                <p className="text-xs text-rose-700">
                  Strict safety & barrier constraints disqualified these materials for {commodity?.name}
                </p>
              </div>
            </div>
            <button className="text-rose-700 p-1">
              {showDisqualified ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {showDisqualified && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-rose-200/60 animate-fade-in">
              {disqualifiedList.map((dis, i) => (
                <div key={i} className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-sm text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{dis.materialName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-mono">
                      REJECTED
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    <span className="font-semibold text-rose-800">Reason: </span>
                    {dis.disqualificationReason || 'Failed critical barrier tolerance threshold.'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
