import {
  Platform,
  StyleSheet,
} from 'react-native';
import {
  color,
} from '../../../../../styles/variables';
import { ResponsiveStyle } from '../../../../ResponsiveStyles';

const CounterofferSellerActionCardStyles: ResponsiveStyle = {
  defaultStyle: StyleSheet.create({
    acceptButtonSelected: {
      backgroundColor: color.lightSuccess25,
      borderColor: color.lightSuccess2,
      borderWidth: 2,
      color: color.lightSuccess2,
    },
    acceptSelectedText: {
      color: color.lightSuccess2,
    },
    actionsCardBody: {
      paddingHorizontal: 48,
      paddingTop: 32,
    },
    actionCardContainer: {
      ...Platform.select({
        web: {
          width: '100%',
        },
      }),
    },
    counterButtonSelected: {
      backgroundColor: color.primary25,
      borderColor: color.primary500,
      borderWidth: 2,
    },
    counterInputContainer: {
      paddingBottom: 96,
    },
    counterInputStyles: {
      color: color.lightForeground1,
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderColor: '#DADADA',
      borderRadius: 8,
      borderWidth: 1,
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 12,
      marginTop: 32,
      padding: 16,
      width: '100%',
      ...Platform.select({
        android: {
          height: 64,
        },
        ios: {
          lineHeight: 0,
        },
      }),
    },
    counterofferSelectedText: {
      color: color.primary500,
    },
    declineButtonSelected: {
      backgroundColor: color.lightError3,
      borderColor: color.lightError2,
      borderWidth: 2,
    },
    declineSelectedText: {
      color: color.lightError2,
    },
    disclaimerSubtitle: {
      marginVertical: 32,
    },
    errorText: {
      color: color.red,
      textAlign: 'left',
    },
    feeRow: {
      flexDirection: 'row',
    },
    feeLink: {
      textDecorationLine: 'underline',
    },
    inputErrorContainer: {
      borderColor: color.red,
    },
    offerReviewAmount: {
      alignItems: 'center',
    },
    offerReviewButton: {
      backgroundColor: color.white,
      borderColor: color.lightStroke1,
      borderRadius: 12,
      borderWidth: 1,
      marginVertical: 0,
      paddingVertical: 40,
      paddingHorizontal: 16,
      ...Platform.select({
        web: {
          flex: 1,
        },
      }),
    },
    // eslint-disable-next-line
    // @ts-ignore
    offerReviewButtonHovered: {
      ...Platform.select({
        web: {
          boxShadow: '0px 12px 16px -4px rgba(0, 0, 0, 0.08), 0px 4px 6px -2px rgba(0, 0, 0, 0.03)',
        },
      }),
    },
    offerReviewButtonIcon: {
      marginRight: 8,
    },
    offerReviewButtonRow: {
      alignItems: 'center',
      columnGap: 16,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 32,
    },
    offerReviewDivider: {
      marginVertical: 16,
    },
    offerReviewInfoRow: {
      paddingVertical: 0,
    },
    offerReviewSubtitle: {
      columnGap: 8,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 12,
      marginBottom: 32,
    },
  }),
  mobileStyle: StyleSheet.create({
    actionsCardBody: {
      paddingHorizontal: 16,
    },
    counterInputStyles: {
      marginTop: 12,
    },
    offerReviewSubtitle: {
      marginBottom: 24,
    },
    offerReviewButton: {
      maxWidth: '100%',
      paddingVertical: 24,
    },
    offerReviewButtonRow: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: 24,
      rowGap: 12,
    },
    feeRow: {
      flexDirection: 'column',
    },
  }),
}
export default CounterofferSellerActionCardStyles;
