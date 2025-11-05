import { useState, useEffect } from "react";

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface DeviceState {
  deviceType: DeviceType;
  isMobileDevice: boolean;
  isPortrait: boolean;
  screenWidth: number;
  screenHeight: number;
}

// Debounce helper
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function useDeviceType() {
  const [state, setState] = useState<DeviceState>({
    deviceType: 'desktop',
    isMobileDevice: false,
    isPortrait: true,
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const userAgent = navigator.userAgent.toLowerCase();
      
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isPortrait = height > width;
      
      let deviceType: DeviceType = 'desktop';
      if (width < 768) deviceType = 'mobile';
      else if (width < 1024) deviceType = 'tablet';
      
      setState({
        deviceType,
        isMobileDevice: isMobile,
        isPortrait,
        screenWidth: width,
        screenHeight: height
      });
    };

    const debouncedCheck = debounce(checkDevice, 150);

    checkDevice();
    window.addEventListener('resize', debouncedCheck);
    return () => window.removeEventListener('resize', debouncedCheck);
  }, []);

  return {
    ...state,
    isMobile: state.deviceType === 'mobile',
    isTablet: state.deviceType === 'tablet',
    isDesktop: state.deviceType === 'desktop'
  };
}
