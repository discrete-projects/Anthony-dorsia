import {
  StyleSheet,
} from 'react-native';
import {
  color,
  fontFamily,
} from '../../../../../styles/variables';
import { ResponsiveStyle } from '../../../../ResponsiveStyles';

const CounterofferActionResponseCardStyles: ResponsiveStyle = {
  defaultStyle: StyleSheet.create({
    actionsCardBody: {
      width: '100%',
      height: '100%',
      paddingHorizontal: 48,
      paddingTop: 32,
    },
    responseHeaderContainer: {
      flexDirection: 'row',
      display: 'flex',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignContent: 'stretch',
      marginBottom: 36,
      paddingTop: 4,
    },
    offerReviewButtonIcon: {
      marginRight: 8,
    },
    acceptResponseHeader: {
      color: '#000000',
      display: 'flex',
      fontFamily: fontFamily.AreaNormal,
      fontSize: 24,
      fontWeight: '800',
      lineHeight: 32,
    },
    responseCardBody: {
      color: color.lightForeground2,
      display: 'flex',
      fontFamily: fontFamily.AreaNormal,
      fontSize: 15,
      fontStyle: 'normal',
      fontWeight: '700',
      letterSpacing: 0.01,
      lineHeight: 24,
    },
    linkStyles: {
      color: color.primary500,
      textDecorationLine: 'underline',
    },
  }),
  mobileStyle: StyleSheet.create({
    actionsCardBody: {
      paddingHorizontal: 16,
    },
    responseCardBody: {
      fontSize: 12,
    },
  }),
}

export default CounterofferActionResponseCardStyles;
