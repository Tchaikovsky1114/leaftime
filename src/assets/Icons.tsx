import Ionicons from 'react-native-vector-icons/Ionicons';
import glyphMap from 'react-native-vector-icons/glyphmaps/Ionicons.json';

export type IoniconName = keyof typeof glyphMap;
export interface IconProps {
  name: IoniconName;
  size?: number;
  color?: string;
}

const Icons = ({ name, size = 24, color = 'black' }: IconProps) => (
  <Ionicons name={name} size={size} color={color} />
);

export default Icons;
