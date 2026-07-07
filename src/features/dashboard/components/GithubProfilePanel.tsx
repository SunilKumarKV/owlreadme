import Image from 'next/image';
import Button from '@/components/Button';
import { ProfileCardSkeleton } from '@/components/Skeleton';

interface GithubProfilePanelProps {
  loading: boolean;
  avatarUrl: string;
  readmeName: string;
  readmeRole: string;
  readmeAbout: string;
  followers: number | undefined | null;
  publicRepos: number | undefined | null;
}

export const GithubProfilePanel = ({
  loading,
  avatarUrl,
  readmeName,
  readmeRole,
  readmeAbout,
  followers,
  publicRepos,
}: GithubProfilePanelProps) => {
  if (loading) {
    return <ProfileCardSkeleton />;
  }

  return (
    <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm text-center">
      <h2 className="text-xl font-bold mb-4 text-left border-b pb-2 border-gray-100 dark:border-gray-800">GitHub Profile</h2>
      {avatarUrl ? (
        <div className="flex flex-col items-center">
          <Image
            src={avatarUrl}
            alt="GitHub Avatar"
            width={96}
            height={96}
            className="w-24 h-24 rounded-full border-2 border-blue-500 shadow-sm mb-4"
          />
          <h3 className="text-lg font-bold">{readmeName || 'Unnamed Developer'}</h3>
          {readmeRole && <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{readmeRole}</p>}
          {readmeAbout && <p className="text-xs text-gray-600 dark:text-gray-400 px-4 line-clamp-3 mb-4">{readmeAbout}</p>}
          <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-gray-100 dark:border-gray-800 text-sm">
            <div>
              <span className="block font-bold text-blue-500">{followers ?? 0}</span>
              <span className="text-xs text-gray-500">Followers</span>
            </div>
            <div>
              <span className="block font-bold text-blue-500">{publicRepos ?? 0}</span>
              <span className="text-xs text-gray-500">Repositories</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8 text-gray-500 text-sm">
          <p className="mb-4">No GitHub profile loaded.</p>
          <Button href="/" variant="secondary" className="w-full text-xs">Import from GitHub</Button>
        </div>
      )}
    </div>
  );
};
