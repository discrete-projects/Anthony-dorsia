import React, {
  FC,
  useEffect,
  useState,
} from 'react';
import {
  useWindowDimensions,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import translate, {
  translationKeys,
} from '../../../../lib/translations';
import {
  AccountOffer,
  convertNumberToCurrency,
} from '../../../../lib';
import SellerLotCounterofferListItemStyles from './SellerLotCounterofferListItemStyles.styles';
import {
  CombineResponsiveStyles,
  CombineResponsiveStylesheets,
} from '../../../ResponsiveStyles';
import CommonStyles from '../../../../styles/commonStyles';

import { ZenText } from '../../../ZenText';
import { gradients } from '../../../../styles/variables';
import { PrizmButton } from '../../../_prizm/PrizmButton/PrizmButton';

const responsiveStyles = CombineResponsiveStyles(
  CombineResponsiveStylesheets([SellerLotCounterofferListItemStyles, CommonStyles]),
);

export interface SellerLotCounterofferListItemProps {
  isOfferAbove: boolean;
  offerIndex: number;
  offerKey: string;
  offerPrice: number;
  offerPriceDifference: number;
  offerStatus: string;
  timeRemaining: string;
  timeText: string;
  offers: AccountOffer[];
  offerEndTime: string;
  selectOffer: (offer: AccountOffer) => void;
  offer: AccountOffer;
}

export const SellerLotCounterofferListItem: FC<SellerLotCounterofferListItemProps> = ({
  isOfferAbove,
  offerKey,
  offerPrice,
  offerPriceDifference,
  offerStatus,
  timeRemaining,
  timeText,
  offerEndTime,
  selectOffer,
  offer,
}) => {
  const { width } = useWindowDimensions();
  const [styles, setStyles] = useState<any>(
    responsiveStyles(width),
  );

  useEffect(() => {
    const newStyles = responsiveStyles(width);
    setStyles(newStyles);
  }, [width]);

  const renderStatusIcon = (offerStatus: string) => {
    switch (offerStatus.toLowerCase()) {
      case 'accepted':
        return (
          <LinearGradient
            colors={gradients.green.color}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            locations={gradients.green.location}
            style={styles.offerStatusIcon}
          />
        );
      case 'declined':
        return (
          <View
            style={[
              styles.offerStatusIcon,
              styles.declinedFill,
            ]}
          />
        );
      case 'expired':
        return (
          <View
            style={[
              styles.offerStatusIcon,
              styles.expiredFill,
            ]}
          />
        );
      case 'pending':
        return (
          <LinearGradient
            colors={gradients.blue.color}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            locations={gradients.blue.location}
            style={styles.offerStatusIcon}
          />
        );
      default:
        return <></>;
    }
  }

  return (
    <View
      key={offerKey}
      style={[
        styles.offerItem,
      ]}
    >
      <View style={styles.offerInfoRow}>
        <View
          style={[
            styles.priceRow,
            styles.offerColumn,
          ]}
        >
          <ZenText
            style={[
              styles.body1StrongText,
              styles.offerAmount,
            ]}
          >
            {`${convertNumberToCurrency(offerPrice)}`}
          </ZenText>
          <ZenText
            style={[
              styles.caption1Text,
              styles.lightForeground2Text,
              styles.flexContainer,
            ]}
          >
            {`${convertNumberToCurrency(offerPriceDifference)} ${translate.string(
              isOfferAbove
                ? translationKeys.Account.userOffer.above
                : translationKeys.Account.userOffer.below,
            ).toLowerCase()}`}
          </ZenText>
        </View>
        <View
          style={[
            styles.offerStatusRow,
            styles.offerColumn,
          ]}
        >
          {renderStatusIcon(offerStatus)}
          <ZenText
            style={[
              styles.body2Text,
              styles.lightForeground2Text,
            ]}
          >
            {`${timeText} ${offerStatus.toLowerCase() === 'pending' ? timeRemaining : offerEndTime}`}
          </ZenText>
        </View>
      </View>
      <PrizmButton
        accessibilityLabel={translate.string(
          translationKeys.buttons.buttonKeys.respond,
        )}
        color="black"
        disabled={offerStatus.toLowerCase() !== 'pending'}
        onPress={() => selectOffer(offer)}
        shape="default"
        size="large"
        title={translate.string(
          translationKeys.buttons.buttonKeys.viewOffers,
        )}
      />
    </View>

  )
}
