import React, {
  FC,
  useEffect,
  useState,
} from 'react';
import {
  ActivityIndicator,
} from 'react-native';
import isUndefined from 'lodash/isUndefined';
import translate, {
  translationKeys,
} from '../../../../../lib/translations';
import {
  AccountOffer,
  manageBuyerLotOffer,
  getUserOffers,
} from '../../../../../lib';
import { PrizmModal } from '../../../../_prizm/PrizmModal/PrizmModal';
import { CounterofferBuyerOverviewCard } from '../../CounterofferModalCards/CounterofferBuyerOverviewCard';
import { CounterofferBuyerActionCard } from '../../CounterofferModalCards/CounterofferBuyerActionCard';
import { CounterofferBuyerActionResponseCard } from '../../CounterofferModalCards/CounterofferBuyerActionResponseCard';
import CheckSVG from '../../../../Icon/CheckSVG/CheckSVG';
import { checkIfOfferIsInRange } from '../../../../Checkout/MakeOfferCheckout/MakeOffer/MakeOffer.utils';
import { titleCaseFormat } from '../../../../../lib/helpers/textFormatHelper';

export interface ManageOfferModalProps {
  isVisible: boolean;
  navigation: any;
  lotId: string;
  lotMetaSlug: string;
  selectedFilter: string;
  offerIdParam?: string;
  onClose: () => void;
  onOfferAction: () => void;
  setIsReloadingAccountLotList?: (value: boolean) => void;
}

