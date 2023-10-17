import React, {
  FC, useLayoutEffect, useState,
} from 'react';
import {
  Platform, StyleSheet, useWindowDimensions, View,
} from 'react-native';
import translate, {
  translationKeys,
} from '../../../../../lib/translations';
import {
  convertNumberToCurrency,
} from '../../../../../lib';
import LotOfferHeaderStyles from './LotOfferHeader.styles';
import {
  CombineResponsiveStyles,
  CombineResponsiveStylesheets,
} from '../../../../ResponsiveStyles';
import CommonStyles from '../../../../../styles/commonStyles';
import { ZenImage } from '../../../../ZenImage';
import { ZenText } from '../../../../ZenText';

const responsiveStyles = CombineResponsiveStyles(
  CombineResponsiveStylesheets([LotOfferHeaderStyles, CommonStyles]),
);

export interface LotOfferHeaderProps {
  imgUrl: string;
  isSeller?: boolean;
  lotOffers?: number;
  lotPrice?: number;
  lotTitle: string;
  marketplaceFeePercent?: number;
  numberOfBuyerOffersRemaining?: number;
  isActiveTab?: boolean;
}

export const LotOfferHeader: FC<LotOfferHeaderProps> = ({
  imgUrl,
  isSeller,
  lotOffers,
  lotPrice,
  lotTitle,
  marketplaceFeePercent,
  numberOfBuyerOffersRemaining,
  isActiveTab,
}) => {
  const { width } = useWindowDimensions();
  const [styles, setStyles] = useState<any>(
    responsiveStyles(width),
  );

  useLayoutEffect(() => {
    const newStyles = responsiveStyles(width);
    setStyles(newStyles);
  }, [width]);

  return (
    <View style={styles.lotOfferHeaderContainer}>
      <View style={styles.lotOfferHeaderCard}>
        <View style={[styles.lotOfferItemImageContainer, styles.lotOfferItemImageListContainer]}>
          <ZenImage
            alt={lotTitle}
            effect="blur"
            style={StyleSheet.flatten([
              Platform.OS === 'web' ? styles.lotOfferItemImageSizeList : styles.lotOfferItemImageListContainer,
            ]) as React.CSSProperties}
            srcSet={imgUrl}
            src={imgUrl}
          />
        </View>
        <View style={styles.lotOfferHeaderCardInfoContainer}>
          {/** Card Title */}
          <View style={styles.lotOfferHeaderCardInfoRow}>
            <ZenText
              numberOfLines={3}
              ellipsizeMode="tail"
              style={[
                styles.body2Text,
                styles.lightForeground2Text,
              ]}
            >
              {lotTitle}
            </ZenText>
          </View>
          {!!lotPrice && (
            <View style={[styles.lotOfferHeaderCardInfoRow]}>
              <ZenText
                style={[
                  styles.subtitle1Text,
                  styles.lightForeground1Text,
                ]}
              >
                {convertNumberToCurrency(Number(lotPrice))}
              </ZenText>
              <ZenText
                style={[
                  styles.listingPriceText,
                  styles.body2Text,
                  styles.lightForeground2Text,
                ]}
              >
                {translate.string(
                  translationKeys.counteroffer.listedPrice,
                )}
              </ZenText>
            </View>
          )}
          <View style={styles.lotOfferHeaderCardInfoRow}>
            {isSeller ? (
              <ZenText
                style={[
                  styles.caption1Text,
                  styles.lightForeground3Text,
                ]}
              >
                {`${lotOffers || 0}`}
                {translate.string(
                  lotOffers === 1
                    ? translationKeys.fixedPrice.checkout.offer
                    : translationKeys.fixedPrice.checkout.offers,
                )}
              </ZenText>
            ) : (
              <ZenText
                style={[
                  styles.caption1Text,
                  styles.lightForeground3Text,
                ]}
              >
                {translate.string(
                  translationKeys.fixedPrice.checkout.offerRemaining,
                )}
                {`: ${numberOfBuyerOffersRemaining || 0} of 5`}
              </ZenText>
            )}
          </View>
          {/* Disabled until Fee API is more reliable */}
          {/* {(isActiveTab && isSeller) && (
            <View style={styles.lotOfferHeaderCardInfoRow}>
              <ZenText
                style={[
                  styles.caption1Text,
                  styles.lightForeground3Text,
                ]}
              >
                {translate.string(
                  translationKeys.fixedPrice.includes,
                )}
                {marketplaceFeePercent || 0}
                {translate.string(
                  translationKeys.fixedPrice.percentFee,
                )}
              </ZenText>
            </View>
          )} */}
          {/* Disabled until tally becomes more reliable */}
          {/** Card Offer Tally */}
          {/* {lotOffers && (
            <View style={styles.lotOfferHeaderCardInfoRow}>
              <ZenText
                style={[
                  styles.caption1Text,
                  styles.lightForeground3Text,
                ]}
              >
                {`${lotOffers || 0} ${translate.string(
                  translationKeys.Account.userOffer.offer,
                ).toLowerCase()}${lotOffers !== 1 ? 's' : ''}`}
              </ZenText>
            </View>
          )} */}
        </View>
      </View>
    </View>
  )
}
