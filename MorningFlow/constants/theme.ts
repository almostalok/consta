export const Colors = {
  // Monochrome Prestige doesn't use a separate light mode. Both are the Nocturnal Gallery mapping.
  light: {
    primary: '#FFFFFF',
    primaryContainer: '#D4D4D4',
    secondary: '#C7C6C6',
    background: '#131313', // The Infinite Canvas
    surfaceLowest: '#0E0E0E', // The deepest base layer
    surface: '#131313', // The primary canvas level
    surfaceLow: '#1B1B1B', // Subtle elevation
    surfaceContainer: '#1F1F1F', // Cards
    surfaceHigh: '#2A2A2A', // Elevated
    surfaceHighest: '#353535', // Interactive 
    surfaceBright: '#393939',
    text: '#E2E2E2', // High contrast
    textSecondary: '#C6C6C6', // Secondary descriptions
    textInverse: '#1A1C1C',
    success: '#FFFFFF', // Monochrome success
    border: '#474747', // outline_variant (Ghost Border at 20% opacity)
  },
  dark: {
    primary: '#FFFFFF',
    primaryContainer: '#D4D4D4',
    secondary: '#C7C6C6',
    background: '#131313', // The Infinite Canvas
    surfaceLowest: '#0E0E0E',
    surface: '#131313', 
    surfaceLow: '#1B1B1B', 
    surfaceContainer: '#1F1F1F', 
    surfaceHigh: '#2A2A2A', 
    surfaceHighest: '#353535', 
    surfaceBright: '#393939',
    text: '#E2E2E2', 
    textSecondary: '#C6C6C6', 
    textInverse: '#1A1C1C',
    success: '#FFFFFF', 
    border: '#474747',
  }
};

export const SIZES = {
  // Padding & Whitespace
  padding: 24, // "Intentional Asymmetry using 24 spacing scale"
  paddingLarge: 48, // Generous whitespace 
  
  // Radius Scale
  radiusDefault: 16, // DEFAULT (1rem / 16px)
  radiusLg: 24, // lg
  radiusXl: 30, // xl (3rem) - The Tactile Pill

  // Typography Size (Px)
  displayLg: 56, // 3.5rem
  headlineLg: 32, // 2rem
  bodyLg: 16, // 1rem
  labelMd: 12, // 0.75rem
};
