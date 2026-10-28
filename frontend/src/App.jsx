import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AtlasStatusModal from './components/AtlasStatusModal';
import HistoryDrawer from './components/HistoryDrawer';
import RecommendationWizard from './components/RecommendationWizard';
import RecommendationResults from './components/RecommendationResults';
import MaterialCatalog from './components/MaterialCatalog';
import CommodityCatalog from './components/CommodityCatalog';
import RuleExplorer from './components/RuleExplorer';
import {
  fetchHealth,
  fetchCommodities,
  fetchMaterials,
  fetchRules,
  fetchHistory,
  getRecommendations
} from './services/api';
import { Sparkles, Layers, ShieldCheck, Database, RefreshCw, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('wizard');
  const [commodities, setCommodities] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [rules, setRules] = useState([]);
  const [history, setHistory] = useState([]);
  const [dbStatus, setDbStatus] = useState({ connected: false, mode: 'loading' });

  const [recommendationResult, setRecommendationResult] = useState(null);
  const [isRecommending, setIsRecommending] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Modals
  const [isAtlasModalOpen, setIsAtlasModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  const loadAllData = async () => {
    try {
      setErrorMsg(null);
      const [healthRes, commsRes, matsRes, rulesRes, histRes] = await Promise.all([
        fetchHealth().catch(() => ({ database: { connected: false, mode: 'offline' } })),
        fetchCommodities().catch(() => []),
        fetchMaterials().catch(() => []),
        fetchRules().catch(() => []),
        fetchHistory().catch(() => [])
      ]);

      if (healthRes?.database) {
        setDbStatus(healthRes.database);
      }
      setCommodities(commsRes);
      setMaterials(matsRes);
      setRules(rulesRes);
      setHistory(histRes);
    } catch (err) {
      console.error('Failed to load initial data:', err);
      setErrorMsg(err.message);
    } finally {
      setIsLoadingInitial(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleRunRecommendation = async (payload) => {
    try {
      setIsRecommending(true);
      setErrorMsg(null);
      const output = await getRecommendations(payload);
      setRecommendationResult(output);
      setActiveTab('results');
      // Refresh history in background
      fetchHistory().then(setHistory).catch(() => {});
    } catch (err) {
      console.error('Recommendation failed:', err);
      setErrorMsg(err.message || 'Failed to generate recommendation');
    } finally {
      setIsRecommending(false);
    }
  };

  const handleSelectHistoryItem = (item) => {
    // If the history item has full recommendation results, display them directly
    if (item.topRecommendations) {
      setRecommendationResult({
        commodity: item.commodityInputs,
        userPriorities: item.userPriorities,
        topRecommendations: item.topRecommendations,
        allEvaluations: item.topRecommendations,
        disqualifiedCount: 0,
        timestamp: item.createdAt
      });
      setActiveTab('results');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dbStatus={dbStatus}
        onOpenAtlasModal={() => setIsAtlasModalOpen(true)}
        onOpenHistory={() => setIsHistoryDrawerOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-rose-600 hover:text-rose-800 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading Initial State */}
        {isLoadingInitial ? (
          <div className="py-24 text-center space-y-4">
            <div className="inline-block p-4 rounded-2xl bg-brand-50 text-brand-600 animate-spin">
              <RefreshCw className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Loading Packaging Knowledge Base & Scientific Rules...
            </h3>
            <p className="text-xs text-slate-500">
              Initializing biochemical constraints and ASTM barrier matrices
            </p>
          </div>
        ) : (
          <div>
            {/* View Switching */}
            {activeTab === 'wizard' && (
              <RecommendationWizard
                commodities={commodities}
                onRunRecommendation={handleRunRecommendation}
                isLoading={isRecommending}
              />
            )}

            {activeTab === 'results' && recommendationResult && (
              <RecommendationResults
                results={recommendationResult}
                onBackToWizard={() => setActiveTab('wizard')}
              />
            )}

            {activeTab === 'materials' && (
              <MaterialCatalog materials={materials} />
            )}

            {activeTab === 'commodities' && (
              <CommodityCatalog commodities={commodities} />
            )}

            {activeTab === 'rules' && (
              <RuleExplorer rules={rules} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">PackAI</span>
            <span>•</span>
            <span>Explainable AI (XAI) for Food Packaging Science</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>MongoDB Atlas Ready</span>
            <span>•</span>
            <span>Forward-Chaining Rule Inference</span>
            <span>•</span>
            <span>ASTM Barrier Tolerances</span>
          </div>
        </div>
      </footer>

      {/* Atlas Connection Modal */}
      <AtlasStatusModal
        isOpen={isAtlasModalOpen}
        onClose={() => setIsAtlasModalOpen(false)}
        dbStatus={dbStatus}
        onRefresh={loadAllData}
      />

      {/* History Slide-over Drawer */}
      <HistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
      />
    </div>
  );
}
