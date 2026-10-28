import React from 'react';
import { X, History, Clock, ArrowRight, Award } from 'lucide-react';

export default function HistoryDrawer({ isOpen, onClose, history = [], onSelectHistoryItem }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-slate-200 text-slate-700">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recommendation History</h3>
                <p className="text-[11px] text-slate-500">Recently evaluated food items</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="p-4 overflow-y-auto space-y-3 flex-1">
            {history.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No past recommendations logged yet. Run a recommendation from the wizard!
              </div>
            ) : (
              history.map((item, idx) => {
                const topMat = item.topRecommendations?.[0];
                const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent';

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (onSelectHistoryItem) onSelectHistoryItem(item);
                      onClose();
                    }}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/30 transition-all cursor-pointer group space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 group-hover:text-brand-700">
                        {item.commodityName}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {dateStr}
                      </span>
                    </div>

                    {topMat && (
                      <div className="flex items-center justify-between text-xs bg-slate-50 group-hover:bg-white p-2 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-brand-600" />
                          <span className="font-semibold text-slate-700 truncate max-w-[200px]">
                            {topMat.materialCode || topMat.materialName}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-brand-600">
                          {topMat.overallScore}%
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