export const ManageOfferModal: FC<ManageOfferModalProps> = React.memo(({
  isVisible,
  navigation,
  lotId,
  lotMetaSlug,
  offerIdParam,
  selectedFilter,
  onClose,
  onOfferAction,
  setIsReloadingAccountLotList,
}) => {
  /** Tracks what page of a modal is shown */
  const [modalStep, setModalStep] = useState<number>(0);

  /** Tracks amount as we take this from the use input and render it on the confirmation page */
  const [counterofferAmount, setCounterofferAmount] = useState<string>('');
  const [counterofferAmountHasError, setCounterofferAmountHasError] = useState<boolean>(false);
  const [
    counterofferAmountInvalidError,
    setCounterofferAmountInvalidError] = useState<boolean>(false);

  const [selectedOffer, setSelectedOffer] = useState<AccountOffer>();
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [failureResponse, setFailureResponse] = useState<string>('');

  const [offer, setOffer] = useState<AccountOffer | undefined>();
  const [offerId, setOfferId] = useState<string>('');

  const [isTransactionPending, setIsTransactionPending] = useState<boolean>(false);
  const [isFetchingOffers, setIsFetchingOffers] = useState<boolean>(false);
  const primaryButtonTitles = ['', 'Send Response', 'Done'];
  const lastCardIndex = 2;

  const fetchUserOffers = async () => {
    setIsFetchingOffers(true);
    const response = await getUserOffers(selectedFilter, 12);
    const getOffer = response.offers.find((offer: AccountOffer) => offer.lotId === lotId);
    setOffer(getOffer);
    setIsFetchingOffers(false);
  }

  const selectOffer = (offer: AccountOffer) => {
    setSelectedOffer(offer);
  }

  const setOfferTypeFailState = (counterofferId?: string, message?: string) => {
    if (counterofferId === undefined) {
      setSelectedAction('FAIL');
      setFailureResponse(message ? titleCaseFormat(message) : '');
    }
    return null;
  }

  const handleSubmitBtnClick = async (offer: AccountOffer) => {
    setIsTransactionPending(true);
    let offerAmountNumber = offer.offerPrice;
    if (selectedAction === 'COUNTER') {
      offerAmountNumber = +counterofferAmount;
    }
    if (Number.isNaN(offerAmountNumber) || offerAmountNumber <= 0) {
      setCounterofferAmountHasError(true);
      setIsTransactionPending(false);
      return;
    }
    const isOfferInRange = checkIfOfferIsInRange(
      offer.lotPrice,
      offer.offerPrice,
      offerAmountNumber,
      false,
    );
    if (!isOfferInRange) {
      setCounterofferAmountInvalidError(true);
      setIsTransactionPending(false);
      return;
    }
    if (!!offer && selectedAction) {
      setCounterofferAmountHasError(false);
      setIsTransactionPending(true);
      const response = await manageBuyerLotOffer(
        offer.lotId,
        offer.offerId,
        selectedAction,
        offerAmountNumber,
      )
      if (response) {
        // eslint-disable-next-line camelcase
        const { status, message, counter_offer_id } = response;
        if (!response || status === 'failure') {
          // eslint-disable-next-line camelcase
          setOfferTypeFailState(counter_offer_id, message);
        }

        if (status === 'DECLINED') {
          // eslint-disable-next-line camelcase
          setSelectedAction('decline');
        }
      }
      setModalStep(modalStep + 1);
      setIsTransactionPending(false);
      onOfferAction();
    }
  }

  const handlePrimaryBtnClick = async (offer?: AccountOffer) => {
    if (modalStep === 0 && offer) {
      setSelectedOffer(offer);
    }
    if (modalStep === 1 && selectedOffer) {
      await handleSubmitBtnClick(selectedOffer);
    }
    if (modalStep !== 1 && (modalStep < lastCardIndex)) {
      setModalStep(modalStep + 1);
    }
  }

  const handleBackBtnClick = () => {
    if (modalStep < lastCardIndex) {
      setModalStep(modalStep - 1);
      setSelectedAction('');
      setCounterofferAmount('');
      if (modalStep === 0) {
        fetchUserOffers();
      }
    }
  }

  const handleExitModalClick = () => {
    onClose();
    setTimeout(() => {
      setSelectedAction('');
      setModalStep(0);
      setCounterofferAmount('');
      setCounterofferAmountHasError(false);
      setCounterofferAmountInvalidError(false);
      navigation.setParams({
        lotid: undefined, offerid: undefined,
      });
      if (setIsReloadingAccountLotList) setIsReloadingAccountLotList(true);
    }, 500)
  }

  const getModalTitle = (modalStep: number, selectedAction: string) => {
    let modalTitle = translate.string(
      translationKeys.Account.summary.userLots.offerList,
    );

    if (modalStep === 1) {
      modalTitle = translate.string(
        translationKeys.Account.userOffer.respond,
      );

      return modalTitle
    }

    if (modalStep === 2) {
      if (selectedAction === 'ACCEPT') {
        modalTitle = translate.string(
          translationKeys.Account.userOffer.listingSold,
        );
        return modalTitle;
      }
      if (selectedAction === 'INVALID') {
        modalTitle = translate.string(
          translationKeys.Account.userOffer.invalidOffer,
        );
        return modalTitle;
      }
      if (selectedAction === 'FAIL') {
        modalTitle = translate.string(
          translationKeys.Account.userOffer.failedOffer,
        );
        return modalTitle;
      }

      modalTitle = translate.string(
        translationKeys.counteroffer.responseSent,
      );
      return modalTitle;
    }
    return modalTitle;
  }

  const getBtnPrimaryIconLeading = (modalStep: number, isTransactionPending: boolean) => {
    if (isTransactionPending) {
      return <ActivityIndicator size="small" color="black" />;
    }
    if (modalStep === lastCardIndex) {
      return <CheckSVG SVGFill="#FFFFFF" SVGWidth={24} SVGHeight={17} />;
    }

    return <></>
  }

  const contentCards = [
    <CounterofferBuyerOverviewCard
      isFetchingOffers={isFetchingOffers}
      handlePrimaryBtnClick={handlePrimaryBtnClick}
      offer={offer}
      lotMetaSlug={lotMetaSlug}
      selectOffer={selectOffer}
    />,
    <CounterofferBuyerActionCard
      counterofferAmount={counterofferAmount}
      counterofferAmountHasError={counterofferAmountHasError}
      counterofferAmountInvalidError={counterofferAmountInvalidError}
      offer={selectedOffer}
      selectedAction={selectedAction}
      setCounterofferAmount={setCounterofferAmount}
      setCounterofferAmountHasError={setCounterofferAmountHasError}
      setCounterofferAmountInvalidError={setCounterofferAmountInvalidError}
      setSelectedAction={setSelectedAction}
    />,
    <CounterofferBuyerActionResponseCard
      offer={selectedOffer}
      counterofferAmount={counterofferAmount}
      failureResponse={failureResponse}
      selectedAction={selectedAction}
    />,
  ];

  useEffect(() => {
    fetchUserOffers();
  }, []);

  useEffect(() => {
    if (!isUndefined(offerIdParam)) {
      setOfferId(offerIdParam);
    }
    setOfferId(offerId);
  }, [offer, offerId, offerIdParam]);

  return (
    <PrizmModal
      buttonPrimaryTitle={primaryButtonTitles[modalStep]}
      iconLeading={getBtnPrimaryIconLeading(modalStep, isTransactionPending)}
      iconLeadingHovered={modalStep === lastCardIndex
        ? <CheckSVG SVGFill="#000000" SVGWidth={24} SVGHeight={17} /> : undefined}
      modalStep={modalStep}
      contentCards={contentCards}
      hasFooter={modalStep > 0}
      onClickPrimary={
        modalStep === lastCardIndex
          ? () => {
            handleExitModalClick();
          } : handlePrimaryBtnClick
      }
      disablePrimaryBtn={
        isTransactionPending
        || (modalStep === 1 && selectedAction === '')
        || ((modalStep === 1 && selectedAction !== '')
          && (selectedAction === 'COUNTER'
            && (!counterofferAmount || counterofferAmount === '0' || counterofferAmount === '00')))
      }
      heading={getModalTitle(modalStep, selectedAction)}
      isVisible={isVisible}
      onBack={() => handleBackBtnClick()}
      showBackButton={modalStep > 0 && (modalStep !== lastCardIndex)}
      onClose={() => {
        handleExitModalClick();
      }}
      startAtCard={0}
    />
  )
});
