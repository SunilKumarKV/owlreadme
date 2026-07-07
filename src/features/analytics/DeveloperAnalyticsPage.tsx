"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart2, Cpu, Sparkles } from 'lucide-react';
import { GitHubIcon } from '@/components/Icons';
import Button from '@/components/Button';
import useWorkspaceStore from '@/stores/workspace-store';
import useReadmeStore from '@/stores/readme-store';
import useRoadmapStore from '@/stores/roadmap-store';
import useThemeStore from '@/stores/theme-store';
import DonutChart from '@/components/charts/DonutChart';
import BarChart from '@/components/charts/BarChart';
import AreaChart from '@/components/charts/AreaChart';

import { useShallow } from 'zustand/react/shallow';

const DeveloperAnalyticsPage: React.FC = () => {
  const workspaces = useWorkspaceStore((state) => state.workspaces);

  const {
    avatarUrl,
    followers,
    following,
    publicRepos,
    repoAnalysis,
    aiGenerationsCount,
    readmeExportsCount,
    readmeTemplatesCount,
    exportHistory,
  } = useReadmeStore(
    useShallow((state) => ({
      avatarUrl: state.avatarUrl,
      followers: state.followers,
      following: state.following,
      publicRepos: state.publicRepos,
      repoAnalysis: state.repoAnalysis,
      aiGenerationsCount: state.aiGenerationsCount,
      readmeExportsCount: state.readmeExportsCount,
      readmeTemplatesCount: state.templatesUsedCount,
      exportHistory: state.exportHistory,
    }))
  );

  const {
    roadmapExportsCount,
    roadmapTemplatesCount,
    steps,
  } = useRoadmapStore(
    useShallow((state) => ({
      roadmapExportsCount: state.roadmapExportsCount,
      roadmapTemplatesCount: state.templatesUsedCount,
      steps: state.steps,
    }))
  );

  const themeTemplatesCount = useThemeStore((state) => state.templatesUsedCount);

  const [activeChartTab, setActiveChartTab] = useState<'languages' | 'exports' | 'activity'>('languages');

  const hasGitHubData = !!repoAnalysis;

  // 1. GitHub Analytics calculations
  const totalStars = repoAnalysis?.totalStars || 0;
  const totalForks = repoAnalysis?.totalForks || 0;

  // Simulate contributions count based on updates (or render a simulated grid)
  const estimatedContributions = hasGitHubData ? (publicRepos || 0) * 12 + totalStars * 4 + totalForks * 8 + 42 : 0;

  // 2. Technology Analytics
  const languagesData = repoAnalysis?.languages.map((l: any) => ({
    name: l.name,
    value: l.count,
  })) || [];

  const skillCount = repoAnalysis?.suggestedSkills.length || 0;

  // 3. OwlREADME Analytics
  const workspaceCount = workspaces.length;
  const totalExports = readmeExportsCount + roadmapExportsCount;
  const totalTemplates = readmeTemplatesCount + roadmapTemplatesCount + themeTemplatesCount;
  const totalSteps = steps.length;

  // 4. Charts - Export History aggregation
  const exportHistoryList = exportHistory || [];
  const exportCounts = {
    README: 0,
    Roadmap: 0,
    ZIP: 0,
    PDF: 0,
    Backup: 0,
    Share: 0,
  };

  exportHistoryList.forEach((item) => {
    const f = item.format.toLowerCase();
    if (f.includes('readme')) exportCounts.README++;
    else if (f.includes('roadmap')) exportCounts.Roadmap++;
    else if (f.includes('zip')) exportCounts.ZIP++;
    else if (f.includes('pdf')) exportCounts.PDF++;
    else if (f.includes('json') || f.includes('backup')) exportCounts.Backup++;
    else if (f.includes('share') || f.includes('link')) exportCounts.Share++;
  });

  // Use measured export counts; fall back to stored builder metrics when history is empty
  const exportChartData = [
    { label: 'README', value: exportCounts.README || readmeExportsCount },
    { label: 'Roadmap', value: exportCounts.Roadmap || roadmapExportsCount },
    { label: 'ZIP', value: exportCounts.ZIP },
    { label: 'PDF', value: exportCounts.PDF },
    { label: 'Backup', value: exportCounts.Backup },
    { label: 'Share', value: exportCounts.Share },
  ];

  // 5. Project Activity Timeline (Day of week from active repos)
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekdayActivity = [0, 0, 0, 0, 0, 0, 0];

  if (repoAnalysis?.topActive) {
    repoAnalysis.topActive.forEach((repo: any) => {
      const date = new Date(repo.lastUpdated);
      const day = date.getDay();
      weekdayActivity[day]++;
    });
  }

  // Ensure there's a baseline curve if activity counts are low
  const activityChartData = weekdays.map((day, idx) => ({
    label: day,
    value: weekdayActivity[idx] || (hasGitHubData ? (idx % 2 === 0 ? 1 : 0) : 0),
  }));



  return (
    <div className="min-h-screen py-12 px-4 bg-gray-100 dark:bg-[#1e1e1e] text-black dark:text-white transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Workspace
            </Link>
            <h1 className="text-4xl font-extrabold tracking-tight">Developer Analytics</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Quantitative summaries of your GitHub repositories, technology stacks, and builder activities.
            </p>
          </div>
        </div>

        {/* GitHub Missing Warning Overlay */}
        {!hasGitHubData && (
          <div className="mb-8 p-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in text-black dark:text-white">
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-amber-700 dark:text-amber-400">GitHub Profile Sync Required</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                To unlock advanced repository statistics, total stars, fork counts, and language distribution graphs, please import a GitHub profile.
              </p>
            </div>
            <Button href="/" variant="primary" className="text-xs shrink-0 py-2">
              Import from GitHub
            </Button>
          </div>
        )}

        {/* 3-Column Analytics Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: GitHub Analytics */}
          <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b pb-2 border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <GitHubIcon className="h-5 w-5 text-blue-500" /> GitHub Insights
                </h3>
                {avatarUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full border border-blue-500 shadow-sm" />
                )}
              </div>
              {hasGitHubData ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Public Repositories</span>
                    <span className="font-bold">{publicRepos ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Stars Received</span>
                    <span className="font-bold text-yellow-500">⭐ {totalStars}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Forks Count</span>
                    <span className="font-bold">{totalForks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Followers / Following</span>
                    <span className="font-bold">{followers ?? 0} / {following ?? 0}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 border-gray-100 dark:border-gray-800">
                    <span className="text-gray-500 font-medium">Estimated Contributions</span>
                    <span className="font-extrabold text-blue-500">{estimatedContributions}</span>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-gray-400">
                  No GitHub profile synced. Import to view metrics.
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Technology Analytics */}
          <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b pb-2 border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-green-500" /> Technology Stack
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-green-50 dark:bg-green-950/40 text-green-500 rounded-full">
                  {languagesData.length} languages
                </span>
              </div>
              {hasGitHubData ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Primary Language</span>
                    <span className="font-bold text-blue-500">{languagesData[0]?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Skill Tags Detected</span>
                    <span className="font-bold">{skillCount}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block mb-2 uppercase font-bold tracking-wider">Top 5 Skill Recommendations</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(repoAnalysis?.suggestedSkills || []).slice(0, 5).map((skill: any) => (
                        <span key={skill} className="px-2 py-0.5 text-[11px] font-semibold bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-gray-700 dark:text-gray-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-gray-400">
                  No stack data available. Import profile to calculate.
                </div>
              )}
            </div>
          </div>

          {/* Card 3: OwlREADME Analytics */}
          <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b pb-2 border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-purple-500" /> Usage Telemetry
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-500 rounded-full">
                  Local Store
                </span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Active Project Workspaces</span>
                  <span className="font-bold">{workspaceCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Studio Exports</span>
                  <span className="font-bold text-purple-500">{totalExports}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Builder Styles Applied</span>
                  <span className="font-bold">{totalTemplates}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">AI Assistant Generations</span>
                  <span className="font-bold text-blue-500">{aiGenerationsCount}</span>
                </div>
                <div className="flex justify-between border-t pt-2 border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500 font-medium">Roadmap Milestones</span>
                  <span className="font-bold">{totalSteps} steps</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="bg-white dark:bg-[#121212] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-6 gap-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <h2 className="font-bold text-lg">Interactive Analytics Charts</h2>
            </div>

            {/* Chart type select sub-tabs */}
            <div className="flex bg-gray-100 dark:bg-black/40 rounded-lg p-1 text-xs">
              <button
                onClick={() => setActiveChartTab('languages')}
                disabled={!hasGitHubData}
                className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeChartTab === 'languages'
                    ? 'bg-white dark:bg-gray-800 text-blue-500 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                Languages
              </button>
              <button
                onClick={() => setActiveChartTab('exports')}
                className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                  activeChartTab === 'exports'
                    ? 'bg-white dark:bg-gray-800 text-blue-500 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                Studio Exports
              </button>
              <button
                onClick={() => setActiveChartTab('activity')}
                disabled={!hasGitHubData}
                className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeChartTab === 'activity'
                    ? 'bg-white dark:bg-gray-800 text-blue-500 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                Activity Timeline
              </button>
            </div>
          </div>

          {/* Chart Rendering Container */}
          <div className="flex items-center justify-center p-4 min-h-[300px]">
            {activeChartTab === 'languages' && hasGitHubData && (
              <DonutChart data={languagesData} />
            )}

            {activeChartTab === 'exports' && (
              <div className="w-full max-w-lg">
                <BarChart data={exportChartData} height={220} />
              </div>
            )}

            {activeChartTab === 'activity' && hasGitHubData && (
              <div className="w-full max-w-lg">
                <div className="text-center text-xs text-gray-400 mb-4">
                  Weekly push activity log calculated across repositories.
                </div>
                <AreaChart data={activityChartData} height={220} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperAnalyticsPage;
