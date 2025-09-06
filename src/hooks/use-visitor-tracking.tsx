import { useEffect } from 'react';

export const useVisitorTracking = () => {
  useEffect(() => {
    const recordVisitor = async () => {
      try {
        // Only record visitor once per session
        const hasRecorded = sessionStorage.getItem('visitor_recorded');
        if (hasRecorded) return;

        const response = await fetch('/api/visitor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        if (response.ok) {
          sessionStorage.setItem('visitor_recorded', 'true');
          console.log('Visitor recorded successfully');
        }
      } catch (error) {
        console.error('Failed to record visitor:', error);
      }
    };

    // Record visitor after a short delay to ensure page is loaded
    const timeout = setTimeout(recordVisitor, 1000);

    return () => clearTimeout(timeout);
  }, []);
};
