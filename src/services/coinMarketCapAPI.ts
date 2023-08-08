import axios, {AxiosError} from 'axios';


const BASE_URL =
  'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-CMC_PRO_API_KEY': '8576baec-ca37-44d9-8be5-30f33c8c6122',
  },
});

export const getBitcoinPrice = async () => {
 
  try {
    const response = await api.get('', {
      params: {
        symbol: 'BTC',
        convert: 'USD',
      },
    });
 
    return response.data.data.BTC.quote.USD.price;
  } catch (error) {
    const err = error as AxiosError;
    console.error(
      'Помилка при отриманні ціни біткоїна:',
      err.response ? err.response.data : err.message,
    );
    throw err;
  }
};
