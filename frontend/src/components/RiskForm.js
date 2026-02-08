import React, { useState, useCallback } from 'react';
import { assessRisk } from '../api';
import { getRiskLevel, getRiskBadgeClass } from '../utils/riskUtils';

/**
 * RiskForm Component
 * Form for submitting new risk assessments with live preview
 */
function RiskForm({ onRiskAdded }) {
    const [formData, setFormData] = useState({
        asset: '',
        threat: '',
        likelihood: 3,
        impact: 3,
    });
    const [status, setStatus] = useState({ type: null, message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculated values
    const score = formData.likelihood * formData.impact;
    const level = getRiskLevel(score);

    // Handle input changes
    const handleChange = useCallback((field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: null, message: '' });

        try {
            await assessRisk(formData);
            setStatus({ type: 'success', message: 'Risk assessment submitted successfully!' });
            setFormData({ asset: '', threat: '', likelihood: 3, impact: 3 });
            onRiskAdded();

            // Clear success message after delay
            setTimeout(() => setStatus({ type: null, message: '' }), 4000);
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to submit risk assessment. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card p-6 h-full">
            <h2 className="section-title mb-5">Assess New Risk</h2>

            {/* Status Message */}
            {status.type && (
                <div
                    className={`mb-5 p-4 rounded-lg text-sm font-medium animate-slide-up ${status.type === 'success'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                >
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Asset & Threat Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="asset" className="block text-sm font-medium text-slate-700 mb-1.5">
                            Asset Name
                        </label>
                        <input
                            id="asset"
                            type="text"
                            required
                            value={formData.asset}
                            onChange={(e) => handleChange('asset', e.target.value)}
                            className="input-field"
                            placeholder="e.g., Customer Database"
                        />
                    </div>
                    <div>
                        <label htmlFor="threat" className="block text-sm font-medium text-slate-700 mb-1.5">
                            Threat Description
                        </label>
                        <input
                            id="threat"
                            type="text"
                            required
                            value={formData.threat}
                            onChange={(e) => handleChange('threat', e.target.value)}
                            className="input-field"
                            placeholder="e.g., SQL Injection Attack"
                        />
                    </div>
                </div>

                {/* Likelihood & Impact Sliders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="likelihood" className="text-sm font-medium text-slate-700">
                                Likelihood
                            </label>
                            <span className="text-lg font-bold text-brand-600">{formData.likelihood}</span>
                        </div>
                        <input
                            id="likelihood"
                            type="range"
                            min="1"
                            max="5"
                            value={formData.likelihood}
                            onChange={(e) => handleChange('likelihood', parseInt(e.target.value, 10))}
                            className="slider-track"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>Rare</span>
                            <span>Almost Certain</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="impact" className="text-sm font-medium text-slate-700">
                                Impact
                            </label>
                            <span className="text-lg font-bold text-brand-600">{formData.impact}</span>
                        </div>
                        <input
                            id="impact"
                            type="range"
                            min="1"
                            max="5"
                            value={formData.impact}
                            onChange={(e) => handleChange('impact', parseInt(e.target.value, 10))}
                            className="slider-track"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>Negligible</span>
                            <span>Catastrophic</span>
                        </div>
                    </div>
                </div>

                {/* Risk Preview */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Score</p>
                                <p className="text-2xl font-bold text-slate-800">{score}</p>
                            </div>
                            <div className="w-px h-10 bg-slate-300" />
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Level</p>
                                <span className={getRiskBadgeClass(level)}>{level}</span>
                            </div>
                        </div>
                        <div className="hidden sm:block text-right">
                            <p className="text-xs text-slate-500">Matrix Position</p>
                            <p className="text-sm font-medium text-slate-600">
                                L{formData.likelihood} × I{formData.impact}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span>Submitting...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Submit Assessment</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

export default RiskForm;
