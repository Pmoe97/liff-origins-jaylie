setup.isMobileDevice = function () {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (window.innerWidth <= 768 && window.innerHeight <= 1024);
};

// Detect current orientation
setup.isPortrait = function () {
  return window.matchMedia("(orientation: portrait)").matches;
};

setup.isLandscape = function () {
  return window.matchMedia("(orientation: landscape)").matches;
};

// Simple tablet detector (optional)
setup.isTabletDevice = function () {
  return setup.isMobileDevice() && window.devicePixelRatio <= 2 && Math.max(window.innerWidth, window.innerHeight) >= 834;
};

// Desktop check (opposite of mobile)
setup.isDesktop = function () {
  return !setup.isMobileDevice();
};

// Detects if user prefers reduced motion
setup.prefersReducedMotion = function () {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Detects if user prefers dark mode (can use to match system theme)
setup.prefersDarkMode = function () {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

setup.injectDeviceClasses = function () {
  const body = document.body;
  if (setup.isMobileDevice()) body.classList.add("mobile-device");
  else body.classList.add("desktop-device");

  if (setup.isTabletDevice()) body.classList.add("tablet-device");
  if (setup.isPortrait()) body.classList.add("portrait");
  else body.classList.add("landscape");

  if (setup.prefersDarkMode()) body.classList.add("dark-mode");
  if (setup.prefersReducedMotion()) body.classList.add("reduced-motion");
};

document.addEventListener("DOMContentLoaded", setup.injectDeviceClasses);
