/**
 * Risk Utility Functions
 * Centralized logic for risk level calculations and styling
 */

/**
 * Risk level thresholds based on score (likelihood * impact)
 * Matches backend logic in logic.py
 */
export const RISK_THRESHOLDS = {
    LOW: 5,
    MEDIUM: 12,
    HIGH: 18,
};

/**
 * Get risk level from score
 * @param {number} score - Risk score (1-25)
 * @returns {string} Risk level
 */
export function getRiskLevel(score) {
    if (score <= RISK_THRESHOLDS.LOW) return 'Low';
    if (score <= RISK_THRESHOLDS.MEDIUM) return 'Medium';
    if (score <= RISK_THRESHOLDS.HIGH) return 'High';
    return 'Critical';
}

/**
 * Get CSS classes for risk level badge
 * @param {string} level - Risk level
 * @returns {string} Tailwind CSS classes
 */
export function getRiskBadgeClass(level) {
    const baseClass = 'badge';
    const levelClasses = {
        Low: 'badge-low',
        Medium: 'badge-medium',
        High: 'badge-high',
        Critical: 'badge-critical',
    };
    return `${baseClass} ${levelClasses[level] || 'badge-low'}`;
}

/**
 * Get background color class for heatmap cells
 * @param {number} likelihood - Likelihood value (1-5)
 * @param {number} impact - Impact value (1-5)
 * @returns {string} Tailwind CSS background class
 */
export function getHeatmapCellColor(likelihood, impact) {
    const score = likelihood * impact;
    if (score <= RISK_THRESHOLDS.LOW) return 'bg-emerald-500';
    if (score <= RISK_THRESHOLDS.MEDIUM) return 'bg-amber-400';
    if (score <= RISK_THRESHOLDS.HIGH) return 'bg-orange-500';
    return 'bg-red-500';
}

/**
 * Get mitigation suggestion based on risk level
 * @param {string} level - Risk level
 * @returns {string} Mitigation recommendation
 */
export function getMitigationSuggestion(level) {
    const suggestions = {
        Low: 'Monitor periodically',
        Medium: 'Develop mitigation plan',
        High: 'Prioritize action per NIST guidelines',
        Critical: 'Immediate response required',
    };
    return suggestions[level] || '';
}

/**
 * Get icon name for risk level (for use with icon libraries)
 * @param {string} level - Risk level
 * @returns {string} Icon identifier
 */
export function getRiskIcon(level) {
    const icons = {
        Low: 'check-circle',
        Medium: 'alert-triangle',
        High: 'alert-circle',
        Critical: 'x-circle',
    };
    return icons[level] || 'help-circle';
}

/**
 * Format score for display
 * @param {number} score - Risk score
 * @returns {string} Formatted score string
 */
export function formatScore(score) {
    return score.toString().padStart(2, '0');
}
