/**
 * CounterofferSellerActionResponseCard.tsx
 * Renders a response card for a SELLER's offer or counteroffer
 */
import React, {
  FC, useEffect, useState,
} from 'react';
import { useWindowDimensions, View } from 'react-native';
import translate, {
  translationKeys,
} from '../../../../../lib/translations';
import CounterofferActionResponseCardStyles from './CounterofferSellerActionResponseCard.styles';
import {
  CombineResponsiveStyles,
  CombineResponsiveStylesheets,
} from '../../../../ResponsiveStyles';
import CommonStyles from '../../../../../styles/commonStyles';
import { ZenText } from '../../../../ZenText';
import { convertNumberToCurrency } from '../../../../../lib/helpers/commonHelper';
import { ZenAnchorButton } from '../../../../Button/ZenAnchorButton';
import { ZenPageLinks } from '../../../../../lib/constants/routeConstants';
import { AccountOffer } from '../../../../../lib/types/APITypes';

const responsiveStyles = CombineResponsiveStyles(
  CombineResponsiveStylesheets([CounterofferActionResponseCardStyles, CommonStyles]),
);

export interface SellerActionResponseCardProps {
  offer?: AccountOffer;
  counterofferAmount: string;
  failureResponse?: string;
  selectedAction: string;
}

export const CounterofferSellerActionResponseCard: FC<SellerActionResponseCardProps> = ({
  offer,
  counterofferAmount,
  failureResponse,
  selectedAction,
}) => {
  const { width } = useWindowDimensions();
  const [styles, setStyles] = useState<any>(
    responsiveStyles(width),
  );

  useEffect(() => {
    const newStyles = responsiveStyles(width);
    setStyles(newStyles);
  }, [width]);

  const renderAcceptResponse = () => (
    <>
      <View style={styles.responseHeaderContainer}>
        <ZenText style={styles.acceptResponseHeader}>
          {`${convertNumberToCurrency(offer?.offerPrice)} ${translate.string(translationKeys.counteroffer.accepted)}`}
        </ZenText>
      </View>
      <ZenText style={styles.responseCardBody}>
        {translate.string(translationKeys.counteroffer.acceptResponse)}
      </ZenText>
    </>
  )
  const renderCounterofferResponse = () => (
    <>
      <View style={styles.responseHeaderContainer}>
        <ZenText style={styles.acceptResponseHeader}>
          {`${convertNumberToCurrency(+counterofferAmount)} ${translate.string(translationKeys.counteroffer.counteroffer)}`}
        </ZenText>
      </View>
      <ZenText style={styles.responseCardBody}>
        {translate.string(translationKeys.counteroffer.counterofferResponse)}
      </ZenText>
    </>
  )
  const renderDeclineResponse = () => (
    <>
      <View style={styles.responseHeaderContainer}>
        <ZenText style={styles.acceptResponseHeader}>
          {`${convertNumberToCurrency(offer?.offerPrice)} ${translate.string(translationKeys.counteroffer.declined)}`}
        </ZenText>

      </View>
      <ZenText style={styles.responseCardBody}>
        {translate.string(translationKeys.counteroffer.declineResponse)}
      </ZenText>
    </>
  )

  const renderInvalidResponse = () => (
    <>
      <View style={styles.responseHeaderContainer}>
        <ZenText style={styles.acceptResponseHeader}>
          {`${convertNumberToCurrency(+counterofferAmount)} ${translate.string(translationKeys.counteroffer.offerInvalid)}`}
        </ZenText>
      </View>
      <ZenText style={styles.responseCardBody}>
        {translate.string(translationKeys.counteroffer.invalidResponse)}
      </ZenText>
    </>
  )

  const renderErrorResponse = () => (
    <>
      <View style={styles.responseHeaderContainer}>
        <ZenText style={styles.acceptResponseHeader}>
          {failureResponse || failureResponse === '' ? `${failureResponse}` : translate.string(translationKeys.counteroffer.errorHeading)}
        </ZenText>
      </View>
      <ZenText style={styles.responseCardBody}>
        {translate.string(translationKeys.counteroffer.errorResponse)}
        <ZenAnchorButton
          style={styles.linkStyles}
          href={ZenPageLinks.contact}
          accessibilityLabel={translate.string(
            translationKeys.counteroffer.errorResponseContact,
          )}
        >
          {translate.string(translationKeys.counteroffer.errorResponseContact)}
        </ZenAnchorButton>
        {translate.string(translationKeys.counteroffer.errorResponseEnd)}
      </ZenText>
    </>
  )

  const renderResponseCard = (responseAction: string) => {
    const responseCardDictionary: { [key: string]: () => JSX.Element } = {};
    const responseCardDictionaryKey = responseAction.toLowerCase();
    responseCardDictionary.accept = () => renderAcceptResponse();
    responseCardDictionary.counter = () => renderCounterofferResponse();
    responseCardDictionary.decline = () => renderDeclineResponse();
    responseCardDictionary.fail = () => renderErrorResponse();
    responseCardDictionary.failure = () => renderErrorResponse();
    responseCardDictionary.invalid = () => renderInvalidResponse();
    responseCardDictionary.payment_invalid = () => renderInvalidResponse();

    if (Object.prototype.hasOwnProperty.call(responseCardDictionary, responseCardDictionaryKey)) {
      return responseCardDictionary[responseCardDictionaryKey]();
    }
    return renderErrorResponse();
  }

  return (
    <>
      <View style={styles.actionsCardBody}>
        {renderResponseCard(selectedAction.toLowerCase())}
      </View>
    </>
  )
}
