import {
  StyleSheet,
} from 'react-native';
import {
  color,
} from '../../../../styles/variables';
import { ResponsiveStyle } from '../../../ResponsiveStyles';

const SellerLotCounterofferListItemStyles: ResponsiveStyle = {
  defaultStyle: StyleSheet.create({
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
      justifyContent: 'space-between',
    },
    offerItem: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 20,
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
    priceRow: {
      alignItems: 'baseline',
      flexDirection: 'row',
    },
  }),
}
export default SellerLotCounterofferListItemStyles;
