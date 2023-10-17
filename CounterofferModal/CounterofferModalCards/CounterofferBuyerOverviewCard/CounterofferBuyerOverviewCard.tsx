import React, { FC, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  useWindowDimensions, View,
} from 'react-native';
import { isUndefined } from 'lodash';
import isEmpty from 'lodash/isEmpty';
import {
  AccountOffer,
  createThumbnailImageURL,
  Lot,
} from '../../../../../lib';
import CounterofferBuyerOverviewCardStyles from './CounterofferBuyerOverviewCard.styles';
import * as DataSource from '../../../../../lib/DataSource';
import * as Normalizer from '../../../../../lib/normalizer/DataSourceNormalizer';
import {
  CombineResponsiveStyles,
  CombineResponsiveStylesheets,
} from '../../../../ResponsiveStyles';
import CommonStyles from '../../../../../styles/commonStyles';
import { SellerLotCounterofferList } from '../../SellerLotCounterofferList';
import { LotOfferHeader } from '../../CounterofferModalComponents/LotOfferHeader';

const responsiveStyles = CombineResponsiveStyles(
  CombineResponsiveStylesheets([CounterofferBuyerOverviewCardStyles, CommonStyles]),
);

export interface CounterofferBuyerOverviewCardProps {
  lotMetaSlug: string;
  isFetchingOffers: boolean;
  handlePrimaryBtnClick: (offer: AccountOffer) => void;
  offer?: AccountOffer;
  selectOffer: (offer: AccountOffer) => void;
}

export const CounterofferBuyerOverviewCard: FC<CounterofferBuyerOverviewCardProps> = ({
  lotMetaSlug,
  isFetchingOffers,
  handlePrimaryBtnClick,
  offer,
  selectOffer,
}) => {
  const { width } = useWindowDimensions();
  const [styles, setStyles] = useState<any>(
    responsiveStyles(width),
  );
  const [lot, setLot] = useState<Lot>();
  const {
    overviewCardContainerStyle,
    tabPanelInnerWrapperStyle,
    tabPanelLoadingWrapperStyle,
  } = styles;

  const fetchLotData = async () => {
    const response = await DataSource.getLots([lotMetaSlug]);
    if (response.statusCode === 200) {
      const lotData = Normalizer.NormalizeSingleItem(response);
      setLot(lotData);
    }
  }

  useEffect(() => {
    fetchLotData();
  }, []);

  useEffect(() => {
    const newStyles = responsiveStyles(width);
    setStyles(newStyles);
  }, [width]);

  const renderTabPanelInnerContainer = (): React.ReactElement => (
    <View style={tabPanelInnerWrapperStyle}>
      {isFetchingOffers ? (
        <View style={tabPanelLoadingWrapperStyle}>
          <View style={{ width: '100%', paddingTop: 32 }}>
            <ActivityIndicator size="small" />
          </View>
        </View>
      ) : (
        (!isUndefined(offer) && !isUndefined(lot) && !isEmpty(lot))
        && (
          <SellerLotCounterofferList
            handlePrimaryBtnClick={handlePrimaryBtnClick}
            isSeller={false}
            key={lotMetaSlug}
            lot={lot}
            offers={[offer]}
            selectOffer={selectOffer}
          />
        )
      )}
    </View>
  );

  const renderCardHeader = (): React.ReactElement => (
    <View style={styles.lotOfferHeaderContainer}>
      {!!lot && (
        <LotOfferHeader
          imgUrl={createThumbnailImageURL(lot)}
          lotTitle={lot.title}
          lotPrice={lot.current_price || lot.min_bid_price}
          numberOfBuyerOffersRemaining={offer?.numberOfBuyerOffersRemaining}
          lotOffers={lot.number_of_offers}
        />
      )}
    </View>
  );

  return (
    <View
      style={{ width: '100%' }}
    >
      <View style={overviewCardContainerStyle}>
        {renderCardHeader()}
        {renderTabPanelInnerContainer()}
      </View>
    </View>
  )
}
