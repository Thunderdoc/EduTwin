// Platform detection utilities for EduFlow

import { Capacitor } from '@capacitor/core';

/**
 * Check if app is running as a native mobile app
 */
export const isMobileApp = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Check if app is running on Android
 */
export const isAndroid = (): boolean => {
  return Capacitor.getPlatform() === 'android';
};

/**
 * Check if app is running on iOS
 */
export const isIOS = (): boolean => {
  return Capacitor.getPlatform() === 'ios';
};

/**
 * Check if app is running in web browser
 */
export const isWeb = (): boolean => {
  return Capacitor.getPlatform() === 'web';
};

/**
 * Get current platform
 */
export const getPlatform = (): 'ios' | 'android' | 'web' => {
  return Capacitor.getPlatform() as 'ios' | 'android' | 'web';
};

/**
 * Check if device is mobile (based on screen size and user agent)
 */
export const isMobileDevice = (): boolean => {
  // Check if Capacitor native app
  if (isMobileApp()) {
    return true;
  }

  // Check screen size
  if (window.innerWidth <= 768) {
    return true;
  }

  // Check user agent
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
  
  return mobileKeywords.some(keyword => userAgent.includes(keyword));
};

/**
 * Check if device is tablet
 */
export const isTablet = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  const width = window.innerWidth;
  
  // Check for tablet-specific keywords
  const isIPad = userAgent.includes('ipad');
  const isAndroidTablet = userAgent.includes('android') && !userAgent.includes('mobile');
  
  // Check screen size (tablets typically 768px - 1024px)
  const isTabletSize = width >= 768 && width <= 1024;
  
  return isIPad || isAndroidTablet || isTabletSize;
};

/**
 * Get device type
 */
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (isTablet()) return 'tablet';
  if (isMobileDevice()) return 'mobile';
  return 'desktop';
};

/**
 * Check if app is installed as PWA
 */
export const isPWA = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true ||
         document.referrer.includes('android-app://');
};

/**
 * Check if app supports touch
 */
export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Get app version
 */
export const getAppVersion = (): string => {
  return '2.1.0';
};

/**
 * Check if running in development mode
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV;
};

/**
 * Check if running in production mode
 */
export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};

/**
 * Get build mode
 */
export const getBuildMode = (): 'development' | 'production' => {
  return import.meta.env.MODE === 'production' ? 'production' : 'development';
};

/**
 * Check if device has internet connection
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Add online/offline event listeners
 */
export const addConnectionListeners = (
  onOnline: () => void,
  onOffline: () => void
): (() => void) => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};

/**
 * Get device info
 */
export const getDeviceInfo = () => {
  return {
    platform: getPlatform(),
    deviceType: getDeviceType(),
    isMobileApp: isMobileApp(),
    isWeb: isWeb(),
    isPWA: isPWA(),
    isTouchDevice: isTouchDevice(),
    isOnline: isOnline(),
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    userAgent: navigator.userAgent,
    appVersion: getAppVersion(),
    buildMode: getBuildMode(),
  };
};

/**
 * Log device info to console (for debugging)
 */
export const logDeviceInfo = (): void => {
  const info = getDeviceInfo();
  console.log('═══════════════════════════════════════');
  console.log('📱 EduFlow - Device Information');
  console.log('═══════════════════════════════════════');
  console.table(info);
  console.log('═══════════════════════════════════════');
};
