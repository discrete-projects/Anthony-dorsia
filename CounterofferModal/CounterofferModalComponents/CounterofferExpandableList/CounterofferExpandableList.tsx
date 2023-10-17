import React, { FC } from 'react';
import { ExpandableList } from '../../../../ExpandableList/ExpandableList';
import { CounterofferExpandableListItem } from '../CounterofferExpandableListItem/CounterofferExpandableListItem';
import { Lot } from '../../../../../lib/types/APITypes';

export interface ICounterOffer {
  bidderId: string;
  createdAt: string;
  endedAt: string;
  lotId: string;
  offerFee: number;
  offerId: string;
  offerPrice: number;
  offerProfit: number;
  paymentMethodId: string;
  status: string;
  stripePaymentIntentId: string
  type: string;
}

export interface CounterofferExpandableListProps {
  counteroffers: ICounterOffer[];
  isSeller: boolean;
  lot: Lot,
}

export const CounterofferExpandableList: FC<CounterofferExpandableListProps> = (
  {
    counteroffers,
    isSeller,
    lot,
  },
) => {
  const renderCounterOfferLog = () => counteroffers
    && counteroffers.map((counteroffer: ICounterOffer, index: number) => (
      <CounterofferExpandableListItem
        counteroffer={counteroffer}
        lot={lot}
        isLast={index === counteroffers.length - 1}
        isSeller={isSeller}
        key={counteroffer.offerId}
      />
    ));

  if (isSeller) {
    return (
      <ExpandableList
        listHeader={`Counteroffer History (${counteroffers.length})`}
        listItems={renderCounterOfferLog()}
      />
    )
  }

  return (
    <>
      {renderCounterOfferLog()}
    </>
  )
}
