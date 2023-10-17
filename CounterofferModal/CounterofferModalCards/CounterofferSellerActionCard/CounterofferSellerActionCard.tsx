/**
 * CounterofferSellerActionCard
 * Renders the card for a SELLER's open offers and counteroffers
 */
import React, {
  FC, useEffect, useState,
} from 'react';
import {
  KeyboardAvoidingView, Platform, TextInput, useWindowDimensions, View,
} from 'react-native';
import moment from 'moment';
import translate, {
  translationKeys,
} from '../../../../../lib/translations';
import {
  AccountOffer,
  convertNumberToCurrency,
  formatTimeRemaining,
  getTimeRemaining,
  onlyAllowNumberInput,
  ZenPageLinks,
} from '../../../../../lib';
import CounterofferSellerActionCardStyles from './CounterofferSellerActionCard.styles';
import {
  CombineResponsiveStyles,
  CombineResponsiveStylesheets,
} from '../../../../ResponsiveStyles';
import CommonStyles from '../../../../../styles/commonStyles';
import { ZenText } from '../../../../ZenText';
import { ZenAnchorButton, ZenButton } from '../../../../Button';
import { InfoRow } from '../../../../InfoRow';
import { ZenDivider, ZenIcomoonIcon } from '../../../../ZenCommon';
import { color } from '../../../../../styles/variables';
import CounterSVG from '../../../../Icon/CounterSVG';
import { CounterofferStatusBar } from '../../CounterofferModalComponents/CounterofferStatusBar';

const responsiveStyles = CombineResponsiveStyles(
  CombineResponsiveStylesheets([CounterofferSellerActionCardStyles, CommonStyles]),
);

export interface CounterofferSellerActionCardProps {
  counterofferAmount: string;
  counterofferAmountHasError: boolean;
  counterofferAmountInvalidError: boolean;
  offer?: AccountOffer;
  selectedAction: string;
  setCounterofferAmount: (amount: string) => void;
  setCounterofferAmountHasError: (value: boolean) => void;
  setCounterofferAmountInvalidError: (value: boolean) => void;
  setSelectedAction: (action: string) => void;
}

