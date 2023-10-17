import React, {
  FC, useEffect, useState,
} from 'react';
import {
  KeyboardAvoidingView, TextInput, useWindowDimensions, View,
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
} from '../../../../../lib';
import CounterofferBuyerActionCardStyles from './CounterofferBuyerActionCard.styles';
import {
  CombineResponsiveStyles,
  CombineResponsiveStylesheets,
} from '../../../../ResponsiveStyles';
import CommonStyles from '../../../../../styles/commonStyles';
import { ZenText } from '../../../../ZenText';
import { ZenButton } from '../../../../Button';
import { color } from '../../../../../styles/variables';
import CounterSVG from '../../../../Icon/CounterSVG';
import { CounterofferStatusBar } from '../../CounterofferModalComponents/CounterofferStatusBar';
import { ZenIcomoonIcon } from '../../../../ZenCommon/ZenCommon';

const responsiveStyles = CombineResponsiveStyles(
  CombineResponsiveStylesheets([CounterofferBuyerActionCardStyles, CommonStyles]),
);

export interface CounterofferBuyerActionCardProps {
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

export const CounterofferBuyerActionCard: FC<CounterofferBuyerActionCardProps> = ({
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

  useEffect(() => {
    const newStyles = responsiveStyles(width);
    setStyles(newStyles);
  }, [width]);

  const expiresAt = offer?.createdAt
    ? moment.utc(offer.createdAt).add(24, 'hours').format()
    : '';

  const timeRemaining = formatTimeRemaining(getTimeRemaining(expiresAt || ''))
  const mustAcceptOrDeclined = offer && offer.numberOfBuyerOffersRemaining === 0;

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
  );

  const renderCounterofferBtn = () => (
    <ZenButton
      onPress={() => {
        if (mustAcceptOrDeclined) { return; }
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
        mustAcceptOrDeclined && styles.disabledButton,
        selectedAction === 'COUNTER' && styles.counterofferSelectedText,
      ]}
      hoverStyles={[
        mustAcceptOrDeclined && styles.offerReviewButtonHovered,
      ]}
      pallet={mustAcceptOrDeclined ? 'disable' : undefined}
      showIcon
      customIcon={(
        <View style={styles.counterButtonIcon}>
          <CounterSVG
            SVGHeight={22}
            SVGWidth={22}
            SVGFill={mustAcceptOrDeclined ? '#CACACA' : '#065FF5'}
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
          styles.lightForeground1Text,
        ]}
      >
        {translate.string(
          translationKeys.counteroffer.paymentDetails,
        )}
      </ZenText>
      <ZenText
        style={[
          styles.caption2Text,
          styles.lightForeground3Text,
          styles.disclaimerText,
        ]}
      >
        {translate.string(
          translationKeys.counteroffer.paymentDetailsMessage1,
        )}
      </ZenText>
      <ZenText
        style={[
          styles.caption2Text,
          styles.lightForeground3Text,
          styles.disclaimerText,
        ]}
      >
        {translate.string(
          translationKeys.counteroffer.paymentDetailsMessage2,
        )}
      </ZenText>
      <ZenText
        style={[
          styles.caption1Text,
          styles.lightForeground1Text,
          styles.disclaimerTitle,
        ]}
      >
        {translate.string(
          translationKeys.counteroffer.sendingACounter,
        )}
      </ZenText>
      <ZenText
        style={[
          styles.caption2Text,
          styles.lightForeground3Text,
          styles.disclaimerText,
        ]}
      >
        {translate.string(
          translationKeys.counteroffer.sendingACounterMessage1,
        )}
      </ZenText>
      <ZenText
        style={[
          styles.caption2Text,
          styles.lightForeground3Text,
          styles.disclaimerText,
        ]}
      >
        {translate.string(
          translationKeys.counteroffer.sendingACounterMessage2,
        )}
      </ZenText>
    </View>
  );

  const renderCounterofferStatusBar = (): React.ReactElement => {
    const statusMessage = mustAcceptOrDeclined ? translate.string(translationKeys.fixedPrice.actions.noOffersRemaining) : '';
    const statusMessageBody = mustAcceptOrDeclined ? translate.string(translationKeys.fixedPrice.actions.youCanOnlyAcceptOrDecline) : '';
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
      {mustAcceptOrDeclined && renderCounterofferStatusBar()}
      <View style={styles.actionsCardBody}>
        {renderActionCardHeader()}
        {renderOfferReviewSubtitle()}
        <View style={styles.offerReviewButtonRow}>
          {renderAcceptBtn()}
          {renderDeclineBtn()}
          {renderCounterofferBtn()}
        </View>
        {selectedAction === 'COUNTER' ? renderCounterofferInput()
          : renderActionCardSubtitle()}
      </View>
    </KeyboardAvoidingView>
  )
};
