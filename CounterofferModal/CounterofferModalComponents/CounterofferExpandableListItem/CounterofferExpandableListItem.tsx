/**
 * CounterofferExpandableListItem.tsx
 * Renders an expandable list containing the counteroffer history
 */
import React, {
  FC, useEffect, useState,
} from 'react';
import {
  View,
  useWindowDimensions,
} from 'react-native';
import {
  getTimeFormatting,
  convertNumberToCurrency,
  Lot,
} from '../../../../../lib';

import translate, {
  translationKeys,
} from '../../../../../lib/translations';

import CounterofferExpandableListItemStyles from './CounterofferExpandableListItem.styles';
import {
  CombineResponsiveStyles,
  CombineResponsiveStylesheets,
} from '../../../../ResponsiveStyles';
import CommonStyles from '../../../../../styles/commonStyles';
import { ZenText } from '../../../../ZenText';

const responsiveStyles = CombineResponsiveStyles(
  CombineResponsiveStylesheets([CounterofferExpandableListItemStyles, CommonStyles]),
);

export interface ICounteroffer {
  bidderId: string;
  createdAt: string;
  endedAt: string;
  lotId: string;
  offerFee: number;
  offerId: string;
  offerPrice: number;
  offerProfit: number;
  status: string;
  type: string;
  paymentMethodId: string;
  stripePaymentIntentId: string
}

export interface CounterofferExpandableListItemProps {
  counteroffer: ICounteroffer;
  isLast: boolean;
  isSeller: boolean;
  lot: Lot,
}

export const CounterofferExpandableListItem: FC<CounterofferExpandableListItemProps> = (
  {
    counteroffer,
    isLast,
    isSeller,
    lot,
  },
) => {
  const { width } = useWindowDimensions();

  const [styles, setStyles] = useState<any>(
    responsiveStyles(width),
  );

  const listedPrice = lot.current_price || 0;
  const offerPrice = counteroffer.offerPrice || 0;
  const priceDifference = Math.abs(offerPrice - listedPrice);
  const isOfferAbove = offerPrice >= listedPrice;

  useEffect(() => {
    const newStyles = responsiveStyles(width);
    setStyles(newStyles);
  }, [width]);

  let isOpeningOffer = false;

  const getTitle = () => {
    if (isSeller && counteroffer.type === 'COUNTER_BY_SELLER') {
      return translate.string(
        translationKeys.counteroffer.youSent,
      );
    }

    if (isSeller && counteroffer.type === 'COUNTER_BY_BUYER') {
      return translate.string(
        translationKeys.counteroffer.theySent,
      );
    }

    if (!isSeller && counteroffer.type === 'COUNTER_BY_SELLER') {
      return translate.string(
        translationKeys.counteroffer.theySent,
      );
    }

    if (!isSeller && counteroffer.type === 'COUNTER_BY_BUYER') {
      return translate.string(
        translationKeys.counteroffer.youSent,
      );
    }

    isOpeningOffer = true;

    if (isOpeningOffer && isSeller) {
      isOpeningOffer = true;
      return translate.string(
        translationKeys.counteroffer.openingOffer,
      );
    }

    return translate.string(
      translationKeys.counteroffer.openingOffer,
    );
  }

  return (
    <View style={styles.counterofferListItem}>
      <View style={styles.counterofferListItemMetaData}>
        <View
          style={styles.counterofferListItemPriceWrapper}
        >
          <ZenText
            ellipsizeMode="tail"
            numberOfLines={1}
            style={styles.counterofferListItemPriceText}
          >
            {convertNumberToCurrency(counteroffer.offerPrice)}
          </ZenText>
          <ZenText
            ellipsizeMode="tail"
            numberOfLines={1}
            style={styles.counterofferListItemPriceDifferenceText}
          >
            {`${convertNumberToCurrency(priceDifference)} ${translate.string(
              isOfferAbove
                ? translationKeys.Account.userOffer.above
                : translationKeys.Account.userOffer.below,
            ).toLowerCase()}`}
          </ZenText>
        </View>
        <ZenText
          ellipsizeMode="tail"
          numberOfLines={1}
          style={styles.counterofferListItemTimeText}
        >
          {getTimeFormatting(
            'FIXED_PRICE',
            counteroffer.createdAt,
          )}
        </ZenText>
      </View>
      <ZenText
        ellipsizeMode="tail"
        numberOfLines={1}
        style={styles.counterofferListItemAmountText}
      >
        {getTitle()}
      </ZenText>
      {((isOpeningOffer && !isSeller) || (isSeller && counteroffer.type === 'COUNTER_BY_SELLER') || (!isSeller && counteroffer.type === 'COUNTER_BY_BUYER')) && (
        <View
          style={[
            styles.offerStatusIcon,
            styles.declinedFill,
          ]}
        />
      )}
    </View>
  )
}
