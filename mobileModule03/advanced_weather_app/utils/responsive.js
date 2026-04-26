export const BREAKPOINTS = {
  tinyWidth: 320,
  smallPhone: 375,
  tablet: 768,
  largeTablet: 1024,
  desktopLike: 1200,
};

export function getDeviceType(width, height) {
  const shortestSide = Math.min(width, height);
  const longestSide = Math.max(width, height);

  return {
    isTinyWidth: width < BREAKPOINTS.tinyWidth,
    isSmallPhone: shortestSide < BREAKPOINTS.smallPhone,
    isPhone:
      shortestSide >= BREAKPOINTS.smallPhone &&
      shortestSide < BREAKPOINTS.tablet,
    isTablet: shortestSide >= BREAKPOINTS.tablet,
    isLargeTablet: shortestSide >= BREAKPOINTS.largeTablet,
    isDesktopLike: longestSide >= BREAKPOINTS.desktopLike,
    isLandscape: width > height,
    isTallPhone:
      shortestSide < BREAKPOINTS.tablet &&
      longestSide >= 850,
    isWideDisplay: width >= 900 && width > height,
  };
}

function pickResponsiveValue(device, values) {
  const isExpanded = device.isLargeTablet || device.isWideDisplay;

  if (device.isDesktopLike) return values.desktopLike;
  if (isExpanded) return values.expanded;
  if (device.isTablet) return values.tablet;
  if (device.isTinyWidth) return values.tinyWidth;
  if (device.isSmallPhone) return values.smallPhone;
  if (device.isTallPhone) return values.tallPhone;
  return values.default;
}

export function getResponsiveSizes(width, height) {
  const device = getDeviceType(width, height);

  return {
    ...device,

    bottomBarIcon: pickResponsiveValue(device, {
      desktopLike: 42,
      expanded: 38,
      tablet: 34,
      tinyWidth: 20,
      smallPhone: 23,
      tallPhone: 30,
      default: 26,
    }),

    bottomBarText: pickResponsiveValue(device, {
      desktopLike: 22,
      expanded: 20,
      tablet: 18,
      tinyWidth: 10,
      smallPhone: 11,
      tallPhone: 15,
      default: 14,
    }),

    bottomBarPad: pickResponsiveValue(device, {
      desktopLike: 28,
      expanded: 24,
      tablet: 20,
      tinyWidth: 6,
      smallPhone: 9,
      tallPhone: 18,
      default: 14,
    }),

    topBarFont: pickResponsiveValue(device, {
      desktopLike: 26,
      expanded: 24,
      tablet: 21,
      tinyWidth: 12,
      smallPhone: 14,
      tallPhone: 18,
      default: 16,
    }),

    topBarIcon: pickResponsiveValue(device, {
      desktopLike: 38,
      expanded: 36,
      tablet: 32,
      tinyWidth: 16,
      smallPhone: 18,
      tallPhone: 26,
      default: 22,
    }),

    topBarPadV: pickResponsiveValue(device, {
      desktopLike: 24,
      expanded: 22,
      tablet: 18,
      tinyWidth: 6,
      smallPhone: 8,
      tallPhone: 13,
      default: 10,
    }),

    topBarPadH: pickResponsiveValue(device, {
      desktopLike: 30,
      expanded: 26,
      tablet: 22,
      tinyWidth: 8,
      smallPhone: 10,
      tallPhone: 16,
      default: 12,
    }),

    topBarRadius: pickResponsiveValue(device, {
      desktopLike: 20,
      expanded: 18,
      tablet: 14,
      tinyWidth: 6,
      smallPhone: 6,
      tallPhone: 10,
      default: 10,
    }),

    middleText: pickResponsiveValue(device, {
      desktopLike: 46,
      expanded: 42,
      tablet: 36,
      tinyWidth: 18,
      smallPhone: 22,
      tallPhone: 32,
      default: 28,
    }),

    middlePadH: pickResponsiveValue(device, {
      desktopLike: 36,
      expanded: 32,
      tablet: 28,
      tinyWidth: 8,
      smallPhone: 12,
      tallPhone: 22,
      default: 16,
    }),
  };
}