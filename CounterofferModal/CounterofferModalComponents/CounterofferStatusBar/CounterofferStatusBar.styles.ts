import {
  StyleSheet,
} from 'react-native';
import {
  fontFamily,
} from '../../../../../styles/variables';
import { ResponsiveStyle } from '../../../../ResponsiveStyles';

const CounterofferModalStyles: ResponsiveStyle = {
  defaultStyle: StyleSheet.create({
    noOffersBarContainer: {
      height: 'auto',
      paddingHorizontal: 48,
      paddingTop: 32,
      width: '100%',
    },
    noOffersBarInner: {
      backgroundColor: '#FFFAEB',
      borderColor: '#FEF0C7',
      borderRadius: 8,
      borderWidth: 1,
      height: 'auto',
      paddingHorizontal: 16,
      paddingVertical: 12,
      width: '100%',
    },
    noOffersBarHeaderText: {
      color: '#B54708',
      fontFamily: fontFamily.AreaNormal,
      fontSize: 13,
      fontStyle: 'normal',
      fontWeight: '800',
      lineHeight: 20,
      marginBottom: 2,
    },
    noOffersBarBodyText: {
      color: '#B54708',
      fontFamily: fontFamily.AreaNormal,
      fontSize: 13,
      fontStyle: 'normal',
      fontWeight: '500',
      lineHeight: 20,
    },
    warningIcon: {
      marginRight: 20,
      marginTop: 8,
    },
  }),
  mobileStyle: StyleSheet.create({
    noOffersBarContainer: {
      paddingHorizontal: 16,
    },
  }),
}
export default CounterofferModalStyles;
