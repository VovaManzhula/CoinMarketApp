import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import BitcoinTable from '../Elements/BitcoinTable';
import IntervalSelector from '../Elements/IntervalSelector';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {decrementPage, incrementPage} from '../../redux/bitcoinSlice';
const Main = () => {
  const dispatch = useDispatch();
  const currentPage = useSelector(
    (state: RootState) => state.bitcoin.currentPage,
  );
  const Pages = useSelector((state: RootState) => state.bitcoin.pages);

  const handleNextPage = () => {
    console.log(currentPage, Pages - 1);
    if (currentPage < Pages -1) dispatch(incrementPage());
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      dispatch(decrementPage());
    }
  };
  return (
    <View>
      <IntervalSelector />
      <BitcoinTable />
      <View style={styles.paginationContainer}>
        <Text
          onPress={handlePrevPage}
          style={{
            ...styles.arrowButton,
            opacity: currentPage === 0 ? 0.3 : 1,
          }}>
          ←
        </Text>
        <View style={styles.separator} />
        <Text
          onPress={handleNextPage}
          style={{
            ...styles.arrowButton,
            opacity: currentPage < Pages - 1 ? 1 : 0.3,
          }}>
          →
        </Text>
      </View>
    </View>
  );
};
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  paginationContainer: {
    flexDirection: 'row',
    height: 45,
    marginTop: height - 125,
    alignItems: 'center',
  },
  arrowButton: {
    fontSize: 45,
    width: (width - 1) / 2,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 45,
  },
  separator: {
    width: 1,
    borderColor: 'balck',
    borderWidth: 0.5,
    height: '100%',
  },
});

export default Main;
