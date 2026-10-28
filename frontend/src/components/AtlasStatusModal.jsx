import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertTriangle, Copy, Check, RefreshCw, Sparkles, ExternalLink, Link2, HardDrive } from 'lucide-react';
import { seedDatabase, connectDatabase } from '../services/api';

export default function AtlasStatusModal({ isOpen, onClose, dbStatus, onRefresh }) {
  const [copied, setCopied] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState(null);

  // Connection form state
  const [inputUri, setInputUri] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState(null);
  const [connectSuccess, setConnectSuccess] = useState(null);

  if (!isOpen) return null;

  const uriSnippet = 'mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/food_packaging_db?retryWrites=true&w=majority';

  const handleCopy = () => {
    navigator.clipboard.writeText(uriSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = async (uriToUse) => {
    const targetUri = uriToUse || inputUri;
    if (!targetUri || !targetUri.trim()) {
      setConnectError('Please enter a valid MongoDB connection string.');
      return;
    }

    try {
      setConnecting(true);
      setConnectError(null);
      setConnectSuccess(null);
      const res = await connectDatabase(targetUri.trim());
      setConnectSuccess(`✅ Successfully connected to ${res.database?.host || 'MongoDB'}!`);
      if (onRefresh) onRefresh();
    } catch (err) {
      setConnectError(err.message || 'Connection failed.');
    } finally {
      setConnecting(false);
    }
  };

  const handleSeed = async () => {
    try {
      setSeeding(true);
      setSeedMessage(null);
      const res = await seedDatabase();
      setSeedMessage(`✅ Database seeded to ${res.target === 'atlas' ? 'MongoDB Atlas' : 'Local Storage'}`);
      if (onRefresh) onRefresh();
    } catch (err) {
      setSeedMessage(`❌ Error: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  const isConnected = dbStatus?.connected;
  const isAtlas = dbStatus?.mode === 'atlas';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">MongoDB Atlas Connection Manager</h2>
              <p className="text-xs text-slate-500">Live database synchronization & cloud connection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status Card */}
          <div className={`p-4 rounded-xl border flex items-start gap-4 ${
            isConnected
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/70 border-amber-200 text-amber-900'
          }`}>
            <div className="mt-0.5">
              {isConnected ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">
                  {isConnected
                    ? `Connected to MongoDB (${dbStatus.host || 'Cluster'})`
                    : 'Running in Standalone In-Memory Mode'}
                </span>
                <span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                  isConnected ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'
                }`}>
                  {dbStatus?.mode || 'local'}
                </span>
              </div>
              <p className="text-xs mt-1 text-slate-600">
                {isConnected
                  ? 'All food commodities, packaging materials, explainable rules, and recommendation logs are actively persisting in your connected database.'
                  : 'Currently operating in standalone memory mode. Paste your MongoDB connection string below to connect instantly!'}
              </p>
            </div>
          </div>

          {/* Interactive Connect Form */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Enter MongoDB Connection String (Atlas SRV or Local):
            </label>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="mongodb+srv://<username>:<password>@cluster0.mongodb.net/food_packaging_db"
                value={inputUri}
                onChange={(e) => setInputUri(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                onClick={() => handleConnect()}
                disabled={connecting}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>{connecting ? 'Connecting...' : 'Connect Now'}</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              <span className="text-slate-500 font-medium">Quick fills:</span>
              <button
                type="button"
                onClick={() => {
                  const localUri = 'mongodb://127.0.0.1:27017/food_packaging_db';
                  setInputUri(localUri);
                  handleConnect(localUri);
                }}
                className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-mono transition-colors flex items-center gap-1"
              >
                <HardDrive className="w-3 h-3 text-slate-500" />
                <span>Local MongoDB (localhost:27017)</span>
              </button>
            </div>

            {connectError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                <span className="font-bold">Error:</span> {connectError}
              </div>
            )}

            {connectSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                {connectSuccess}
              </div>
            )}
          </div>

          {/* Step-by-step Atlas Connection Guide */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span>How to Get Your MongoDB Atlas Connection String</span>
              <a
                href="https://www.mongodb.com/cloud/atlas/register"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1 font-normal"
              >
                Create Free Cluster <ExternalLink className="w-3 h-3" />
              </a>
            </h3>

            <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside pl-1">
              <li className="leading-relaxed">
                <span className="font-semibold text-slate-800">Sign in to MongoDB Atlas:</span> Create a free <strong className="text-slate-800">M0 Shared Cluster</strong> (100% free forever).
              </li>
              <li className="leading-relaxed">
                <span className="font-semibold text-slate-800">Network Access:</span> Under "Security" → "Network Access", add <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">0.0.0.0/0</code> (Allow Access from Anywhere).
              </li>
              <li className="leading-relaxed">
                <span className="font-semibold text-slate-800">Database User:</span> Under "Database Access", create a user with a password (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">food_admin</code>).
              </li>
              <li className="leading-relaxed">
                <span className="font-semibold text-slate-800">Copy Connection String:</span> Click "Connect" → "Drivers" (Node.js) and copy the SRV URI.
              </li>
              <li className="leading-relaxed">
                <span className="font-semibold text-slate-800">Connect:</span> Paste it into the input box above or into <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">backend/.env</code>!
              </li>
            </ol>

            {/* Code Snippet Box */}
            <div className="relative group bg-slate-900 text-slate-100 rounded-xl p-3 font-mono text-xs overflow-x-auto">
              <pre>{uriSnippet}</pre>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-[11px]"
                title="Copy snippet"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Database Actions */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              {seedMessage && <span className="font-medium text-slate-800">{seedMessage}</span>}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>{seeding ? 'Seeding Data...' : 'Seed Default Catalog'}</span>
              </button>
              <button
                onClick={onRefresh}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Refresh Status</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
