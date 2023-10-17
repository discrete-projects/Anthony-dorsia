import {
  StyleSheet,
} from 'react-native';

const CounterofferPaginationBar = StyleSheet.create({
  paginationBarContainer: {
    alignContent: 'center',
    alignItems: 'center',
    display: 'flex',
    paddingBottom: 40,
  },
  paginationBarInnerContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: 225,
    width: '100%',
  },
});

export default CounterofferPaginationBar;