export const CounterofferSellerActionCard: FC<CounterofferSellerActionCardProps> = ({
  counterofferAmount,
  counterofferAmountHasError,
  counterofferAmountInvalidError,
  offer,
  selectedAction,
  setCounterofferAmount,
  setCounterofferAmountHasError,
  setCounterofferAmountInvalidError,
  setSelectedAction,
}) => {
  const { width } = useWindowDimensions();
  const [styles, setStyles] = useState<any>(
    responsiveStyles(width),
  );
  const buyerMustAcceptOrDeclined = offer && offer.numberOfBuyerOffersRemaining === 0;

  useEffect(() => {
    const newStyles = responsiveStyles(width);
    setStyles(newStyles);
  }, [width]);

  const expiresAt = offer?.createdAt
    ? moment.utc(offer.createdAt).add(24, 'hours').format()
    : '';

  const timeRemaining = formatTimeRemaining(getTimeRemaining(expiresAt || ''))
  const changeText = (text: string) => {
    setCounterofferAmount(onlyAllowNumberInput(text));
  }

  const renderActionCardHeader = () => (
    <View style={styles.offerReviewAmount}>
      <ZenText
        style={[
          styles.display3Text,
        ]}
      >
        {!!offer && convertNumberToCurrency(offer.offerPrice)}
      </ZenText>
    </View>
  );

  const renderOfferReviewSubtitle = () => (
    <View style={styles.offerReviewSubtitle}>
      <ZenText
        style={[
          styles.body2Text,
          styles.lightForeground3Text,
        ]}
      >
        {`${translate.string(translationKeys.Account.userOffer.expiresIn)} `}
        {timeRemaining}
      </ZenText>
      <ZenText
        style={[
          styles.body2Text,
          styles.lightForeground3Text,
        ]}
      >
        {`${translate.string(translationKeys.Account.userOffer.listedAt)} `}
        {convertNumberToCurrency(offer?.lotPrice)}
      </ZenText>
    </View>
  );

  const renderYourProceedsRow = () => (
    <InfoRow
      title={translate.string(
        translationKeys.Account.userOffer.yourProceeds,
      )}
      titleStyles={[
        styles.body1Text,
        styles.lightForeground2Text,
      ]}
      containerStyle={styles.offerReviewInfoRow}
    >
      <ZenText
        style={[
          styles.body1Text,
          styles.lightForeground2Text,
        ]}
      >
        {!!offer && convertNumberToCurrency(offer.offerProceeds)}
      </ZenText>
    </InfoRow>
  );

  const renderExchangeFeeRow = () => {
    const feeTC = `${translate.string(translationKeys.counteroffer.feeTC)}`;
    const feeTC2 = `${translate.string(translationKeys.counteroffer.feeTC2)}`;
    const aboutLink = `${ZenPageLinks.about}`;

    return (
      <>
        <InfoRow
          title={
            offer ? `${offer.marketplaceFeePercent}% ${translate.string(
              translationKeys.Account.userOffer.marketplaceFee,
            )}` : ''
          }
          titleStyles={[
            styles.body1Text,
            styles.lightForeground2Text,
          ]}
          containerStyle={styles.offerReviewInfoRow}
        >
          <ZenText
            style={[
              styles.body1Text,
              styles.lightForeground2Text,
            ]}
          >
            {!!offer && convertNumberToCurrency(offer.marketplaceFee)}
          </ZenText>
        </InfoRow>
        <View style={styles.feeRow}>
          <ZenText
            style={[
              styles.caption1Text,
              styles.lightForeground3Text,
            ]}
          >
            {feeTC}
          </ZenText>
          {Platform.OS === 'web' && (
            <ZenAnchorButton
              href={aboutLink}
              accessibilityRole="link"
              accessibilityLabel={feeTC2}
            >
              <ZenText
                style={[
                  styles.caption1Text,
                  styles.lightForeground3Text,
                  styles.feeLink,
                ]}
              >
                {feeTC2}
              </ZenText>
            </ZenAnchorButton>
          )}
        </View>
        <ZenDivider dividerStyles={styles.offerReviewDivider} />
      </>
    )
  };

  const renderAcceptBtn = () => (
    <ZenButton
      onPress={() => {
        if (selectedAction === 'ACCEPT') {
          setSelectedAction('');
        } else {
          setSelectedAction('ACCEPT');
        }
        setCounterofferAmount('');
        setCounterofferAmountHasError(false);
        setCounterofferAmountInvalidError(false);
      }}
      title={translate.string(
        translationKeys.buttons.buttonKeys.accept,
      )}
      styles={[
        styles.offerReviewButton,
        selectedAction === 'ACCEPT' && styles.acceptButtonSelected,
      ]}
      textStyles={[
        styles.body1StrongText,
        styles.lightForeground1Text,
        selectedAction === 'ACCEPT' && styles.acceptSelectedText,
      ]}
      hoverStyles={[
        styles.offerReviewButtonHovered,
      ]}
      showIcon
      customIcon={(
        <ZenIcomoonIcon
          name="Checkmark-Circle-1"
          size={24}
          color={color.lightSuccess2}
          style={styles.offerReviewButtonIcon}
        />
      )}
    />
  );

  const renderDeclineBtn = () => (
    <ZenButton
      onPress={() => {
        if (selectedAction === 'DECLINE') {
          setSelectedAction('');
        } else {
          setSelectedAction('DECLINE');
        }
        setCounterofferAmount('');
        setCounterofferAmountHasError(false);
        setCounterofferAmountInvalidError(false);
      }}
      title={translate.string(
        translationKeys.buttons.buttonKeys.decline,
      )}
      styles={[
        styles.offerReviewButton,
        selectedAction === 'DECLINE' && styles.declineButtonSelected,
      ]}
      textStyles={[
        styles.body1StrongText,
        styles.lightForeground1Text,
        selectedAction === 'DECLINE' && styles.declineSelectedText,
      ]}
      hoverStyles={[
        styles.offerReviewButtonHovered,
      ]}
      showIcon
      customIcon={(
        <ZenIcomoonIcon
          name="Dismiss-Circle-1"
          size={24}
          color={color.lightError2}
          style={styles.offerReviewButtonIcon}
        />
      )}
    />
  )

  const renderCounterofferBtn = () => (
    <ZenButton
      onPress={() => {
        if (selectedAction === 'COUNTER') {
          setSelectedAction('');
        } else {
          setSelectedAction('COUNTER');
        }
        setCounterofferAmount('');
        setCounterofferAmountHasError(false);
        setCounterofferAmountInvalidError(false);
      }}
      title={translate.string(
        translationKeys.buttons.buttonKeys.counter,
      )}
      styles={[
        styles.offerReviewButton,
        selectedAction === 'COUNTER' && styles.counterButtonSelected,
      ]}
      textStyles={[
        styles.body1StrongText,
        styles.lightForeground1Text,
        selectedAction === 'COUNTER' && styles.counterofferSelectedText,
      ]}
      hoverStyles={[
        styles.offerReviewButtonHovered,
      ]}
      showIcon
      customIcon={(
        <View style={styles.offerReviewButtonIcon}>
          <CounterSVG
            SVGFill="#065FF5"
            SVGWidth={22}
            SVGHeight={22}
          />
        </View>
      )}
    />
  );

  const renderCounterofferInput = () => (
    <View style={styles.counterInputContainer}>
      <TextInput
        onChangeText={changeText}
        value={counterofferAmount ? convertNumberToCurrency(+counterofferAmount) : ''}
        style={[
          styles.body2Text,
          styles.counterInputStyles,
          counterofferAmountHasError && styles.inputErrorContainer,
          counterofferAmountInvalidError && styles.inputErrorContainer,
        ]}
        placeholder={translate.string(
          translationKeys.counteroffer.enterCounteroffer,
        )}
      />
      {!counterofferAmountInvalidError && !counterofferAmountHasError && (
        <ZenText style={styles.caption1Text}>
          {translate.string(
            translationKeys.counteroffer.offerIsRequired,
          )}
        </ZenText>
      )}
      {counterofferAmountInvalidError && (
        <ZenText style={[styles.caption1Text, styles.errorText]}>
          {translate.string(translationKeys.fixedPrice.checkout.error.offerBetween)}
        </ZenText>
      )}
      {counterofferAmountHasError && (
        <ZenText style={[styles.caption1Text, styles.errorText]}>
          {translate.string(translationKeys.fixedPrice.checkout.error.nonValidOffer)}
        </ZenText>
      )}
    </View>
  );

  const renderActionCardSubtitle = () => (
    <View style={styles.disclaimerSubtitle}>
      <ZenText
        style={[
          styles.caption1Text,
          styles.lightForeground3Text,
        ]}
      >
        {translate.string(
          translationKeys.Account.userOffer.reviewDisclaimer,
        )}
      </ZenText>
    </View>
  );
  const renderCounterofferStatusBar = (): React.ReactElement => {
    const statusMessage = buyerMustAcceptOrDeclined ? translate.string(translationKeys.fixedPrice.actions.buyerNoOffersRemaining) : '';
    const statusMessageBody = buyerMustAcceptOrDeclined ? translate.string(translationKeys.fixedPrice.actions.buyerCanOnlyAcceptOrDecline) : '';
    return (
      <CounterofferStatusBar
        isSeller={false}
        statusMessage={statusMessage}
        statusMessageBody={statusMessageBody}
      />
    )
  };

  return (
    <KeyboardAvoidingView
      behavior="position"
      style={styles.actionCardContainer}
    >
      {buyerMustAcceptOrDeclined && renderCounterofferStatusBar()}
      <View style={styles.actionsCardBody}>
        {renderActionCardHeader()}
        {renderOfferReviewSubtitle()}
        {renderExchangeFeeRow()}
        {renderYourProceedsRow()}
        <View style={styles.offerReviewButtonRow}>
          {renderAcceptBtn()}
          {renderDeclineBtn()}
          {renderCounterofferBtn()}
        </View>
        {selectedAction === 'COUNTER' ? renderCounterofferInput()
          : renderActionCardSubtitle()}
      </View>
    </KeyboardAvoidingView>
  );
};
