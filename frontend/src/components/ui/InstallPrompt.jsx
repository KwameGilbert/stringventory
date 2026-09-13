import React, { useState, useEffect } from 'react';
import { X, Download, Share } from 'lucide-react';

/**
 * InstallPrompt Component
 * Displays a PWA install prompt at the bottom right corner of the screen.
 * Uses beforeinstallprompt event on Chromium browsers and provides
 * explicit "Add to Home Screen" guidance on iOS Safari.
 */
export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIOS = typeof navigator !== 'undefined' && (
      /iPad|iPhone|iPod/.test(navigator.userAgent || '') ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );
    setIsIOSDevice(isIOS);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if running as PWA on iOS
    if (window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event (Android / Desktop Chrome)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setShowPrompt(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    // Check if app was previously dismissed (suppress if dismissed within last 7 days)
    let isDismissed = false;
    try {
      const dismissedAt = localStorage.getItem('pwa_install_dismissed');
      isDismissed = dismissedAt && new Date().getTime() - Number(dismissedAt) < 7 * 24 * 60 * 60 * 1000;
    } catch (e) {
      // Ignore localStorage errors
    }

    if (!isDismissed && !isInstalled) {
      // On iOS Safari, show after a short delay; on Chrome, beforeinstallprompt triggers it
      if (isIOS) {
        const timer = setTimeout(() => setShowPrompt(true), 1500);
        return () => clearTimeout(timer);
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDeferredPrompt(null);
      try {
        localStorage.removeItem('pwa_install_dismissed');
      } catch (e) {}
    } else {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    try {
      const dismissalTime = new Date().getTime();
      localStorage.setItem('pwa_install_dismissed', dismissalTime);
    } catch (e) {}
  };

  // Don't show if already installed or dismissed
  if (!showPrompt || isInstalled) {
    return null;
  }

  return (
    <div
      className="fixed bottom-6 right-6 left-6 sm:left-auto sm:max-w-sm z-50 animate-slide-up"
      role="alert"
      aria-label="Install app prompt"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Download className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Install PinnexVentures
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Quick access to your business management platform
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1 transition-colors"
            aria-label="Dismiss install prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* iOS vs Chrome/Android Instructions */}
        {isIOSDevice ? (
          <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-gray-600 space-y-1.5">
            <div className="flex items-center gap-2 font-medium text-gray-800">
              <Share className="w-4 h-4 text-blue-600" />
              <span>To install on iPhone:</span>
            </div>
            <p>1. Tap the <strong>Share</strong> button in Safari toolbar below.</p>
            <p>2. Scroll down and select <strong>"Add to Home Screen"</strong>.</p>
          </div>
        ) : (
          <ul className="text-xs text-gray-600 mb-4 space-y-1.5 ml-2">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
              Fast loading & offline support
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
              Dedicated app icon on Home screen
            </li>
          </ul>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleDismiss}
            className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            aria-label="Not now"
          >
            {isIOSDevice ? "Dismiss" : "Not now"}
          </button>
          {!isIOSDevice && deferredPrompt && (
            <button
              onClick={handleInstall}
              className="flex-1 px-3 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              aria-label="Install app"
            >
              <Download className="w-3.5 h-3.5" />
              Install
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
