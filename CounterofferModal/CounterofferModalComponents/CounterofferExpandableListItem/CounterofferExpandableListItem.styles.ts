import {
  StyleSheet,
} from 'react-native';
import {
  color,
  fontFamily,
  fontWeight,
  v2FontSizes,
} from '../../../../../styles/variables';
import { ResponsiveStyle } from '../../../../ResponsiveStyles';

const CounterofferModalStyles: ResponsiveStyle = {
  defaultStyle: StyleSheet.create({
    counterofferListItem: {
      alignContent: 'stretch',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'space-between',
      marginVertical: 12,
      paddingHorizontal: 12,
      position: 'relative',
      width: '100%',
    },
    counterofferListItemAmountText: {
      color: color.lightForeground3,
      fontFamily: fontFamily.AreaNormal,
      fontSize: v2FontSizes.xxSmall,
      fontStyle: 'normal',
      fontWeight: fontWeight.normal,
      lineHeight: 20,
      textAlign: 'right',
      width: 125,
    },
    counterofferListItemMetaData: {
      alignContent: 'flex-start',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      width: '80%',
    },
    counterofferListItemPriceWrapper: {
      minWidth: '50%',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      alignContent: 'stretch',
      alignItems: 'center',
    },
    counterofferListItemPriceText: {
      fontFamily: fontFamily.AreaNormal,
      fontSize: v2FontSizes.xSmall,
      fontStyle: 'normal',
      fontWeight: fontWeight.normal,
      lineHeight: 20,
      minWidth: 'auto',
      marginRight: 10,
      color: color.lightForeground1,
    },
    counterofferListItemPriceDifferenceText: {
      fontFamily: fontFamily.AreaNormal,
      fontSize: v2FontSizes.xxSmall,
      fontStyle: 'normal',
      fontWeight: fontWeight.normal,
      lineHeight: 20,
      minWidth: 'auto',
      color: color.lightForeground3,
    },
    counterofferListItemTimeText: {
      color: color.lightForeground3,
      fontFamily: fontFamily.AreaNormal,
      fontSize: v2FontSizes.xxSmall,
      fontStyle: 'normal',
      fontWeight: fontWeight.normal,
      lineHeight: 16,
      marginLeft: -5,

      /** off set for status icon on expired date of response row */
      textAlign: 'left',
    },
    offerStatusIcon: {
      borderRadius: 40,
      height: 6,
      marginLeft: 8,
      width: 6,
    },
    declinedFill: {
      backgroundColor: color.lightForeground3,
    },
  }),
  mobileStyle: StyleSheet.create({
    counterofferListItem: {
      paddingHorizontal: 0,
    },
    counterofferListItemMetaData: {
      alignContent: 'flex-start',
      alignItems: 'flex-start',
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      marginLeft: 20,
      width: '50%',
    },
    counterofferListItemTimeText: {
      marginLeft: 0,
      textAlign: 'right',
    },
  }),
}
export default CounterofferModalStyles;
