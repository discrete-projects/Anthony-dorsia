/**
 * This component renders a Counteroffer Overview card for
 * Sellers to review closed and open orders and respond to them
 * */

import React, {
  FC,
  useLayoutEffect,
  useState,
  useEffect,
} from 'react';
import {
  GestureResponderEvent,
  TouchableOpacity,
  View,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import isUndefined from 'lodash/isUndefined';
import isEmpty from 'lodash/isEmpty';
import translate, {
  translationKeys,
} from '../../../../../lib/translations';
import {
  AccountOffer,
  Lot,
} from '../../../../../lib';
import CounterofferSellerOverviewCardStyles from './CounterofferSellerOverviewCard.styles';
import { SellerLotCounterofferList } from '../../SellerLotCounterofferList';
import {
  CombineResponsiveStyles,
  CombineResponsiveStylesheets,
} from '../../../../ResponsiveStyles';
import { ZenText } from '../../../../ZenText';
import { LotOfferHeader } from '../../CounterofferModalComponents/LotOfferHeader';
import { CounterofferPaginationBar } from '../../CounterofferModalComponents/CounterofferPaginationBar/CounterofferPaginationBar';
import CommonStyles from '../../../../../styles/commonStyles';

export interface CounterofferSellerOverviewCardProps {
  activeOfferPageNumber: number;
  closedOfferPageNumber: number;
  currentTab: string;
  fetchOffers: (limit: number, status: string, lotParam?: string) => Promise<void>
  handlePrimaryBtnClick: (offer: AccountOffer) => void;
  isFetchingOffers: boolean;
  lot: Lot;
  offers: AccountOffer[];
  paginationHandler: (page: number) => void;
  selectOffer: (offer: AccountOffer) => void;
  setCurrentTab: (tab: string) => void;
  setSelectedAction: (action: string) => void;
  setCounterofferAmount: (amount: string) => void;
}

export const CounterofferSellerOverviewCard: FC<CounterofferSellerOverviewCardProps> = ({
  activeOfferPageNumber,
  closedOfferPageNumber,
  fetchOffers,
  handlePrimaryBtnClick,
  isFetchingOffers,
  lot,
  offers,
  paginationHandler,
  selectOffer,
  currentTab,
  setCurrentTab,
  setSelectedAction,
  setCounterofferAmount,
}) => {
  const responsiveStyles = CombineResponsiveStyles(
    CombineResponsiveStylesheets([CounterofferSellerOverviewCardStyles, CommonStyles]),
  );

  const { width } = useWindowDimensions();
  const [styles, setStyles] = useState<any>(
    responsiveStyles(width),
  );

  useLayoutEffect(() => {
    const newStyles = responsiveStyles(width);
    setStyles(newStyles);
  }, [width]);

  const [activeOffers, setActiveOffers] = useState<AccountOffer[] | undefined>(undefined);
  const [inactiveOffers, setInactiveOffers] = useState<AccountOffer[] | undefined>(undefined);

  const {
    firstTabButtonActiveStyle,
    firstTabButtonStyle,
    overviewCardContainerStyle,
    paginationBarContainerStyle,
    tabButtonActiveStyle,
    tabButtonDisabledStyle,
    tabButtonStyle,
    tabPanelBodyStyle,
    tabPanelHeaderStyle,
    tabPanelInnerWrapperStyle,
    tabPanelLoadingWrapperStyle,
  } = styles;

  const {
    // eslint-disable-next-line camelcase
    lot_id,
  } = lot;

  const tabs = [
    translate.string(translationKeys.counteroffer.active),
    translate.string(translationKeys.counteroffer.closed),
  ];

  /** When modal loads always default to active tab */
  useEffect(() => {
    setCurrentTab('Active');
  }, [setCurrentTab]);

  /** Re-render and update when user changes tabs */
  useLayoutEffect(() => {
    /** Separate auction offers that are closed */
    const sortClosedOffers = offers && offers.filter(
      (offer) => offer.offerStatus === 'EXPIRED'
        || offer.offerStatus === 'ACCEPTED'
        || offer.offerStatus === 'DECLINED',
    );
    /** Separate auction offers that are open */
    const sortActiveOffers = offers && offers.filter((offer) => offer.offerStatus === 'COUNTERED'
      || offer.offerStatus === 'PENDING');

    if (currentTab.toLowerCase() === 'active') {
      const sortedActiveOffers = sortActiveOffers;
      setActiveOffers(sortedActiveOffers);
    } else {
      const sortedInactiveOffers = sortClosedOffers;
      setInactiveOffers(sortedInactiveOffers)
    }
  }, [currentTab, offers]);

  const tabButtonClickHandler = async (event: GestureResponderEvent, index: number) => {
    const targetEl = event.target as unknown as HTMLElement | null;
    if (targetEl === null) return;
    const getInnerText = targetEl.innerText || tabs[index];
    /** In order for the UI to be accurate we need to aggressively fetch for the latest offers */
    await fetchOffers(12, getInnerText.toLowerCase(), lot_id);
    setCurrentTab(getInnerText);
    setSelectedAction('');
    setCounterofferAmount('');
  };

  const renderCardHeader = (): React.ReactElement => {
    const {
      // eslint-disable-next-line camelcase
      current_price, title, number_of_pending_offers, primary_image_name,
    } = lot;
    return (
      <View>
        <LotOfferHeader
          // eslint-disable-next-line camelcase
          imgUrl={primary_image_name}
          isActiveTab={currentTab === 'Active'}
          isSeller
          lotTitle={title}
          // eslint-disable-next-line camelcase
          lotPrice={current_price}
          // eslint-disable-next-line camelcase
          lotOffers={number_of_pending_offers}
          marketplaceFeePercent={currentTab === 'Active' ? activeOffers && activeOffers[0]?.marketplaceFeePercent : undefined}
        />
      </View>
    )
  };

  const tabButtonGenerator = () => !isUndefined(tabs) && tabs.map((tab, index) => {
    const activeStyle = index === 0 ? firstTabButtonActiveStyle : tabButtonActiveStyle;
    const inactiveStyle = index === 0 ? firstTabButtonStyle : tabButtonStyle;
    const buttonStyle = currentTab === tabs[index] ? activeStyle : inactiveStyle;

    return (
      <TouchableOpacity
        key={`tabButtonGenerator-${tabs[index]}`}
        onPress={
          (event) => tabButtonClickHandler(event, index)
        }
        style={[
          buttonStyle,
          isFetchingOffers && tabButtonDisabledStyle,
        ]}
        disabled={isFetchingOffers}
      >
        <ZenText
          ellipsizeMode="tail"
          numberOfLines={1}
          style={[
            styles.caption1Text,
            currentTab === tabs[index] ? styles.lightForeground1Text : styles.lightForeground3Text,
          ]}
        >
          {tabs[index]}
        </ZenText>
      </TouchableOpacity>
    );
  });

  const renderOffersOrEmptyState = (
    activeOffers: AccountOffer[] | undefined,
    inactiveOffers: AccountOffer[] | undefined,
  ): React.ReactElement => {
    if (
      (currentTab.toLowerCase() === 'active' && (!isUndefined(activeOffers) || !isEmpty(activeOffers)))
      || (currentTab.toLowerCase() === 'closed' && (!isUndefined(inactiveOffers) || !isEmpty(inactiveOffers)))
    ) {
      return (
        <SellerLotCounterofferList
          key={lot.auction_id}
          handlePrimaryBtnClick={handlePrimaryBtnClick}
          isSeller
          lot={lot}
          offers={
            currentTab === 'Active'
              ? activeOffers?.slice(0, 11)
              : inactiveOffers?.slice(0, 11)
          }
          selectOffer={selectOffer}
        />
      )
    }
    return (
      <View style={tabPanelLoadingWrapperStyle}>
        <ZenText>No Offers Found</ZenText>
      </View>
    )
  }

  const renderTabPanelInnerContainer = (
    activeOffers: AccountOffer[] | undefined,
    inactiveOffers: AccountOffer[] | undefined,
  ): React.ReactElement => (
    <View style={tabPanelInnerWrapperStyle}>
      {/** Tab bar renders here */}
      <View style={tabPanelHeaderStyle}>{tabButtonGenerator()}</View>
      {/** Offers render here */}
      <View style={tabPanelBodyStyle}>
        {isFetchingOffers ? (
          <View style={tabPanelLoadingWrapperStyle}>
            <View style={{ width: '100%', paddingTop: 32 }}>
              <ActivityIndicator size="small" />
            </View>
          </View>
        ) : (
          renderOffersOrEmptyState(activeOffers, inactiveOffers)
        )}
      </View>
    </View>
  );

  const renderPaginationBar = (total?: number): React.ReactElement => {
    if (isUndefined(total)) return <></>;
    return (
      <CounterofferPaginationBar
        activePage={
          (currentTab.toLowerCase() === 'active'
            ? activeOfferPageNumber
            : closedOfferPageNumber)
        }
        offerTotal={total}
        onClick={paginationHandler}
      />
    )
  };

  const hasPagination = ((currentTab === 'Active' && (activeOffers && activeOffers?.length > 11)) || activeOfferPageNumber > 1)
    || ((currentTab === 'Closed' && (inactiveOffers && inactiveOffers?.length > 11)) || closedOfferPageNumber > 1);

  return (
    <View style={overviewCardContainerStyle}>
      {renderCardHeader()}
      {renderTabPanelInnerContainer(activeOffers, inactiveOffers)}
      {hasPagination && (
        <View style={paginationBarContainerStyle}>
          {
            renderPaginationBar(
              currentTab === 'Active'
                ? activeOffers?.length
                : inactiveOffers?.length,
            )
          }
        </View>
      )}
    </View>
  )
}
