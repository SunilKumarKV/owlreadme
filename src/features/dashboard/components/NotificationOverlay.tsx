import { CheckCircle } from 'lucide-react';

interface NotificationOverlayProps {
  notification: string | null;
}

export const NotificationOverlay = ({ notification }: NotificationOverlayProps) => {
  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-gray-900 border border-gray-800 text-white px-4 py-3 rounded-lg shadow-lg animate-fade-in transition-all duration-300">
      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
      <span className="text-sm font-semibold">{notification}</span>
    </div>
  );
};
