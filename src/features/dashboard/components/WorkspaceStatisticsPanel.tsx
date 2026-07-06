interface WorkspaceStatisticsPanelProps {
  isReadmeType: boolean;
  isRoadmapType: boolean;
  readmeExportsCount: number;
  roadmapExportsCount: number;
  totalTemplatesCount: number;
}

export const WorkspaceStatisticsPanel = ({
  isReadmeType,
  isRoadmapType,
  readmeExportsCount,
  roadmapExportsCount,
  totalTemplatesCount,
}: WorkspaceStatisticsPanelProps) => {
  return (
    <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <h2 className="text-xl font-bold mb-4 border-b pb-2 border-gray-100 dark:border-gray-800">Workspace Statistics</h2>
      <div className={`grid grid-cols-1 ${isReadmeType && isRoadmapType ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 text-center`}>
        {isReadmeType && (
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50">
            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">README Exports</span>
            <span className="text-3xl font-extrabold text-blue-500">{readmeExportsCount}</span>
          </div>
        )}
        {isRoadmapType && (
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50">
            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Roadmap Exports</span>
            <span className="text-3xl font-extrabold text-blue-500">{roadmapExportsCount}</span>
          </div>
        )}
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50">
          <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Styles Tested</span>
          <span className="text-3xl font-extrabold text-blue-500">{totalTemplatesCount}</span>
        </div>
      </div>
    </div>
  );
};
