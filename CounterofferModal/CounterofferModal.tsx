import React, {
  FC, useCallback, useEffect, useState,
} from 'react';
import { ActivityIndicator } from 'react-native';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import translate, {
  translationKeys,
} from '../../../lib/translations';
import {
  AccountOffer,
  getSellerLotOffers,
  Lot,
  manageSellerLotOffer,
} from '../../../lib';
import { PrizmModal } from '../../_prizm/PrizmModal/PrizmModal';

import { CounterofferSellerOverviewCard } from './CounterofferModalCards/CounterofferSellerOverviewCard';
import { CounterofferSellerActionCard } from './CounterofferModalCards/CounterofferSellerActionCard';
import { CounterofferSellerActionResponseCard } from './CounterofferModalCards/CounterofferSellerActionResponseCard';

import CheckSVG from '../../Icon/CheckSVG/CheckSVG';
import { checkIfOfferIsInRange } from '../../Checkout/MakeOfferCheckout/MakeOffer/MakeOffer.utils';
import { titleCaseFormat } from '../../../lib/helpers/textFormatHelper';

export interface ICounterofferModalProps {
  isVisible: boolean;
  lot: Lot;
  navigation: any;
  selectedLotIdParam?: string;
  selectedOfferIdParam?: string;
  onClose: () => void;
  onOfferAction: () => void;
  setIsReloadingAccountLotList?: (isReloading: boolean) => void;
}

