import { TextStyle } from 'react-native';
import { colors } from './colors';

// Loaded via @expo-google-fonts/barlow(-condensed) — see App.tsx useFonts call.
export const fonts = {
  heading: 'BarlowCondensed_600SemiBold',
  headingRegular: 'BarlowCondensed_400Regular',
  body: 'Barlow_400Regular',
  bodyMedium: 'Barlow_500Medium',
  bodyBold: 'Barlow_700Bold',
};

// h1..h6 sizes from styles.css, letter-spacing -0.015em applied via the
// negative tracking helper below (RN letterSpacing is absolute px, not em).
const tracking = (fontSize: number) => -0.015 * fontSize;

export const type = {
  h1: { fontFamily: fonts.heading, fontSize: 42, letterSpacing: tracking(42), color: colors.text } as TextStyle,
  h2: { fontFamily: fonts.heading, fontSize: 32, letterSpacing: tracking(32), color: colors.text } as TextStyle,
  h3: { fontFamily: fonts.heading, fontSize: 25, letterSpacing: tracking(25), color: colors.text } as TextStyle,
  h4: { fontFamily: fonts.heading, fontSize: 20, letterSpacing: tracking(20), color: colors.text } as TextStyle,
  h5: { fontFamily: fonts.heading, fontSize: 16, letterSpacing: tracking(16), color: colors.text } as TextStyle,
  h6: {
    fontFamily: fonts.heading,
    fontSize: 13,
    letterSpacing: 0.08 * 13,
    textTransform: 'uppercase',
    color: colors.text,
  } as TextStyle,
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 15 * 1.55, color: colors.text } as TextStyle,
  bodySm: { fontFamily: fonts.body, fontSize: 13, lineHeight: 13 * 1.5, color: colors.text } as TextStyle,
  navBrand: { fontFamily: fonts.heading, fontSize: 18, color: colors.text } as TextStyle,
  cardKicker: {
    fontFamily: fonts.body,
    fontSize: 10,
    letterSpacing: 0.1 * 10,
    textTransform: 'uppercase',
    color: colors.accent,
  } as TextStyle,
  cardTitle: { fontFamily: fonts.heading, fontSize: 17, color: colors.text } as TextStyle,
  cardBody: { fontFamily: fonts.body, fontSize: 13, color: colors.text, opacity: 0.8 } as TextStyle,
  cardMeta: { fontFamily: fonts.body, fontSize: 11, color: 'rgba(29,31,32,0.5)' } as TextStyle,
  tag: { fontFamily: fonts.body, fontSize: 11, letterSpacing: 0.02 * 11 } as TextStyle,
  btn: { fontFamily: fonts.heading, fontSize: 14, color: colors.text } as TextStyle,
};
