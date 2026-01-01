import { Platform } from 'react-native';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'button';

export const baseFontFamily = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
});

export interface VariantStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight?: '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'normal' | 'bold';
}

export const typography: Record<TypographyVariant, VariantStyle> = {
  h1: { fontSize: 32, lineHeight: 40, fontWeight: '700' },
  h2: { fontSize: 24, lineHeight: 32, fontWeight: '600' },
  subtitle: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '400' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  button: { fontSize: 18, lineHeight: 24, fontWeight: '700' },
};

export function getVariantStyle(variant: TypographyVariant): VariantStyle {
  return typography[variant];
}