export const CounterofferModal: FC<ICounterofferModalProps> = React.memo(({
  isVisible,
  lot,
  navigation,
  selectedLotIdParam,
  selectedOfferIdParam,
  onClose,
  onOfferAction,
  setIsReloadingAccountLotList,
}) => {
  const [lotId, setLotId] = useState<string>('');
  /** Tracks what modal step a user is on. A step is a sequential page or flow */
  const [modalStep, setModalStep] = useState<number>(0);

  const [counterofferAmount, setCounterofferAmount] = useState<string>('');
  const [counterofferAmountHasError, setCounterofferAmountHasError] = useState<boolean>(false);
  const [
    counterofferAmountInvalidError,
    setCounterofferAmountInvalidError] = useState<boolean>(false);

  const [selectedOffer, setSelectedOffer] = useState<AccountOffer>();
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [failureResponse, setFailureResponse] = useState<string>('');

  const [offers, setOffers] = useState<AccountOffer[][]>([]);
  const [counterOfferCardsLength, setCounterofferCardsLength] = useState<number>(0);
  /** Used for pagination component */
  const [activeOfferPageNumber, setActiveOfferPageNumber] = useState<number>(1);
  const [closedOfferPageNumber, setClosedOfferPageNumber] = useState<number>(1);

  const [currentTab, setCurrentTab] = useState('Active');

  /** Tracks when an user action against an offer is taken */
  const [isTransactionPending, setIsTransactionPending] = useState<boolean>(false);
  /** Tracks when we are fetching offers */
  const [isFetchingOffers, setIsFetchingOffers] = useState<boolean>(true);
  const [fetchedInitialOffers, setFetchedInitialOffers] = useState<boolean>(false);

  const primaryButtonTitles = ['', 'Send Response', 'Back to All Offers'];

  /** Helper function */
  const offerPagesGenerator = (offers: AccountOffer[]) => {
    /** In order to accomplish client-side pagination, we create subarrays of a fixed length */
    const chunkedArray = [];
    if (offers.length === 0) return [];

    while (offers.length > 0) {
      const chunk = offers.splice(0, 12);
      chunkedArray.push(chunk);
    }
    return chunkedArray;
  }

  const fetchOffers = useCallback(async (limit: number, status: string, lotParam?: string) => {
    if (isFetchingOffers) return;
    if (lotId === '') return;
    const getLimit = isUndefined(lotParam) ? limit : undefined;
    let convertedStatus;
    if (status?.toLowerCase() === 'closed') {
      convertedStatus = 'closed'
    } else if (status?.toLowerCase() === 'active') {
      convertedStatus = 'pending'
    } else {
      convertedStatus = 'all'
    }
    setIsFetchingOffers(true);
    const offerData = await getSellerLotOffers(lotId, getLimit, convertedStatus);
    setOffers(offerPagesGenerator(offerData.offers));
    setFetchedInitialOffers(true);
  }, [lotId])

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

  const submitSellerOffer = async (offer: AccountOffer) => {
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
      true,
    );
    if (!isOfferInRange) {
      setCounterofferAmountInvalidError(true);
      setIsTransactionPending(false);
      return;
    }
    if (!!offer && selectedAction) {
      setCounterofferAmountInvalidError(false);
      setIsTransactionPending(true);
      const response = await manageSellerLotOffer(
        offer.lotId,
        offer.offerId,
        selectedAction,
        offerAmountNumber,
      );
      if (response) {
        // eslint-disable-next-line camelcase
        const { counter_offer_id, status, message } = response;
        if (!response || status === 'failure') {
          setOfferTypeFailState(counter_offer_id, message);
        }
      }
      /** Bring the user to the next page when response is complete */
      setModalStep(modalStep + 1);
      setIsTransactionPending(false);
      onOfferAction();
    }
  }
  const handleSellerPrimaryBtnClick = async (offer?: AccountOffer) => {
    if (modalStep === 0 && offer) {
      setSelectedOffer(offer);
    }
    if (modalStep === 1 && selectedOffer) {
      await submitSellerOffer(selectedOffer);
    }
    if (modalStep !== 1 && (modalStep < counterOfferCardsLength)) {
      setModalStep(modalStep + 1);
    }
  }
  const handleBackBtnClick = () => {
    if (modalStep < counterOfferCardsLength) {
      if (modalStep - 1 === 0) {
        fetchOffers(12 * activeOfferPageNumber + 1, fetchedInitialOffers ? currentTab.toLowerCase() : 'active');
      }
      setModalStep(modalStep - 1);
      setSelectedAction('');
      setCounterofferAmount('');
    }
  }
  /** If the user closes the modal -- reset everything to default */
  const exitModalHandler = () => {
    onClose();
    setTimeout(() => {
      setSelectedAction('');
      setModalStep(0);
      setCounterofferAmount('');
      setActiveOfferPageNumber(0);
      setClosedOfferPageNumber(0);
      setCounterofferAmountHasError(false);
      setCounterofferAmountInvalidError(false);
      navigation.setParams({
        lotid: undefined, offerid: undefined,
      });
      if (setIsReloadingAccountLotList) setIsReloadingAccountLotList(true);
    }, 500)
  }
  const handleLastPrimaryBtnClick = () => {
    /**
     * If Seller accepts offer, the last primary button
     * action should close the page returning them to lot offers page
     * */
    if (selectedAction === 'ACCEPT') {
      setSelectedAction('');
      setModalStep(0);
      exitModalHandler();
      return;
    }
    setSelectedAction('');
    setModalStep(0);
    fetchOffers(12 * activeOfferPageNumber + 1, fetchedInitialOffers ? currentTab.toLowerCase() : 'active');
  }
  const paginationBtnHandler = (page: number) => {
    if (currentTab.toLowerCase() === 'active') {
      setActiveOfferPageNumber(page);
      return;
    }

    setClosedOfferPageNumber(page);
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
    if (modalStep === counterOfferCardsLength) {
      return <CheckSVG SVGFill="#FFFFFF" SVGWidth={24} SVGHeight={17} />;
    }

    return <></>
  }
  /**
   * These are the different cards or screen we render inside the modal.
   * Each screen corresponds to a modal "step"
   */

  const contentCards = [
    <CounterofferSellerOverviewCard
      activeOfferPageNumber={activeOfferPageNumber}
      closedOfferPageNumber={closedOfferPageNumber}
      isFetchingOffers={isFetchingOffers}
      fetchOffers={fetchOffers}
      handlePrimaryBtnClick={handleSellerPrimaryBtnClick}
      lot={lot}
      offers={
        offers[currentTab.toLowerCase() === 'active'
          ? activeOfferPageNumber - 1
          : closedOfferPageNumber - 1]
      }
      paginationHandler={paginationBtnHandler}
      selectOffer={selectOffer}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      setSelectedAction={setSelectedAction}
      setCounterofferAmount={setCounterofferAmount}
    />,
    <CounterofferSellerActionCard
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
    <CounterofferSellerActionResponseCard
      offer={selectedOffer}
      counterofferAmount={counterofferAmount}
      failureResponse={failureResponse}
      selectedAction={selectedAction}
    />,
  ];
  useEffect(() => {
    const inferPageNumberType = currentTab.toLowerCase() === 'active' ? activeOfferPageNumber : closedOfferPageNumber;
    fetchOffers(12 * inferPageNumberType + 1, fetchedInitialOffers ? currentTab.toLowerCase() : 'active');
  }, [
    activeOfferPageNumber,
    closedOfferPageNumber,
    currentTab,
    fetchOffers,
    selectedLotIdParam,
  ]);

  useEffect(() => {
    setCounterofferCardsLength(contentCards.length - 1);
  }, [
    contentCards.length,
  ]);

  useEffect(() => {
    if (selectedLotIdParam !== undefined) {
      setLotId(selectedLotIdParam)
    }

    setLotId(lot.lot_id);
  }, [lot.lot_id, selectedLotIdParam]);

  useEffect(() => {
    if (isUndefined(offers) || isEmpty(offers)) return;
    const findOfferWithParam = offers[0].find((offer) => offer.offerId === selectedOfferIdParam);
    const isExpiredOrClosed = findOfferWithParam?.status === 'EXPIRED'
      || findOfferWithParam?.status === 'CLOSED'

    if (
      (selectedOfferIdParam !== undefined)
      && (findOfferWithParam !== undefined)
      && !isExpiredOrClosed) {
      selectOffer(findOfferWithParam);
      setModalStep(1);
    }
    if (
      (selectedOfferIdParam !== undefined)
      && (findOfferWithParam !== undefined)) {
      selectOffer(findOfferWithParam);
      setModalStep(0);
    }
  }, [lot.lot_id, offers, selectedOffer, selectedOfferIdParam]);

  useEffect(() => {
    if (!isUndefined(offers)) {
      setIsFetchingOffers(false);
    }
  }, [offers]);

  return (
    <PrizmModal
      buttonPrimaryTitle={primaryButtonTitles[modalStep]}
      disablePrimaryBtn={
        isTransactionPending
        || (modalStep === 1 && selectedAction === '')
        || ((modalStep === 1 && selectedAction !== '')
          && (selectedAction === 'COUNTER'
            && (!counterofferAmount || counterofferAmount === '0' || counterofferAmount === '00')))
      }
      contentCards={contentCards}
      hasFooter={modalStep > 0}
      heading={getModalTitle(modalStep, selectedAction)}
      iconLeading={getBtnPrimaryIconLeading(modalStep, isTransactionPending)}
      iconLeadingHovered={modalStep === counterOfferCardsLength ? (
        <CheckSVG
          SVGFill="#000000"
          SVGWidth={24}
          SVGHeight={17}
        />
      ) : undefined}
      isVisible={isVisible}
      modalStep={modalStep}
      onBack={() => handleBackBtnClick()}
      onClickPrimary={
        modalStep === counterOfferCardsLength
          ? handleLastPrimaryBtnClick : handleSellerPrimaryBtnClick
      }
      onClose={() => {
        exitModalHandler();
      }}
      showBackButton={modalStep > 0 && (modalStep !== counterOfferCardsLength)}
      startAtCard={0}
    />
  )
});
