import moment from 'moment';

export const filterByInterval = (
  data: {date: string; price: number}[],
  interval: string,
) => {
  if (interval === '1min') {
    const seenMinutes: {[key: string]: boolean} = {};
    return data.filter(entry => {
      const minuteKey = moment(entry.date).format('YYYY:MM:DD hh:mm');
      if (!seenMinutes[minuteKey]) {
        seenMinutes[minuteKey] = true;
        return true;
      }
      return false;
    });
  }

  if (interval === '30min') {
    const seenHalfHours: {[key: string]: boolean} = {};
    return data.filter(entry => {
      const minutes = moment(entry.date).minutes();
      if (minutes !== 0 && minutes !== 30) return false;
      const halfHourKey =
        moment(entry.date).format('YYYY:MM:DD hh:mm').substring(0, 15) +
        (minutes < 30 ? '00' : '30');
      if (!seenHalfHours[halfHourKey]) {
        seenHalfHours[halfHourKey] = true;
        return true;
      }
      return false;
    });
  }

  if (interval === '1hr') {
    const seenHours: {[key: string]: boolean} = {};
    return data.filter(entry => {
      const minutes = moment(entry.date).minutes();
      if (minutes !== 0) return false;
      const hourKey = moment(entry.date).format('YYYY:MM:DD hh');
      if (!seenHours[hourKey]) {
        seenHours[hourKey] = true;
        return true;
      }
      return false;
    });
  }
  return data;
};
