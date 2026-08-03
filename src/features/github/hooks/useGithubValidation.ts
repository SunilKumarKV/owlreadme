"use client";

import { useMemo } from 'react';
import { validateGitHubUsername } from '../utils/github';
import { GitHubValidationResult } from '../types/github';

export function useGithubValidation(username: string): GitHubValidationResult {
  return useMemo(() => {
    return validateGitHubUsername(username);
  }, [username]);
}

export default useGithubValidation;
