import React, {
  FC, useEffect, useState,
} from 'react';
import {
  useWindowDimensions, View,
} from 'react-native';
import translate, {
  translationKeys,
} from '../../../../../lib/translations';
import CounterofferStatusBarStyles from './CounterofferStatusBar.styles';
import {
  CombineResponsiveStyles,
  CombineResponsiveStylesheets,
} from '../../../../ResponsiveStyles';
import CommonStyles from '../../../../../styles/commonStyles';
import { ZenText } from '../../../../ZenText';
import { color } from '../../../../../styles/variables';
import { ZenIcomoonIcon } from '../../../../ZenCommon';

const responsiveStyles = CombineResponsiveStyles(
  CombineResponsiveStylesheets([CounterofferStatusBarStyles, CommonStyles]),
);

export interface CounterofferStatusBarProps {
  isSeller: boolean;
  statusMessage?: string;
  statusMessageBody?: string;
}

export const CounterofferStatusBar: FC<CounterofferStatusBarProps> = ({
  isSeller,
  statusMessage,
  statusMessageBody,
}) => {
  const { width } = useWindowDimensions();
  const [styles, setStyles] = useState<any>(
    responsiveStyles(width),
  );

  useEffect(() => {
    const newStyles = responsiveStyles(width);
    setStyles(newStyles);
  }, [width]);

  return (
    <View style={styles.noOffersBarContainer}>
      <View style={styles.noOffersBarInner}>
        <ZenText style={styles.noOffersBarHeaderText}>
          {
            isSeller
          && (
            <ZenIcomoonIcon
              name="Error-Circle-1"
              style={styles.warningIcon}
              color={color.lightWarning1}
              size={20}
            />
          )
          }
          {
            isSeller
              ? translate.string(translationKeys.counteroffer.thisListingDoesNotHaveAnyOffers)
              : statusMessage
          }
        </ZenText>
        {
          !isSeller && (
            <ZenText style={styles.noOffersBarBodyText}>
              {statusMessageBody}
            </ZenText>
          )
        }
      </View>
    </View>
  )
}
