import React from 'react';

export interface AIImproverPanelProps {
  improverHistory: any[];
  handleUndoImprove: () => void;
  improverSection: 'aboutMe' | 'headerName' | 'headerTitle' | 'headerSubtitle' | 'skills' | 'projects';
  setImproverSection: (sec: 'aboutMe' | 'headerName' | 'headerTitle' | 'headerSubtitle' | 'skills' | 'projects') => void;
  setImproverAlternatives: (alts: string[]) => void;
  getCurrentImproverText: () => string;
  improverTone: string;
  setImproverTone: (tone: string) => void;
  handleRequestImprove: () => void;
  isImproving: boolean;
  improverAlternatives: string[];
  setSelectedAlternative: (alt: string) => void;
  setIsComparing: (comp: boolean) => void;
  handleApplyImprove: (alt: string) => void;
}

export const AIImproverPanel: React.FC<AIImproverPanelProps> = ({
  improverHistory,
  handleUndoImprove,
  improverSection,
  setImproverSection,
  setImproverAlternatives,
  getCurrentImproverText,
  improverTone,
  setImproverTone,
  handleRequestImprove,
  isImproving,
  improverAlternatives,
  setSelectedAlternative,
  setIsComparing,
  handleApplyImprove,
}) => {
  const originalText = getCurrentImproverText();

  return (
    <div className="space-y-5 text-xs text-left">
      {/* Undo History Banner */}
      {improverHistory.length > 0 && (
        <div className="p-3 bg-amber-550/5 border border-amber-500/15 rounded-xl flex items-center justify-between gap-3 select-none">
          <div className="space-y-0.5">
            <span className="font-bold text-amber-700 dark:text-amber-500 block">AI Modifications History</span>
            <span className="text-[10px] text-gray-405">You have made {improverHistory.length} rewrites in this session.</span>
          </div>
          <button
            onClick={handleUndoImprove}
            className="px-2.5 py-1 text-2xs font-extrabold rounded-lg border border-amber-300 dark:border-amber-900 bg-white dark:bg-gray-950 text-amber-600 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 dark:hover:text-white transition cursor-pointer flex items-center gap-1"
          >
            <span>↩ Undo Last</span>
          </button>
        </div>
      )}

      {/* Section selector & Original content */}
      <div className="space-y-3.5 p-4 bg-gray-50 dark:bg-gray-900/25 border border-gray-200 dark:border-gray-800/80 rounded-xl">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-550 block font-medium">Section to Improve</label>
          <select
            value={improverSection}
            onChange={(e) => {
              setImproverSection(e.target.value as any);
              setImproverAlternatives([]);
            }}
            className="w-full px-2 py-1.5 text-black dark:text-white rounded border border-gray-200 dark:bg-gray-800 dark:border-gray-700 focus:border-blue-500 focus:outline-none cursor-pointer font-semibold"
          >
            <option value="aboutMe">✍️ About Me</option>
            <option value="headerName">👤 Profile Name</option>
            <option value="headerTitle">💼 Professional Title</option>
            <option value="headerSubtitle">📝 Short Introduction</option>
            <option value="skills">🛠️ Skills Custom Text</option>
            <option value="projects">📂 Featured Projects Descriptions</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-550 block font-medium">Current Content</label>
          {originalText.trim() ? (
            <textarea
              readOnly
              value={originalText}
              className="w-full h-24 px-2 py-1.5 text-black dark:text-white rounded border border-gray-200 dark:bg-gray-950 dark:border-gray-850 font-mono text-[10px] bg-gray-100/50 resize-none outline-none custom-editor-scrollbar"
            />
          ) : (
            <div className="p-3 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded bg-gray-50/10 text-gray-450 italic">
              No content written in this section yet.
            </div>
          )}
        </div>
      </div>

      {/* Tone Selector */}
      <div className="space-y-3.5 p-4 bg-gray-50 dark:bg-gray-900/25 border border-gray-200 dark:border-gray-800/80 rounded-xl">
        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-550 block font-medium">Suggestion Tone</label>
        <div className="grid grid-cols-2 gap-1.5 select-none">
          {[
            'More professional',
            'More concise',
            'More technical',
            'More beginner-friendly',
            'Open-source focused',
            'Job-seeking focused',
            'Portfolio focused',
          ].map((tone) => (
            <label
              key={tone}
              className={`px-2.5 py-1.5 rounded-lg border text-[10px] cursor-pointer transition text-center flex items-center justify-center font-bold ${
                improverTone === tone
                  ? 'border-blue-200 dark:border-blue-900 bg-blue-500/5 text-blue-600 dark:text-blue-400'
                  : 'border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100/30'
              }`}
            >
              <input
                type="radio"
                name="improverTone"
                value={tone}
                checked={improverTone === tone}
                onChange={() => setImproverTone(tone)}
                className="hidden"
              />
              <span>{tone.replace(' focused', '')}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Request Action */}
      <button
        onClick={handleRequestImprove}
        disabled={isImproving || !originalText.trim()}
        className="w-full py-2.5 rounded-xl font-extrabold bg-blue-600 hover:bg-blue-700 text-white text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 select-none"
      >
        {isImproving ? (
          <>
            <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />
            <span>Analyzing & Rewriting...</span>
          </>
        ) : (
          <>
            <span>✨ Generate AI Rewrites</span>
          </>
        )}
      </button>

      {/* Alternatives Recommendations */}
      {improverAlternatives.length > 0 && !isImproving && (
        <div className="space-y-3 pt-2">
          <h4 className="text-2xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-550 font-medium">AI Suggested Alternatives</h4>
          <div className="space-y-3">
            {improverAlternatives.map((alt, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151518] space-y-3 flex flex-col">
                <p className="font-medium text-gray-700 dark:text-gray-300 leading-relaxed italic text-left">"{alt}"</p>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-850/60 mt-auto select-none">
                  <button
                    onClick={() => {
                      setSelectedAlternative(alt);
                      setIsComparing(true);
                    }}
                    className="px-2.5 py-1 text-2xs font-bold rounded-lg border border-gray-250 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-655 hover:bg-gray-55 dark:hover:bg-gray-900 transition text-center cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>🔍 Compare</span>
                  </button>
                  <button
                    onClick={() => handleApplyImprove(alt)}
                    className="px-2.5 py-1 text-2xs font-extrabold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition text-center cursor-pointer"
                  >
                    ⚡ Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIImproverPanel;
