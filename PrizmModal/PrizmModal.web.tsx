/** Prizm Style components actively being worked on this component will continue to be updated */
import React, {
  FC,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import {
  TouchableWithoutFeedback, View, ActivityIndicator, useWindowDimensions, ScrollView, Platform,
} from 'react-native';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import { ZenTouchableOpacity } from '../../Button';
import { ZenIcomoonIcon } from '../../ZenCommon';
import { ZenText } from '../../ZenText';
import { isiOS } from '../../../lib/helpers/ModalHelper';
import styles from './styles';
import { PrizmButton } from '../PrizmButton';

const Modal = require('modal-react-native-web');

const icons = {
  close: 'fluent-icon-dismiss16regular',
  back: 'fluent-icon-chevron16left-regular',
  check: 'check-circle',
};

export interface PrizmModalProps {
  /** Icon styles for buttons */
  buttonPrimaryIcon?: string;
  buttonSecondaryIcon?: string;
  buttonPrimaryTheme?: 'red' | 'black' | 'white' | 'gray' | 'empty';
  buttonSecondaryTheme?: 'red' | 'black' | 'white' | 'gray' | 'empty';
  /** Title for primary (right-side) button */
  buttonPrimaryTitle: string;
  /** Title for secondary (left-side) button */
  buttonSecondaryTitle?: string;
  /** Pallet styles for buttons */
  buttonPrimaryPallet?: string;
  buttonSecondaryPallet?: string;
  /** Icon Format for buttons */
  buttonPrimaryFormat?: string;
  buttonSecondaryFormat?: string;
  /** JSX Element containing modal content */
  contentCards: React.ReactElement[];
  /** disable button setting */
  disablePrimaryBtn?: boolean;
  disableSecondaryBtn?: boolean;
  hasFooter?: boolean;
  /** heading title for modal */
  heading: string;
  /** loading state */
  isLoading?: boolean;
  /** Load previous modal/contentCard */
  onBack?: () => void;
  /** Invoked function on click of Primary Button */
  onClickPrimary?: () => void;
  /** Invoked function on click of Secondary Button */
  onClickSecondary?: () => void;
  /** Invoked onclick of background or Close Button */
  onClose: () => void;
  /** Toggles if we show back button or not */
  showBackButton?: boolean;
  /** Opens and closes modal */
  isVisible: boolean;
  startAtCard?: number;
  modalStep?: number;
  iconLeading?: JSX.Element;
  iconLeadingHovered?: JSX.Element;
}

export const PrizmModal: FC<PrizmModalProps> = React.memo(({
  buttonPrimaryTitle,
  buttonSecondaryTitle,
  buttonPrimaryTheme,
  buttonSecondaryTheme,
  contentCards,
  disablePrimaryBtn,
  hasFooter,
  heading,
  iconLeading,
  iconLeadingHovered,
  isLoading,
  isVisible,
  modalStep,
  onBack,
  onClickPrimary,
  onClickSecondary,
  onClose,
  showBackButton,
}) => {
  const modalRef = useRef<HTMLInputElement | null>(null);
  const KEY_EVENT_TYPE = 'keyup';

  const { width } = useWindowDimensions();
  const PrizmModalStyles = styles(width);

  useEffect(() => (() => {
    clearAllBodyScrollLocks();
  }), []);

  useEffect(() => {
    /** Disable scroll lock on iOS */
    if (!isiOS()) {
      const { current } = modalRef;
      if (isVisible && current !== null) {
        disableBodyScroll(current);
      } else if (!isVisible && current !== null) {
        clearAllBodyScrollLocks();
      }
    }
  }, [modalRef, isVisible]);

  const handleKeyPress = useCallback((e: any) => {
    const { key, keyCode } = e;
    if (keyCode === 27 || key === 'Escape') {
      onClose();
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      document.addEventListener(KEY_EVENT_TYPE, handleKeyPress, false);
    }
    return () => {
      if (Platform.OS === 'web') {
        document.removeEventListener(KEY_EVENT_TYPE, handleKeyPress, false);
      }
    };
  }, []);

  const renderModalBackDrop = () => (
    <TouchableWithoutFeedback
      onPress={onClose}
    >
      <View
        style={[
          PrizmModalStyles.modalBackdrop,
        ]}
      />
    </TouchableWithoutFeedback>
  );

  const renderModalHeader = (): JSX.Element => (
    <View
      style={PrizmModalStyles.headingContainer}
    >
      {!!onBack && !!showBackButton && (
        <ZenTouchableOpacity
          accessible
          accessibilityLabel="Go back to previous screen"
          accessibilityRole="button"
          onPress={() => onBack()}
          style={PrizmModalStyles.backButtonContainer}
        >
          <ZenIcomoonIcon
            name={icons.back}
            style={[
              PrizmModalStyles.closeButton,
            ]}
          />
        </ZenTouchableOpacity>
      )}
      <View
        style={PrizmModalStyles.headingTitleContainer}
      >
        <ZenText
          style={[
            PrizmModalStyles.heading,
          ]}
        >
          {heading}
        </ZenText>
      </View>
      <ZenTouchableOpacity
        accessible
        accessibilityLabel="Close modal"
        accessibilityRole="button"
        onPress={onClose}
        style={PrizmModalStyles.closeButtonContainer}
      >
        <ZenIcomoonIcon
          name={icons.close}
          style={[
            PrizmModalStyles.closeButton,
          ]}
        />
      </ZenTouchableOpacity>
    </View>
  );

  const renderModalBody = (): JSX.Element => {
    const doubleOrSingleFooter = buttonSecondaryTitle
      ? PrizmModalStyles.bodyContainerDouble : PrizmModalStyles.bodyContainer;

    const bodyStyle = hasFooter
      ? doubleOrSingleFooter
      : PrizmModalStyles.bodyWithoutFooterContainer;

    return (
      <ScrollView
        style={bodyStyle}
      >
        {
          isLoading
            ? (
              <View style={PrizmModalStyles.loadingWrapper}>
                <ActivityIndicator size="small" />
              </View>
            )
            : (
              <ZenText>
                {(contentCards[modalStep || 0])}
              </ZenText>
            )
        }
      </ScrollView>
    )
  };

  const renderModalFooter = (): JSX.Element => (
    <View
      style={
        buttonSecondaryTitle
          ? PrizmModalStyles.doubleFooterContainer : PrizmModalStyles.footerContainer
      }
    >
      {!!buttonSecondaryTitle && (
        <PrizmButton
          accessibilityLabel={`${heading} modal ${buttonSecondaryTitle}`}
          color={buttonSecondaryTheme || 'white'}
          onPress={() => !!onClickSecondary && onClickSecondary()}
          shape="rounded"
          size="medium"
          title={buttonSecondaryTitle}
          withBorder
        />
      )}
      <View style={PrizmModalStyles.spacer} />
      <PrizmButton
        accessibilityLabel={`${heading} modal ${buttonPrimaryTitle}`}
        color={buttonPrimaryTheme || 'black'}
        disabled={disablePrimaryBtn}
        iconLeading={iconLeading}
        iconLeadingHovered={iconLeadingHovered}
        onPress={() => !!onClickPrimary && onClickPrimary()}
        shape="rounded"
        size="large"
        title={buttonPrimaryTitle}
      />
    </View>
  );

  return (
    <View
      accessible
      accessibilityLabel={heading}
      accessibilityViewIsModal={isVisible}
      nativeID="Prizm-Modal"
    >
      <Modal
        animationType="fade"
        appElement={document.getElementById('root')}
        onRequestClose={onClose}
        transparent
        visible={isVisible}
        ref={modalRef}
      >
        <View
          style={[
            PrizmModalStyles.modalOuterContainer,
          ]}
        >
          <View style={[
            PrizmModalStyles.modalContainer,
          ]}
          >
            <View style={PrizmModalStyles.innerContainer}>
              {renderModalHeader()}
              {renderModalBody()}
              {hasFooter && renderModalFooter()}
            </View>
          </View>
          {
            renderModalBackDrop()
          }
        </View>
      </Modal>
    </View>
  )
});
