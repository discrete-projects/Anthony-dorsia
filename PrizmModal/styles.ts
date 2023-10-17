import {
  Platform,
  PlatformColor,
  StyleSheet,
} from 'react-native';
import {
  color,
  fontFamily,
  fontSize,
  FontVariationSettings,
  fontWeight,
  grays,
} from '../../../styles/variables';
import { CombineResponsiveStyles, CombineResponsiveStylesheets, ResponsiveStyle } from '../../ResponsiveStyles';

const styles: ResponsiveStyle = {
  defaultStyle: StyleSheet.create({
    backButtonContainer: {
      alignContent: 'center',
      alignItems: 'center',
      left: 24.5,
      position: 'absolute',
      top: 24.5,
      ...Platform.select({
        web: {
          verticalTextAlign: 'middle',
        },
      }),
    },
    bodyContainerDouble: {
      backgroundColor: color.white,
      display: 'flex',
      ...Platform.select({
        web: {
          height: 456,
        },
      }),
      width: '100%',
      position: 'relative',
    },
    bodyContainer: {
      backgroundColor: color.white,
      display: 'flex',
      ...Platform.select({
        web: {
          height: 556,
        },
      }),
      width: '100%',
      position: 'relative',
      borderBottomColor: color.lightStroke2,
      borderBottomWidth: 1,
    },
    bodyContainerInner: {
      backgroundColor: color.white,
      borderBottomColor: color.lightStroke2,
      borderBottomWidth: 1,
      height: 100,
      paddingTop: 32,
      width: '100%',
      overflow: 'hidden',
    },
    bodyWithoutFooterContainer: {
      backgroundColor: color.white,
      display: 'flex',
      ...Platform.select({
        web: {
          height: 636,
        },
      }),
      width: '100%',
    },
    checkboxIconContainer: {
      alignContent: 'center',
      alignItems: 'center',
      color: 'white',
      height: 13,
      ...Platform.select({
        web: {
          verticalTextAlign: 'middle',
        },
      }),
      width: 18,
    },
    closeButton: {
      fontSize: fontSize.xNormal,
    },
    closeButtonContainer: {
      alignContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      right: 24.5,
      top: 24.5,
      ...Platform.select({
        web: {
          verticalTextAlign: 'middle',
        },
      }),
    },
    doubleFooterContainer: {
      alignContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      height: 80,
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      width: '100%',
    },
    footerContainer: {
      alignContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      height: 80,
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingVertical: 20,
      width: '100%',
    },
    heading: {
      alignItems: 'center',
      color: color.black,
      display: 'flex',
      fontFamily: fontFamily.AreaNormal,
      fontSize: fontSize.xxNormal,
      ...Platform.select({
        web: {
          fontVariationSettings: FontVariationSettings.BoldNoItalics,
          WebkitFontSmoothing: 'antialiased',
        },
      }),
      fontWeight: fontWeight.medium,
      justifyContent: 'center',
      lineHeight: 64,
      textAlign: 'center',
      ...Platform.select({
        web: {
          verticalTextAlign: 'middle',
          WebkitFontSmoothing: 'antialiased',
        },
      }),
    },
    headingContainer: {
      alignContent: 'stretch',
      alignItems: 'center',
      backgroundColor: 'white',
      borderColor: color.lightStroke2,
      borderWidth: 1,
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      fontFamily: fontFamily.AreaNormal,
      fontSize: fontSize.small,
      height: 64,
      justifyContent: 'center',
      paddingHorizontal: 24,
      width: '100%',
    },
    headingTitleContainer: {
      height: 64,
      width: 'auto',
    },
    innerContainer: {
      height: '100%',
      width: '100%',
    },
    loadingWrapper: {
      marginTop: 32,
    },
    mainContainer: {
      alignContent: 'flex-start',
      alignItems: 'stretch',
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      justifyContent: 'space-between',
      overflow: 'hidden',
    },
    modalBackdrop: {
      backgroundColor: 'black',
      bottom: 0,
      height: '100%',
      left: 0,
      opacity: 0.7,
      position: 'absolute',
      right: 0,
      top: 0,
      width: '100%',
      zIndex: 999,
    },
    modalContainer: {
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: color.white,
      borderRadius: 16,
      ...Platform.select({
        web: {
          boxShadow: '0px 4px 40px rgba(0, 0, 0, 0.2)',
          height: 'calc(100vh - 100px)',
          top: 'calc(50% - (calc(100vh - 100px)/2))',
        },
      }),
      justifyContent: 'center',
      maxHeight: 700,
      maxWidth: 640,
      overflow: 'hidden',
      paddingHorizontal: 0,
      paddingVertical: 0,
      position: 'relative',
      width: '100%',
      zIndex: 9999,
    },
    modalOuterContainer: {
      padding: 20,
      ...Platform.select({
        web: {
          height: '100vh',
        },
      }),
    },
    subHeading: {
      color: grays.textGray,
      fontFamily: fontFamily.AktivGrotesk,
      fontSize: fontSize.normal,
      marginBottom: 30,
      marginTop: 20,
      textAlign: 'center',
    },
    spacer: {
      height: 0,
      width: 0,
    },
  }),
  mobileStyle: StyleSheet.create({
    bodyContainer: {
      ...Platform.select({
        web: {
          height: 536,
        },
      }),
    },
    bodyContainerDouble: {
      ...Platform.select({
        web: {
          height: 456,
        },
      }),
    },
    footerContainer: {
      height: 100,
      paddingBottom: 20,
      paddingTop: 0,
    },
    doubleFooterContainer: {
      height: 180,
    },
    spacer: {
      height: 20,
      width: '100%',
    },
  }),
};

export default CombineResponsiveStyles(
  CombineResponsiveStylesheets([styles]),
);
