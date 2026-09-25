export const ACCURACY_BY_HOUR = [
  { hour: '06:00', errorMin: 4.1 },
  { hour: '08:00', errorMin: 5.8 },
  { hour: '10:00', errorMin: 6.2 },
  { hour: '12:00', errorMin: 7.0 },
  { hour: '14:00', errorMin: 6.5 },
  { hour: '16:00', errorMin: 7.8 },
  { hour: '18:00', errorMin: 8.4 },
  { hour: '20:00', errorMin: 7.2 },
  { hour: '22:00', errorMin: 6.0 },
];

export const DELAY_DISTRIBUTION = [
  { bucket: '0-5 min', count: 34 },
  { bucket: '5-15 min', count: 41 },
  { bucket: '15-30 min', count: 22 },
  { bucket: '30-60 min', count: 11 },
  { bucket: '60+ min', count: 4 },
];

export const PREDICTION_ERROR = [
  { day: 'Mon', mae: 6.1 },
  { day: 'Tue', mae: 6.6 },
  { day: 'Wed', mae: 5.9 },
  { day: 'Thu', mae: 7.2 },
  { day: 'Fri', mae: 7.8 },
  { day: 'Sat', mae: 6.4 },
  { day: 'Sun', mae: 5.7 },
];

export const AVG_DWELL_BY_STATION = [
  { station: 'Arakkonam', dwellMin: 2.1 },
  { station: 'Katpadi', dwellMin: 3.4 },
  { station: 'Jolarpettai', dwellMin: 2.6 },
  { station: 'Bengaluru Cant.', dwellMin: 5.8 },
  { station: 'Dharmapuri', dwellMin: 2.2 },
  { station: 'Salem Jn.', dwellMin: 3.9 },
];

export const DELAY_CAUSES = [
  { cause: 'Congestion', pct: 34 },
  { cause: 'Signal delay', pct: 22 },
  { cause: 'Speed restriction', pct: 18 },
  { cause: 'Extended halt', pct: 15 },
  { cause: 'Other', pct: 11 },
];
