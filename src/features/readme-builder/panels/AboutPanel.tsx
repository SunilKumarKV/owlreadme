import React from 'react';
import Textarea from '@/components/Textarea';

export interface AboutPanelProps {
  sectionId: string;
  about: string;
  setAbout: (val: string) => void;
  skills: string;
  setSkills: (val: string) => void;
  loading: boolean;
}

export const AboutPanel: React.FC<AboutPanelProps> = ({
  sectionId,
  about,
  setAbout,
  skills,
  setSkills,
  loading,
}) => {
  return (
    <div key={sectionId} className="p-6 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm space-y-4">
      <h3 className="text-lg font-semibold text-black dark:text-white">
        📝 About Me & Skills Config
      </h3>
      <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div>
          <label htmlFor="readme-about" className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">About Me / Bio</label>
          <Textarea
            id="readme-about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="About You"
            rows={4}
            loading={loading}
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="readme-skills" className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">Skills (Legacy Text Block)</label>
          <Textarea
            id="readme-skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Skills (comma-separated or list)"
            rows={3}
            loading={loading}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default AboutPanel;
