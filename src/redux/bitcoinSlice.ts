import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getBitcoinPrice} from '../services/coinMarketCapAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';

interface BitcoinState {
  priceHistory: Array<{date: string; price: number}>;
  scanPeriod: '1min' | '30min' | '1hr';
  pagination: number;
  pages: Float;
  currentPage: number;
  currentSorting: string;
  dateSorting: 'asc' | 'desc' | 'none';
  priceSorting: 'asc' | 'desc' | 'none';
}

const initialState: BitcoinState = {
  priceHistory: [],
  scanPeriod: '1min',
  pagination: 13,
  pages: 0,
  currentPage: 0,
  currentSorting: 'date',
  dateSorting: 'desc',
  priceSorting: 'asc',
};

export const fetchBitcoinPrice = createAsyncThunk(
  'bitcoin/fetchPrice',
  async () => {
    const price = await getBitcoinPrice();
    const date = new Date().toISOString();
    return {date, price};
  },
);

export const loadPriceHistory = createAsyncThunk(
  'bitcoin/loadPriceHistory',
  async () => {
    const savedData = await AsyncStorage.getItem('bitcoinPriceHistory');
    return savedData ? JSON.parse(savedData) : [];
  },
);

export const savePriceHistory = createAsyncThunk(
  'bitcoin/savePriceHistory',
  async (priceHistory: Array<{date: string; price: number}>) => {
    await AsyncStorage.setItem(
      'bitcoinPriceHistory',
      JSON.stringify(priceHistory),
    );
    return priceHistory;
  },
);

const bitcoinSlice = createSlice({
  name: 'bitcoin',
  initialState,
  reducers: {
    setPriceHistory: (
      state,
      action: PayloadAction<Array<{date: string; price: number}>>,
    ) => {
      state.priceHistory = action.payload;
    },
    setCurrentSorting: (state, action) => {
      state.currentSorting = action.payload;
    },
    setScanPeriod: (state, action: PayloadAction<'1min' | '30min' | '1hr'>) => {
      state.scanPeriod = action.payload;
    },
    setPages: (state, action: PayloadAction<number>) => {
      state.pages = action.payload;
    },
    setPagination: (state, action: PayloadAction<number>) => {
      state.pagination = action.payload;
    },
    incrementPage: state => {
      state.currentPage += 1;
    },
    decrementPage: state => {
      state.currentPage -= 1;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchBitcoinPrice.fulfilled, (state, action) => {
      if (!state.priceHistory.some(item => item.date === action.payload.date)) {
        state.priceHistory.push(action.payload);
      }
    });
    builder.addCase(loadPriceHistory.fulfilled, (state, action) => {
      state.priceHistory = action.payload;
    });

    builder.addCase(savePriceHistory.fulfilled, (state, action) => {});
  },
});

export const {
  setPriceHistory,
  setScanPeriod,
  setPages,
  setPagination,
  setCurrentSorting,
  incrementPage,
  decrementPage,
} = bitcoinSlice.actions;
export default bitcoinSlice.reducer;
