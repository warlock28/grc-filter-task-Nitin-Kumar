import React from 'react';

/**
 * SummaryCards Component
 * Displays key risk metrics in a visually appealing card layout
 */
function SummaryCards({ risks }) {
    const totalRisks = risks.length;

    const highCriticalCount = risks.filter(
        (risk) => risk.level === 'High' || risk.level === 'Critical'
    ).length;

    const averageScore = totalRisks > 0
        ? (risks.reduce((sum, risk) => sum + risk.score, 0) / totalRisks).toFixed(1)
        : '0.0';

    const lowMediumCount = totalRisks - highCriticalCount;

    const cards = [
        {
            id: 'total',
            label: 'Total Risks',
            value: totalRisks,
            accent: 'border-brand-500',
            iconBg: 'bg-brand-100',
            iconColor: 'text-brand-600',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
        },
        {
            id: 'high-critical',
            label: 'High & Critical',
            value: highCriticalCount,
            accent: 'border-red-500',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
        },
        {
            id: 'low-medium',
            label: 'Low & Medium',
            value: lowMediumCount,
            accent: 'border-emerald-500',
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            id: 'average',
            label: 'Average Score',
            value: averageScore,
            accent: 'border-amber-500',
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {cards.map((card) => (
                <div
                    key={card.id}
                    className={`card border-l-4 ${card.accent} p-5 animate-fade-in`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">
                                {card.label}
                            </p>
                            <p className="text-3xl font-bold text-slate-800">
                                {card.value}
                            </p>
                        </div>
                        <div className={`${card.iconBg} ${card.iconColor} p-3 rounded-xl`}>
                            {card.icon}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SummaryCards;
