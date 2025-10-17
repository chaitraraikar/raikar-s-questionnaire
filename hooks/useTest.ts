
import { useState, useCallback, useEffect } from 'react';
import type { TestConfig } from '../types';
import { LOCAL_STORAGE_KEY } from '../constants';

export const useTest = () => {
  const [testConfig, setTestConfig] = useState<TestConfig | null>(null);

  useEffect(() => {
    try {
      const savedTest = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedTest) {
        setTestConfig(JSON.parse(savedTest));
      }
    } catch (error) {
      console.error("Failed to load test from local storage", error);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  const saveTestConfig = useCallback((config: TestConfig) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
      setTestConfig(config);
    } catch (error) {
      console.error("Failed to save test to local storage", error);
    }
  }, []);

  const clearTestConfig = useCallback(() => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setTestConfig(null);
    } catch (error) {
      console.error("Failed to clear test from local storage", error);
    }
  }, []);

  return { testConfig, saveTestConfig, clearTestConfig };
};
