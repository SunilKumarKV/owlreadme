interface WorkspaceConfigurationsPanelProps {
  isReadmeType: boolean;
  isRoadmapType: boolean;
  readmeTemplate: string;
  roadmapTemplate: string | null;
  theme: string;
}

export const WorkspaceConfigurationsPanel = ({
  isReadmeType,
  isRoadmapType,
  readmeTemplate,
  roadmapTemplate,
  theme,
}: WorkspaceConfigurationsPanelProps) => {
  return (
    <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <h2 className="text-xl font-bold mb-4 border-b pb-2 border-gray-100 dark:border-gray-800">Workspace Configurations</h2>
      <div className={`grid grid-cols-1 ${isReadmeType && isRoadmapType ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 text-center`}>
        {isReadmeType && (
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-black/20">
            <span className="text-xs text-gray-500 block">README Style</span>
            <span className="font-bold text-sm capitalize">{readmeTemplate}</span>
          </div>
        )}
        {isRoadmapType && (
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-black/20">
            <span className="text-xs text-gray-500 block">Roadmap Style</span>
            <span className="font-bold text-sm capitalize">{roadmapTemplate ? roadmapTemplate.replace('-', ' ') : 'Custom'}</span>
          </div>
        )}
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-black/20">
          <span className="text-xs text-gray-500 block">Workspace Theme</span>
          <span className="font-bold text-sm capitalize">{theme}</span>
        </div>
      </div>
    </div>
  );
};
