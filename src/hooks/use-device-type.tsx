import { useState, useEffect } from "react";

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function useDeviceType() {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent.toLowerCase();
      
      // Detectar se é dispositivo móvel real (não apenas largura)
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      setIsMobileDevice(isMobile);
      
      // Detectar tipo baseado na largura
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { deviceType, isMobileDevice, isMobile: deviceType === 'mobile' };
}
