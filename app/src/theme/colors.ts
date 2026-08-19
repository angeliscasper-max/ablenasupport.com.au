// Mirrors project/_ds/industry-.../styles.css :root tokens.
export const colors = {
  bg: '#f2f2f3',
  surface: '#e9e9ea',
  text: '#1d1f20',
  accent: '#5980a6',
  accent2: '#728fab',
  // color-mix(in srgb, #1d1f20 16%, transparent) flattened onto --color-bg (#f2f2f3)
  divider: '#d1d2d3',

  neutral100: '#f5f5f8',
  neutral200: '#e7e7ea',
  neutral300: '#d4d4d7',
  neutral400: '#b7b7ba',
  neutral500: '#98989b',
  neutral600: '#7a7a7d',
  neutral700: '#5d5d60',
  neutral800: '#424244',
  neutral900: '#2b2b2d',

  accent100: '#eef6ff',
  accent200: '#d6ebff',
  accent300: '#b5d9fd',
  accent400: '#94bce3',
  accent500: '#749dc4',
  accent600: '#597ea3',
  accent700: '#416180',
  accent800: '#2c455d',
  accent900: '#1d2d3d',

  accent2_100: '#eef6ff',
  accent2_800: '#314457',
};

export const textMuted = (opacity: number) => `rgba(29, 31, 32, ${opacity})`;
