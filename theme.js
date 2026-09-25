import { Platform, StatusBar } from 'react-native';

// Style Tile "La noche y el amanecer" (source: gen_mockups.py of the UI Design delivery).
export const colors = {
  ink: '#1C2233',
  prim: '#3A5BC7',
  primLight: '#E4EAFB',
  night: '#141B33',
  accent: '#F5A623',
  accentLight: '#FDF3DF',
  accentInk: '#9C6B0F',
  ok: '#2E8B62',
  okLight: '#E7F3EC',
  g1: '#4A5568',
  g2: '#8A94A6',
  g3: '#D8DEE9',
  g4: '#F2F5FA',
  bg: '#FAFBFD',
  white: '#FFFFFF',
  nightText: '#B9C4E8',
  nightMuted: '#8FA3E8',
  nightBorder: '#5B6C9E',
  photoBg: '#FFF6E8',
  photoInk: '#C98A1B',
  photoLine: '#E8C88F',
};

// Inter, the Figma font, bundled in assets/fonts (SIL OFL 1.1, see OFL.txt).
// Android ignores fontWeight on custom fonts, so each weight is its own family.
export const fontFiles = {
  'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
  'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
};
export const fonts = { regular: 'Inter-Regular', bold: 'Inter-Bold' };

// Mockup frame used for pixel-perfect work, in dp.
export const FRAME = { width: 390, height: 800 };

// Android draws edge to edge in Expo SDK 54, so screens start below the status bar.
export const statusBarInset = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

// SVG text is positioned by its baseline; React Native positions the text box top.
export const lineHeight = (size) => Math.round(size * 1.2);
export const textTop = (baseline, size) => baseline - size;

export const pressedFeedback = ({ pressed }) => (pressed ? { opacity: 0.7 } : null);
