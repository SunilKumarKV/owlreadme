import { useEffect, useState, useRef, useMemo } from 'react';
import useReadmeStore from '@/stores/readme-store';
import { generateREADME } from '@/utils/markdown';
import { analyzeReadmeMarkdown } from '@/utils/readme-analyzer';

export const useBuilderPreview = () => {
  const readmeState = useReadmeStore();
  const [localMarkdown, setLocalMarkdown] = useState('');
  const prevMarkdownTextRef = useRef('');

  useEffect(() => {
    const generated = generateREADME(readmeState);
    if (generated !== prevMarkdownTextRef.current) {
      setLocalMarkdown(generated);
      prevMarkdownTextRef.current = generated;
    }
  }, [readmeState]);

  const analysisResult = useMemo(() => {
    return analyzeReadmeMarkdown(localMarkdown);
  }, [localMarkdown]);

  const handleExportAnalysisReport = () => {
    const reportText = `OWLREADME README QUALITY REPORT
Generated: ${new Date().toLocaleDateString()}
Overall Score: ${analysisResult.overallScore}/100

=========================================
CATEGORY SCORES:
=========================================
- Completeness: ${analysisResult.categories.completeness.score}/100
- Readability: ${analysisResult.categories.readability.score}/100
- Developer Branding: ${analysisResult.categories.branding.score}/100
- GitHub Presence: ${analysisResult.categories.githubPresence.score}/100
- Accessibility: ${analysisResult.categories.accessibility.score}/100

=========================================
AUDIT CHECKLIST:
=========================================
${Object.values(analysisResult.categories).flatMap((cat) => cat.items).map((item) => `- [${item.passed ? 'X' : ' '}] ${item.name} (${item.passed ? 'PASSED' : 'FAILED'} - ${item.suggestion || ''})`).join('\n')}

=========================================
RECOMMENDED ACTIONS:
=========================================
${analysisResult.suggestions.map((s) => `- ${s}`).join('\n') || 'None - Your README is perfect!'}

=========================================
RECOMMENDED TEMPLATE PRESETS:
=========================================
${analysisResult.recommendedTemplates.map((t) => `- ${t}`).join('\n')}
`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `owlreadme-analysis-report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Synchronized scrolling logic
  const editorScrollRef = useRef<HTMLTextAreaElement>(null);
  const previewScrollRef = useRef<HTMLDivElement>(null);
  const isScrollingEditor = useRef(false);
  const isScrollingPreview = useRef(false);

  const handleEditorScroll = () => {
    if (isScrollingPreview.current) return;
    isScrollingEditor.current = true;
    const editor = editorScrollRef.current;
    const preview = previewScrollRef.current;
    if (editor && preview) {
      const editorScrollable = editor.scrollHeight - editor.clientHeight;
      if (editorScrollable > 0) {
        const percentage = editor.scrollTop / editorScrollable;
        const previewScrollable = preview.scrollHeight - preview.clientHeight;
        preview.scrollTop = percentage * previewScrollable;
      }
    }
    setTimeout(() => {
      isScrollingEditor.current = false;
    }, 50);
  };

  const handlePreviewScroll = () => {
    if (isScrollingEditor.current) return;
    isScrollingPreview.current = true;
    const editor = editorScrollRef.current;
    const preview = previewScrollRef.current;
    if (editor && preview) {
      const previewScrollable = preview.scrollHeight - preview.clientHeight;
      if (previewScrollable > 0) {
        const percentage = preview.scrollTop / previewScrollable;
        const editorScrollable = editor.scrollHeight - editor.clientHeight;
        editor.scrollTop = percentage * editorScrollable;
      }
    }
    setTimeout(() => {
      isScrollingPreview.current = false;
    }, 50);
  };

  return {
    localMarkdown,
    setLocalMarkdown,
    analysisResult,
    handleExportAnalysisReport,
    editorScrollRef,
    previewScrollRef,
    handleEditorScroll,
    handlePreviewScroll,
  };
};
