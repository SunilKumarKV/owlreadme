"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { GitHubIcon } from '@/components/Icons';
import { isValidGithubUsername } from '@/packages/github/validators';
import { ArrowRight, Check } from 'lucide-react';

const GitHubUsernameInput: React.FC = () => {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const isUsernameValid = isValidGithubUsername(username);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/dashboard?username=${encodeURIComponent(username.trim())}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-[#0c0c0e] text-gray-900 dark:text-white p-4 transition-colors">
      <div className="glass-card p-8 sm:p-10 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 max-w-md w-full flex flex-col items-center space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Enter your GitHub username</h1>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            OwlREADME will safely load your public profile data to prepare your README workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full space-y-4">
          <label htmlFor="github-username" className="sr-only">GitHub Username</label>
          <Input
            id="github-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your GitHub Username"
            className="text-left font-medium"
            icon={<GitHubIcon className="h-4 w-4 text-gray-400" />}
            isValid={isUsernameValid}
            rightElement={isUsernameValid ? <Check className="h-4 w-4 text-green-500" /> : undefined}
            autoFocus
          />
          <Button
            type="submit"
            disabled={!username.trim()}
            variant="gradient"
            className="w-full h-11 text-sm font-bold justify-center"
            icon={<ArrowRight className="h-4 w-4" />}
          >
            Start Building README
          </Button>
        </form>
      </div>
    </div>
  );
};

export default GitHubUsernameInput;