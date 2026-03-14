import { useState, useEffect } from 'react';

export function useGitHubRelease() {
  const [version, setVersion] = useState('v1.0.8'); // Fallback version
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestRelease() {
      try {
        const response = await fetch('https://api.github.com/repos/anburocky3/arokiyam-app/releases/latest');
        if (response.ok) {
          const data = await response.json();
          if (data && data.tag_name) {
            setVersion(data.tag_name);
          }
        }
      } catch (error) {
        console.error('Failed to fetch latest GitHub release', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLatestRelease();
  }, []);

  return { version, loading };
}
