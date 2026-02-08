import React, { useState, useEffect, useCallback } from 'react';
import { getRisks } from './api';
import RiskForm from './components/RiskForm';
import RiskTable from './components/RiskTable';
import Heatmap from './components/Heatmap';
import SummaryCards from './components/SummaryCards';

/**
 * App Component
 * Main application shell for GRC Risk Assessment Dashboard
 */
function App() {
  const [risks, setRisks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch risks from API
  const fetchRisks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getRisks();
      setRisks(response.data);
    } catch (err) {
      console.error('Failed to fetch risks:', err);
      setError('Unable to load risk data. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchRisks();
  }, [fetchRisks]);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                GRC Risk Assessment
                <span className="text-brand-400 ml-2">Dashboard</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                NIST SP 800-30 Compliant Risk Management System
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                System Online
              </div>
              <button
                onClick={fetchRisks}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 
                                         rounded-lg transition-colors duration-200 text-sm font-medium
                                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <SummaryCards risks={risks} />

        {/* Form & Heatmap Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-5">
            <RiskForm onRiskAdded={fetchRisks} />
          </div>
          <div className="lg:col-span-7">
            <Heatmap risks={risks} />
          </div>
        </div>

        {/* Risk Table */}
        <RiskTable risks={risks} onFilterChange={() => { }} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-slate-500">
            <p>GRC Risk Assessment Dashboard • Built for Enterprise Security</p>
            <p>Powered by NIST SP 800-30 Framework</p>
          </div>
        </div>
      </footer>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-elevated p-6 flex items-center gap-4">
            <svg className="animate-spin h-6 w-6 text-brand-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="font-medium text-slate-700">Loading risk data...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
