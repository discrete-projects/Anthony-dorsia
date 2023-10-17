/** Prizm Style components actively being worked on this component will continue to be updated */
import React, { FC } from 'react';
import {
  ActivityIndicator,
} from 'react-native';
import { ZenAppModal } from '../../Modals/ZenAppModal';

export interface PrizmModalProps {
  /** Icon styles for buttons */
  buttonPrimaryIcon?: string;
  buttonSecondaryIcon?: string;
  /** Title for primary (right-side) button */
  buttonPrimaryTheme?: 'red' | 'black' | 'white' | 'gray' | 'empty';
  buttonSecondaryTheme?: 'red' | 'black' | 'white' | 'gray' | 'empty';
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
}) => (
  <ZenAppModal
    isVisible={isVisible}
    title={heading}
    onClose={onClose}
    onBack={onBack}
    primaryButtonTitle={buttonPrimaryTitle}
    onPrimaryButtonPress={onClickPrimary}
    isPrimaryButtonDisabled={disablePrimaryBtn}
    secondaryButtonTitle={buttonSecondaryTitle}
    onSecondaryButtonPress={onClickSecondary}
    isBackButtonHidden={!showBackButton}
    isFooterHidden={!hasFooter}
  >
    {isLoading
      ? <ActivityIndicator size="small" />
      : contentCards[modalStep || 0]}
  </ZenAppModal>
));
