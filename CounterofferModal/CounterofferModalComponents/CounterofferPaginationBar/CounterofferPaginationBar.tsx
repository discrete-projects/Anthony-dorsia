import React, { FC } from 'react';
import { View } from 'react-native';
import CounterofferPaginationBarStyles from './CounterofferPaginationBar.styles';
import { PrizmPagination } from '../../../../_prizm/PrizmPagination';

export interface CounterofferPaginationBarProps {
  activePage: number;
  offerTotal?: number;
  onClick: (limit: number) => void;
}

export const CounterofferPaginationBar: FC<CounterofferPaginationBarProps> = ({
  activePage,
  offerTotal,
  onClick,
}) => (
  <View style={CounterofferPaginationBarStyles.paginationBarContainer}>
    <PrizmPagination
      currentPage={activePage}
      onlyPrevNext
      onPageChange={onClick}
      pageSize={12}
      totalCount={offerTotal || 12}
    />
  </View>
)
