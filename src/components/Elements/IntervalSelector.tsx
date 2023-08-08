import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setScanPeriod} from '../../redux/bitcoinSlice';
import {Picker} from '@react-native-picker/picker';
import {RootState} from '../../redux/store';

const IntervalSelector: React.FC = () => {
  const scanInterval = useSelector(
    (state: RootState) => state.bitcoin.scanPeriod,
  );

  const dispatch = useDispatch();

  const handleChange = (interval: '1min' | '30min' | '1hr') => {
    dispatch(setScanPeriod(interval));
  };

  return (
    <Picker
      selectedValue={scanInterval}
      onValueChange={value => handleChange(value as '1min' | '30min' | '1hr')}>
      <Picker.Item label="1 minute" value="1min" />
      <Picker.Item label="30 minutes" value="30min" />
      <Picker.Item label="1 hour" value="1hr" />
    </Picker>
  );
};

export default IntervalSelector;
