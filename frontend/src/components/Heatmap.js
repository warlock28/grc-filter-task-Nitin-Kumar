import React, { useMemo } from 'react';
import { getHeatmapCellColor } from '../utils/riskUtils';

/**
 * Heatmap Component
 * Visual 5x5 risk matrix showing risk distribution by likelihood and impact
 */
function Heatmap({ risks }) {
    // Build matrix data from risks
    const { matrix, assetsByCell } = useMemo(() => {
        const matrixData = Array.from({ length: 6 }, () => Array(6).fill(0));
        const assetsData = Array.from({ length: 6 }, () =>
            Array.from({ length: 6 }, () => [])
        );

        risks.forEach((risk) => {
            const { likelihood, impact, asset } = risk;
            if (likelihood >= 1 && likelihood <= 5 && impact >= 1 && impact <= 5) {
                matrixData[likelihood][impact] += 1;
                assetsData[likelihood][impact].push(asset);
            }
        });

        return { matrix: matrixData, assetsByCell: assetsData };
    }, [risks]);

    // Render grid rows (likelihood 5 down to 1)
    const gridRows = useMemo(() => {
        const rows = [];

        for (let likelihood = 5; likelihood >= 1; likelihood--) {
            const cells = [];

            for (let impact = 1; impact <= 5; impact++) {
                const count = matrix[likelihood][impact];
                const assets = assetsByCell[likelihood][impact];
                const bgColor = getHeatmapCellColor(likelihood, impact);

                cells.push(
                    <div
                        key={`${likelihood}-${impact}`}
                        className={`
                            relative h-14 rounded-lg flex items-center justify-center
                            text-white font-bold text-sm cursor-default
                            transition-all duration-200 hover:scale-105 hover:shadow-lg
                            ${bgColor}
                        `}
                    >
                        {count > 0 && <span>{count}</span>}

                        {/* Tooltip */}
                        {count > 0 && (
                            <div className="
                                absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                                opacity-0 pointer-events-none group-hover:opacity-100
                                transition-opacity duration-200 z-20
                            ">
                                <div className="bg-slate-800 text-white text-xs rounded-lg p-3 shadow-elevated min-w-[140px]">
                                    <p className="font-semibold border-b border-slate-600 pb-1 mb-2">
                                        {count} Risk{count > 1 ? 's' : ''}
                                    </p>
                                    <p className="text-slate-300 break-words">
                                        {assets.join(', ')}
                                    </p>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                                </div>
                            </div>
                        )}
                    </div>
                );
            }

            rows.push(
                <div key={likelihood} className="flex items-center gap-2">
                    <div className="w-6 text-center text-xs font-semibold text-slate-500">
                        {likelihood}
                    </div>
                    <div className="grid grid-cols-5 gap-2 flex-1">
                        {cells}
                    </div>
                </div>
            );
        }

        return rows;
    }, [matrix, assetsByCell]);

    return (
        <div className="card p-6 h-full">
            <h2 className="section-title mb-5">Risk Heatmap</h2>

            <div className="flex">
                {/* Y-Axis Label */}
                <div className="flex items-center justify-center w-8 -ml-2">
                    <span className="transform -rotate-90 text-xs font-semibold text-slate-500 whitespace-nowrap tracking-wide">
                        LIKELIHOOD
                    </span>
                </div>

                {/* Heatmap Grid */}
                <div className="flex-1">
                    <div className="space-y-2 mb-3">
                        {gridRows}
                    </div>

                    {/* X-Axis Labels */}
                    <div className="flex items-center gap-2 ml-8">
                        <div className="grid grid-cols-5 gap-2 flex-1">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <div key={num} className="text-center text-xs font-semibold text-slate-500">
                                    {num}
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-center mt-2 text-xs font-semibold text-slate-500 tracking-wide">
                        IMPACT
                    </p>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-emerald-500" />
                    <span className="text-xs text-slate-500">Low</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-amber-400" />
                    <span className="text-xs text-slate-500">Medium</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-orange-500" />
                    <span className="text-xs text-slate-500">High</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-red-500" />
                    <span className="text-xs text-slate-500">Critical</span>
                </div>
            </div>
        </div>
    );
}

export default Heatmap;
