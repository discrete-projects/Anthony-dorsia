import React, {
  FC, useEffect, useState,
} from 'react';
import { useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import isUndefined from 'lodash/isUndefined';
import moment from 'moment';
import translate, {
  translationKeys,
} from '../../../../lib/translations';
import {
  AccountOffer,
  convertNumberToCurrency,
  formatTimeRemaining,
  getTimeRemaining,
  Lot,
} from '../../../../lib';
import SellerLotCounterofferListStyles from './SellerLotCounterofferListStyles.styles';
import {
  CombineResponsiveStyles,
  CombineResponsiveStylesheets,
} from '../../../ResponsiveStyles';
import CommonStyles from '../../../../styles/commonStyles';
import { ZenText } from '../../../ZenText';
import { ZenButton } from '../../../Button';
import { gradients } from '../../../../styles/variables';
import { ZenDivider } from '../../../ZenCommon';
import { CounterofferExpandableList } from '../CounterofferModalComponents/CounterofferExpandableList';
import { humanReadableTime } from '../../../AuctionDetails/AuctionDetails.utils';

const responsiveStyles = CombineResponsiveStyles(
  CombineResponsiveStylesheets([SellerLotCounterofferListStyles, CommonStyles]),
);

export interface SellerLotCounterofferListProps {
  handlePrimaryBtnClick: (offer: AccountOffer) => void;
  isSeller: boolean;
  lot: Lot,
  offers?: AccountOffer[];
  selectOffer: (offer: AccountOffer) => void;
}

export const SellerLotCounterofferList: FC<SellerLotCounterofferListProps> = ({
  handlePrimaryBtnClick,
  isSeller,
  lot,
  offers,
}) => {
  const { width } = useWindowDimensions();
  const [styles, setStyles] = useState<any>(
    responsiveStyles(width),
  );

  useEffect(() => {
    const newStyles = responsiveStyles(width);
    setStyles(newStyles);
  }, [width, offers]);

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
      case 'countered':
        return (
          <View
            style={[
              styles.offerStatusIcon,
              styles.counteredFill,
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
    <View style={styles.sellerLotOfferListItemContainer}>
      {!isUndefined(offers) && offers.map((offer) => {
        const { offerId, offerStatus, status } = offer;
        const disableBtn = (status && status.toLowerCase()) === 'expired'
          || (status && status.toLowerCase()) === 'accepted'
          || (status && status.toLowerCase()) === 'declined'
          || (!isSeller && offer.type === 'OPENING_OFFER')
          || (isSeller && offer.type === 'COUNTER_BY_SELLER')
          || (!isSeller && offer.type === 'COUNTER_BY_BUYER');

        const offerPrice = offer.offerPrice || 0;
        const listedPrice = lot.current_price || 0;
        const priceDifference = Math.abs(offerPrice - listedPrice);
        const isOfferAbove = offerPrice >= listedPrice;
        const expiresAt = offer?.createdAt ? moment.utc(offer?.createdAt).add(24, 'hours').format() : '';
        const endedAt = humanReadableTime(offer.endedAt || '') || '';
        const timeRemaining = formatTimeRemaining(getTimeRemaining(expiresAt || ''))

        let timeText = translate.string(
          translationKeys.Account.userOffer.expiresIn,
        );
        if (offer.offerStatus.toLowerCase() === 'accepted') {
          timeText = translate.string(
            translationKeys.Account.userOffer.accepted,
          );
        } else if (offer.offerStatus.toLowerCase() === 'declined') {
          timeText = translate.string(
            translationKeys.Account.userOffer.declined,
          );
        } else if (offer.offerStatus.toLowerCase() === 'expired') {
          timeText = translate.string(
            translationKeys.Account.userOffer.expired,
          );
        }
        const getTitle = () => {
          if (offer.type === 'OPENING_OFFER') {
            return (
              `${translate.string(translationKeys.counteroffer.openingOffer)}, ${timeText} ${offerStatus.toLowerCase() === 'pending' ? timeRemaining : endedAt}
              `
            )
          }

          /** If BUYER (!isSeller) and COUNTER BY BUYER === YOU SENT */
          if (!isSeller && offer.type === 'COUNTER_BY_BUYER') {
            return (
              `${translate.string(translationKeys.counteroffer.youSent)}, ${timeText} ${offerStatus.toLowerCase() === 'pending' ? timeRemaining : endedAt}
              `
            )
          }
          /** Else if SELLER and COUNTER BY BUYER === YOU SENT */
          if (isSeller && offer.type === 'COUNTER_BY_SELLER') {
            return (
              `${translate.string(translationKeys.counteroffer.youSent)}, ${timeText} ${offerStatus.toLowerCase() === 'pending' ? timeRemaining : endedAt}
              `
            )
          }
          return (
            `${translate.string(translationKeys.counteroffer.theySent)}`
          );
        }

        return (
          <React.Fragment key={offerId}>
            <View
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
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={[
                      styles.body3StrongText,
                      styles.offerAmount,
                    ]}
                  >
                    {`${convertNumberToCurrency(offerPrice)}`}
                  </ZenText>
                  <ZenText
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={[
                      styles.caption4Text,
                      styles.flexContainer,
                    ]}
                  >
                    {`${convertNumberToCurrency(priceDifference)} ${translate.string(
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
                  {renderStatusIcon(offer.offerStatus)}
                  <ZenText
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={[
                      styles.body3Text,
                      styles.offerTime,
                    ]}
                  >
                    {
                      /** reuse disableBtn logic to determine
                       * if the offer is from the current user
                       */
                      disableBtn
                        ? getTitle()
                        : `${translate.string(translationKeys.counteroffer.theySent)},
                      ${timeText} 
                      ${offerStatus.toLowerCase() === 'pending' ? timeRemaining : endedAt}
                    `
                    }
                  </ZenText>
                </View>
              </View>
              <ZenButton
                onPress={() => handlePrimaryBtnClick(offer)}
                title={translate.string(
                  translationKeys.buttons.buttonKeys.respond,
                )}
                styles={styles.respondButton}
                textStyles={[
                  styles.body2StrongText,
                  disableBtn ? styles.darkForeground2Text : styles.lightBackground1Text,
                ]}
                hoverTextStyles={[
                  styles.darkBackground1Text,
                ]}
                pallet={disableBtn ? 'disable' : 'black'}
              />
            </View>
            {!isUndefined(offer.counterOffers) && offer.counterOffers.length > 0 && (
              <CounterofferExpandableList
                counteroffers={offer.counterOffers}
                isSeller={isSeller}
                lot={lot}
              />
            )}
            <ZenDivider dividerStyles={styles.offerReviewDivider} />
          </React.Fragment>
        )
      })}
    </View>
  )
};
