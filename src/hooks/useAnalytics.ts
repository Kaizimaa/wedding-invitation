import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const useAnalytics = () => {
  useEffect(() => {
    // Track page view on component mount
    window.gtag('event', 'page_view', {
      page_title: 'Wedding Invitation',
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
  }, []);

  // Function to track custom events
  const trackEvent = (eventName: string, eventParams = {}) => {
    window.gtag('event', eventName, eventParams);
  };

  return { trackEvent };
}; 