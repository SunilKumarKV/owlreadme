"use client";

import { useState, useCallback } from 'react';
import { isValidGitHubUsername } from '../utils/hero';

export function useHero(initialUsername: string = '') {
  const [username, setUsername] = useState(initialUsername);
  const [error, setError] = useState<string | null>(null);

  const handleUsernameChange = useCallback((value: string) => {
    setUsername(value);
    if (error) {
      setError(null);
    }
  }, [error]);

  const handleClear = useCallback(() => {
    setUsername('');
    setError(null);
  }, []);

  const validate = useCallback(() => {
    if (!username.trim()) {
      setError('Please enter a GitHub username.');
      return false;
    }
    if (!isValidGitHubUsername(username.trim())) {
      setError('Please enter a valid GitHub username.');
      return false;
    }
    setError(null);
    return true;
  }, [username]);

  return {
    username,
    setUsername: handleUsernameChange,
    onClear: handleClear,
    error,
    validate,
  };
}

export default useHero;
