import {
  StyleSheet,
} from 'react-native';
import {
  color,
  listItemImage,
  listItemImageContainer,
} from '../../../../../styles/variables';
import { ResponsiveStyle } from '../../../../ResponsiveStyles';

const LotOfferHeaderStyles: ResponsiveStyle = {
  defaultStyle: StyleSheet.create({
    lotOfferHeaderCard: {
      alignContent: 'stretch',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      width: '100%',
    },
    lotOfferHeaderCardInfoContainer: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      maxWidth: 402,
      paddingHorizontal: 16,
      width: '100%',
    },
    lotOfferHeaderCardInfoRow: {
      marginTop: 8,
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      alignContent: 'flex-start',
      alignItems: 'baseline',
    },
    lotOfferHeaderContainer: {
      marginBottom: 6,
      paddingHorizontal: 48,
      width: '100%',
    },
    listingPriceText: {
      marginLeft: 8,
    },
    lotOfferItemImageContainer: {
      alignItems: 'center',
      backgroundColor: color.lightBackground2,
      borderRadius: 12,
      display: 'flex',
      height: 140,
      justifyContent: 'center',
      width: 140,
    },
    lotOfferItemImageListContainer: {
      height: listItemImageContainer.desktop.height,
      width: listItemImageContainer.desktop.width,
    },
    lotOfferItemImageSizeList: {
      maxHeight: listItemImage.desktop.height,
      maxWidth: listItemImage.desktop.width,
    },
  }),
  mobileStyle: StyleSheet.create({
    lotOfferHeaderCardInfoContainer: {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 402,
      paddingHorizontal: 0,
      marginLeft: 8,
      width: '100%',
    },
    lotOfferHeaderCard: {
      alignContent: 'stretch',
      alignItems: 'flex-start',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
    },
    lotOfferHeaderContainer: {
      paddingHorizontal: 16,
      width: '100%',
    },
  }),
}
export default LotOfferHeaderStyles;
