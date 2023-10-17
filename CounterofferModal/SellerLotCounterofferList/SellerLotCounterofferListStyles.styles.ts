import {
  StyleSheet,
} from 'react-native';
import {
  color,
} from '../../../../styles/variables';
import { ResponsiveStyle } from '../../../ResponsiveStyles';

const SellerLotOfferListStyles: ResponsiveStyle = {
  defaultStyle: StyleSheet.create({
    counteredFill: {
      backgroundColor: color.primary500,
    },
    declinedFill: {
      backgroundColor: color.gradeColor2,
    },
    expiredFill: {
      backgroundColor: color.darkForeground2,
    },
    offerAmount: {
      color: color.lightForeground1,
      marginRight: 10,
    },
    offerColumn: {
      flex: 1,
    },
    offerInfoRow: {
      alignItems: 'center',
      flex: 2,
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    offerItem: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 16,
    },
    offerReviewDivider: {
      marginVertical: 0,
    },
    offerStatusIcon: {
      borderRadius: 40,
      height: 6,
      marginRight: 8,
      width: 6,
    },
    offerStatusRow: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    offerTime: {
      textAlign: 'right',
      alignItems: 'center',
      fontWeight: '500',
    },
    priceRow: {
      alignItems: 'baseline',
      flexDirection: 'row',
    },
    respondButton: {
      borderRadius: 12,
      marginVertical: 0,
      paddingHorizontal: 16,
      paddingVertical: 10,
      width: 'auto',
    },
    sellerLotOfferListItemContainer: {
      paddingHorizontal: 48,
    },
  }),
  mobileStyle: StyleSheet.create({
    offerInfoRow: {
      alignItems: 'flex-start',
      flex: 2,
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    offerTime: {
      textAlign: 'left',
    },
    sellerLotOfferListItemContainer: {
      paddingHorizontal: 16,
    },
  }),
};

export default SellerLotOfferListStyles;
