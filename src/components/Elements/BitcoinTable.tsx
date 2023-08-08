import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {
  StyleSheet,
  Text,
  View,
  AppState,
  AppStateStatus,
  Dimensions,
} from 'react-native';
import {
  fetchBitcoinPrice,
  loadPriceHistory,
  savePriceHistory,
  setCurrentSorting,
  setPages,
} from '../../redux/bitcoinSlice';
import moment from 'moment';
import {filterByInterval} from '../../utils/filtration';
import BackgroundTimer from 'react-native-background-timer';

interface RowProps {
  date: string;
  price: number;
}

const TableRow: React.FC<RowProps> = ({date, price}) => {
  return (
    <View style={styles.row}>
      <Text style={styles.cell}>{date}</Text>
      <View style={styles.separator} />
      <Text style={styles.cell}>$ {price}</Text>
    </View>
  );
};

const BitcoinTable: React.FC = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const dispatch = useDispatch<AppDispatch>();
  const currentPage = useSelector(
    (state: RootState) => state.bitcoin.currentPage,
  );
  const bitcoinData = useSelector(
    (state: RootState) => state.bitcoin.priceHistory,
  );
  const pagination = useSelector(
    (state: RootState) => state.bitcoin.pagination,
  );
  const interval = useSelector((state: RootState) => state.bitcoin.scanPeriod);
  const currentSorting = useSelector(
    (state: RootState) => state.bitcoin.currentSorting,
  );
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      _handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      BackgroundTimer.stopBackgroundTimer();
    } else if (
      appState === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      BackgroundTimer.runBackgroundTimer(
        () => backgroundTimerTask(),
        1 * 60 * 1000,
      );
    }

    setAppState(nextAppState);
  };
  const backgroundTimerTask = () => {
    dispatch(fetchBitcoinPrice()).then(responseAction => {
      const priceData = responseAction.payload;
      dispatch(loadPriceHistory()).then(existingData => {
        if (Array.isArray(existingData)) {
          dispatch(savePriceHistory([...existingData, priceData]));
        }
      });
    });
  };

  const handleSort = (type: string) => {
    let newSorting;
    switch (currentSorting) {
      case `${type}_asc`:
        newSorting = `${type}_desc`;
        break;
      default:
        newSorting = `${type}_asc`;
        break;
    }
    dispatch(setCurrentSorting(newSorting));
  };
  const start = currentPage * pagination;
  const end = start + pagination;
  const Data = filterByInterval([...bitcoinData], interval).sort((a, b) => {
    switch (currentSorting) {
      case 'date_asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'date_desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      default:
        return 0;
    }
  });
  const displayedData = Data.slice(start, end);
  dispatch(setPages(Math.ceil(Data.length / 13)));

  useEffect(() => {
    dispatch(loadPriceHistory());
  }, [dispatch]);

  useEffect(() => {
    if (bitcoinData.length) {
      dispatch(savePriceHistory(bitcoinData));
    }
  }, [bitcoinData, dispatch]);

  useEffect(() => {
    const fetchData = () => dispatch(fetchBitcoinPrice());

    const timeUntilNextMinute = 60 - new Date().getSeconds();
    const initialDelay = timeUntilNextMinute * 1000;

    const firstTimeoutId = setTimeout(() => {
      fetchData();
      const intervalId = setInterval(fetchData, 60000);
      return () => clearInterval(intervalId);
    }, initialDelay);

    return () => clearTimeout(firstTimeoutId);
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.table}>
        <View style={styles.header}>
          <Text style={styles.headerCell} onPress={() => handleSort('date')}>
            Date/Time
          </Text>
          <View style={styles.separator} />
          <Text style={styles.headerCell} onPress={() => handleSort('price')}>
            Bitcoin Price
          </Text>
        </View>
        <View style={styles.body}>
          {displayedData.map((data, index) => (
            <TableRow
              key={index}
              date={
                interval === '1hr'
                  ? moment(data.date).format('YYYY:MM:DD hh')
                  : moment(data.date).format('YYYY:MM:DD hh:mm')
              }
              price={Math.floor(data.price)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  table: {
    flex: 0.95,
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    height: 50,
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    paddingTop: 15,
    fontWeight: 'bold',
    height: 50,
  },
  body: {
    flexGrow: 1,
  },
  separator: {
    width: 1,
    borderColor: 'balck',
    borderWidth: 0.5,
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: '#e0e0e0',
    height: (height - 175) / 13,
  },
  cell: {
    textAlign: 'center',
    flex: 1,
    padding: 10,
    fontSize: 14,
  },
});

export default BitcoinTable;
