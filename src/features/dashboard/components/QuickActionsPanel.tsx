import Button from '@/components/Button';

interface QuickActionsPanelProps {
  isReadmeType: boolean;
  isRoadmapType: boolean;
}

export const QuickActionsPanel = ({ isReadmeType, isRoadmapType }: QuickActionsPanelProps) => {
  return (
    <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <h2 className="text-xl font-bold mb-4 border-b pb-2 border-gray-100 dark:border-gray-800">Quick Actions</h2>
      <div className="flex flex-col gap-3">
        {isReadmeType && <Button href="/readme-builder" variant="primary" className="w-full text-sm">Create / Edit README</Button>}
        {isRoadmapType && <Button href="/roadmap-builder" variant={isReadmeType ? "secondary" : "primary"} className="w-full text-sm">Create / Edit Roadmap</Button>}
        <Button href="/templates" variant="secondary" className="w-full text-sm">🛍️ README Templates</Button>
        <Button href="/gallery" variant="secondary" className="w-full text-sm">README Showcase Gallery</Button>
        <Button href="/export" variant="secondary" className="w-full text-sm">Export Markdown</Button>
        <Button href="/theme" variant="secondary" className="w-full text-sm">Change Theme</Button>
        <Button href="/analytics" variant="secondary" className="w-full text-sm">View Analytics</Button>
      </div>
    </div>
  );
};
