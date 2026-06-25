import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

/**
 * InstallPrompt Component
 * Displays a PWA install prompt at the bottom right corner of the screen.
 * Uses the beforeinstallprompt event to trigger native install dialog.
 */
export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
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

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the default browser install prompt
      e.preventDefault();
      
      // Store the event for later use
      setDeferredPrompt(e);
      
      // Show the custom install prompt
      setShowPrompt(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setShowPrompt(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    // Check if app was previously dismissed
    const isDismissed = localStorage.getItem('pwa_install_dismissed');
    if (!isDismissed && !isInstalled) {
      setShowPrompt(true);
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

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.removeItem('pwa_install_dismissed');
    } else {
      // User declined
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember dismissal for 7 days
    const dismissalTime = new Date().getTime();
    localStorage.setItem('pwa_install_dismissed', dismissalTime);
  };

  // Don't show if already installed or dismissed
  if (!showPrompt || isInstalled) {
    return null;
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 animate-slide-up"
      role="alert"
      aria-label="Install app prompt"
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <Download className="w-5 h-5 text-blue-600" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Install Stringventory
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Get quick access to your business management dashboard
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss install prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Features list */}
        <ul className="text-xs text-gray-600 mb-4 space-y-1 ml-8">
          <li className="flex items-center">
            <span className="inline-block w-1 h-1 bg-blue-600 rounded-full mr-2"></span>
            Access offline
          </li>
          <li className="flex items-center">
            <span className="inline-block w-1 h-1 bg-blue-600 rounded-full mr-2"></span>
            Fast loading times
          </li>
          <li className="flex items-center">
            <span className="inline-block w-1 h-1 bg-blue-600 rounded-full mr-2"></span>
            Home screen icon
          </li>
        </ul>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleDismiss}
            className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            aria-label="Not now"
          >
            Not now
          </button>
          <button
            onClick={handleInstall}
            className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center justify-center gap-2"
            aria-label="Install app"
          >
            <Download className="w-4 h-4" />
            Install
          </button>
        </div>
      </div>

      {/* Slide up animation */}
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
