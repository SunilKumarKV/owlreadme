import React from 'react';

export interface QualityAnalyzerPanelProps {
  analysisResult: {
    overallScore: number;
    categories: Record<string, {
      name: string;
      score: number;
      items: { name: string; passed: boolean; severity: 'error' | 'warning' | 'info'; suggestion?: string }[];
    }>;
    missingSections: string[];
    suggestions: string[];
    recommendedTemplates: string[];
  };
  setActiveBuilderTab: (tab: 'editor' | 'marketplace' | 'community' | 'analyzer' | 'improver') => void;
  setMarketplaceSearch: (query: string) => void;
  handleExportAnalysisReport: () => void;
}

export const QualityAnalyzerPanel: React.FC<QualityAnalyzerPanelProps> = ({
  analysisResult,
  setActiveBuilderTab,
  setMarketplaceSearch,
  handleExportAnalysisReport,
}) => {
  const { overallScore, categories, recommendedTemplates } = analysisResult;

  // Color helpers based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-455 border-green-500/20 bg-green-500/5';
    if (score >= 50) return 'text-amber-600 dark:text-amber-500 border-amber-500/20 bg-amber-500/5';
    return 'text-red-600 dark:text-red-400 border-red-500/20 bg-red-500/5';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-5 text-xs text-left">
      {/* Score Overview card */}
      <div className={`p-5 rounded-xl border flex items-center justify-between gap-4 ${getScoreColor(overallScore)}`}>
        <div>
          <h4 className="text-2xs font-extrabold uppercase tracking-widest opacity-70">README Quality Score</h4>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-black">{overallScore}</span>
            <span className="text-xs font-bold opacity-60">/100</span>
          </div>
          <p className="text-[10px] font-medium mt-1.5 opacity-80">
            {overallScore >= 80 && '🎉 Excellent structure and formatting! Keep it up.'}
            {overallScore >= 50 && overallScore < 80 && '⚡ Solid start, but some key enhancements are missing.'}
            {overallScore < 50 && '⚠️ Critical layout and branding opportunities found below.'}
          </p>
        </div>
        <div className="relative flex items-center justify-center h-16 w-16 select-none flex-shrink-0">
          {/* SVG circular progress indicator */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              className="stroke-gray-200 dark:stroke-gray-800"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              className={overallScore >= 80 ? 'stroke-green-500' : overallScore >= 50 ? 'stroke-amber-500' : 'stroke-red-500'}
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 28}
              strokeDashoffset={2 * Math.PI * 28 * (1 - overallScore / 100)}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-xs font-black text-gray-800 dark:text-gray-200">{overallScore}%</span>
        </div>
      </div>

      {/* Categories Breakdown */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900/25 border border-gray-200 dark:border-gray-800/80 rounded-xl space-y-3.5">
        <h4 className="text-2xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500">Category Metrics</h4>
        <div className="space-y-2.5">
          {Object.values(categories).map((cat: any) => (
            <div key={cat.name} className="space-y-1">
              <div className="flex justify-between font-bold text-gray-600 dark:text-gray-450 text-[10px]">
                <span>{cat.name}</span>
                <span>{cat.score}/100</span>
              </div>
              <div className="h-2 w-full bg-gray-250 dark:bg-gray-805 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getScoreBarColor(cat.score)}`}
                  style={{ width: `${cat.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Templates suggestions */}
      {recommendedTemplates.length > 0 && (
        <div className="p-4 border border-blue-500/10 bg-blue-500/5 dark:bg-blue-900/5 rounded-xl space-y-2.5">
          <div>
            <h4 className="text-2xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">Branding Recommendations</h4>
            <p className="text-[10px] text-gray-450 dark:text-gray-500 mt-0.5">Apply these marketplace presets to improve your scoring index:</p>
          </div>
          <div className="flex flex-wrap gap-2 pt-0.5">
            {recommendedTemplates.map((tplName: string) => (
              <button
                key={tplName}
                onClick={() => {
                  setActiveBuilderTab('marketplace');
                  setMarketplaceSearch(tplName);
                }}
                className="px-2.5 py-1 text-2xs font-extrabold rounded-lg border border-blue-200 dark:border-blue-900/50 bg-white dark:bg-gray-950 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white cursor-pointer transition select-none flex items-center gap-1"
              >
                <span>🛍️ {tplName} Preset</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Audit Checklist & Action items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h4 className="text-2xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-550">Quality Checklist Audits</h4>
          <button
            onClick={handleExportAnalysisReport}
            className="px-2.5 py-1 text-2xs font-bold rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:bg-gray-55 dark:hover:bg-gray-900 text-gray-650 dark:text-gray-400 cursor-pointer flex items-center gap-1.5 transition select-none"
            title="Download quality evaluation report"
          >
            📥 Export Report
          </button>
        </div>

        <div className="space-y-2">
          {Object.values(categories).flatMap((cat: any) => cat.items).map((item: any, idx: number) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border flex items-start gap-3 transition ${
                item.passed
                  ? 'border-green-500/10 bg-green-500/5 text-green-700 dark:text-green-400'
                  : item.severity === 'error'
                  ? 'border-red-500/15 bg-red-500/5 text-red-700 dark:text-red-400'
                  : 'border-amber-500/10 bg-amber-500/5 text-amber-700 dark:text-amber-500'
              }`}
            >
              <span className="text-xs font-bold leading-none mt-0.5 select-none">
                {item.passed ? '✓' : item.severity === 'error' ? '🚫' : '⚠'}
              </span>
              <div>
                <span className="font-bold block text-gray-800 dark:text-gray-200">{item.name}</span>
                {!item.passed && item.suggestion && (
                  <span className="text-[10px] opacity-80 block mt-0.5">{item.suggestion}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QualityAnalyzerPanel;
