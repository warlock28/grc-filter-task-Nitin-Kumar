import React, { useState, useMemo, useCallback } from 'react';
import { getRiskBadgeClass, getMitigationSuggestion } from '../utils/riskUtils';

/**
 * RiskTable Component
 * Displays risk register with sorting, filtering, search, and export functionality
 */
function RiskTable({ risks, onFilterChange }) {
    const [sortConfig, setSortConfig] = useState({ key: 'score', direction: 'desc' });
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Handle column sorting
    const handleSort = useCallback((key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    }, []);

    // Handle filter change
    const handleFilterChange = useCallback((event) => {
        const value = event.target.value;
        setFilter(value);
        if (onFilterChange) {
            onFilterChange(value);
        }
    }, [onFilterChange]);

    // Handle search input change
    const handleSearchChange = useCallback((event) => {
        setSearchQuery(event.target.value);
    }, []);

    // Filter and sort risks
    const displayedRisks = useMemo(() => {
        let filtered = filter === 'All'
            ? [...risks]
            : risks.filter((risk) => risk.level === filter);

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((risk) =>
                risk.asset.toLowerCase().includes(query) ||
                risk.threat.toLowerCase().includes(query)
            );
        }

        filtered.sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [risks, filter, searchQuery, sortConfig]);

    // Export to CSV
    const handleExport = useCallback(() => {
        const headers = ['ID', 'Asset', 'Threat', 'Likelihood', 'Impact', 'Score', 'Level'];
        const rows = displayedRisks.map((r) =>
            [r.id, `"${r.asset}"`, `"${r.threat}"`, r.likelihood, r.impact, r.score, r.level].join(',')
        );

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `risk_assessment_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();

        URL.revokeObjectURL(url);
    }, [displayedRisks]);

    // Sort indicator
    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    // Table columns configuration
    const columns = [
        { key: 'id', label: 'ID', sortable: true, width: 'w-16' },
        { key: 'asset', label: 'Asset', sortable: true },
        { key: 'threat', label: 'Threat', sortable: false },
        { key: 'likelihood', label: 'L', sortable: true, width: 'w-12', title: 'Likelihood' },
        { key: 'impact', label: 'I', sortable: true, width: 'w-12', title: 'Impact' },
        { key: 'score', label: 'Score', sortable: true, width: 'w-20' },
        { key: 'level', label: 'Level', sortable: true, width: 'w-28' },
        { key: 'action', label: 'Mitigation', sortable: false },
    ];

    return (
        <div className="card overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 border-b border-slate-100">
                <h2 className="section-title">Risk Register</h2>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 sm:flex-initial">
                    {/* Search Bar */}
                    <div className="relative flex-1 sm:flex-initial sm:w-64">
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search by asset or threat..."
                            className="input-field w-full pl-10 py-2"
                        />
                    </div>

                    {/* Export and Filter */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExport}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export CSV
                        </button>

                        <select
                            value={filter}
                            onChange={handleFilterChange}
                            className="input-field w-36 py-2"
                        >
                            <option value="All">All Levels</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                </div>
            </div>


            {/* Table */}
            <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full min-w-[700px]">
                    <thead>
                        <tr className="table-header">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    title={col.title || col.label}
                                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                                    className={`
                                        px-5 py-3 text-left ${col.width || ''}
                                        ${col.sortable ? 'cursor-pointer hover:bg-slate-100 select-none' : ''}
                                    `}
                                >
                                    <span className="flex items-center gap-1">
                                        {col.label}
                                        {col.sortable && (
                                            <span className="text-brand-600 font-bold">
                                                {getSortIndicator(col.key)}
                                            </span>
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {displayedRisks.length > 0 ? (
                            displayedRisks.map((risk) => (
                                <tr key={risk.id} className="table-row">
                                    <td className="table-cell font-medium text-slate-400">
                                        #{risk.id}
                                    </td>
                                    <td className="table-cell font-semibold text-slate-800">
                                        {risk.asset}
                                    </td>
                                    <td className="table-cell">{risk.threat}</td>
                                    <td className="table-cell text-center">{risk.likelihood}</td>
                                    <td className="table-cell text-center">{risk.impact}</td>
                                    <td className="table-cell">
                                        <span className="font-bold text-slate-800">{risk.score}</span>
                                    </td>
                                    <td className="table-cell">
                                        <span className={getRiskBadgeClass(risk.level)}>
                                            {risk.level}
                                        </span>
                                    </td>
                                    <td className="table-cell">
                                        <span className="text-slate-500 italic text-sm">
                                            {getMitigationSuggestion(risk.level)}
                                        </span>
                                        {risk.compliance_hint && (
                                            <p className="text-xs text-brand-600 mt-1">
                                                {risk.compliance_hint}
                                            </p>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-5 py-12 text-center">
                                    <div className="flex flex-col items-center text-slate-400">
                                        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="font-medium">No risks found</p>
                                        <p className="text-sm">Add a new risk assessment to get started</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            {displayedRisks.length > 0 && (
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-sm text-slate-500">
                    Showing <span className="font-semibold">{displayedRisks.length}</span> of{' '}
                    <span className="font-semibold">{risks.length}</span> risks
                </div>
            )}
        </div>
    );
}

export default RiskTable;
