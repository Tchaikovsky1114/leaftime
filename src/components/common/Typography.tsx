import React from 'react';
import { Text, TextProps, TextStyle, StyleProp } from 'react-native';
import { baseFontFamily, getVariantStyle, TypographyVariant } from '../../styles/typography';

type Props = TextProps & {
  variant?: TypographyVariant;
  color?: string;
  weight?: TextStyle['fontWeight'];
  align?: TextStyle['textAlign'];
  style?: StyleProp<TextStyle>;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
  mx?: number;
  my?: number;
  children?: React.ReactNode;
};

const Typography: React.FC<Props> = ({
  variant = 'body',
  color,
  weight,
  align,
  style,
  children,
  italic,
  underline,
  strike,
  mt,
  mb,
  ml,
  mr,
  mx,
  my,
  ...rest
}) => {
  const v = getVariantStyle(variant);
  const base: TextStyle = {
    fontFamily: baseFontFamily,
    fontSize: v.fontSize,
    lineHeight: v.lineHeight,
    fontWeight: weight ?? v.fontWeight ?? '400',
    color,
    textAlign: align,
    fontStyle: italic ? 'italic' : undefined,
    textDecorationLine: underline ? 'underline' : strike ? 'line-through' : undefined,
    marginTop: mt,
    marginBottom: mb,
    marginLeft: ml,
    marginRight: mr,
    marginHorizontal: mx,
    marginVertical: my,
  };

  return (
    <Text {...rest} style={[base, style]}>
      {children}
    </Text>
  );
};

export default Typography;
export type { Props as TypographyProps };
