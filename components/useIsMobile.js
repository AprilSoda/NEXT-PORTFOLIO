import { useState, useEffect } from 'react';

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    const checkIfMobile = () => {
      if (typeof window !== 'undefined') {
        const userAgent = navigator.userAgent;
        const mobile = Boolean(
          userAgent.match(
            /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
          )
        );

        // Fallback to screen width if user agent does not match mobile
        if (!mobile && window.innerWidth <= breakpoint) {
          setIsMobile(true);
        } else {
          setIsMobile(mobile);
        }
      }
    };

    checkIfMobile(); // Check the initial screen size and user agent

    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;
