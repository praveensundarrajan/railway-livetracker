import type { Station } from '../types';

export const STATIONS: Record<string, Station> = {
  MAS: { code: 'MAS', name: 'Chennai Central', distanceKm: 0, lat: 13.0827, lng: 80.2707 },
  AJJ: { code: 'AJJ', name: 'Arakkonam', distanceKm: 68, lat: 13.0833, lng: 79.6667 },
  KPD: { code: 'KPD', name: 'Katpadi', distanceKm: 129, lat: 12.9698, lng: 79.1499 },
  JTJ: { code: 'JTJ', name: 'Jolarpettai', distanceKm: 197, lat: 12.5732, lng: 78.5734 },
  BNC: { code: 'BNC', name: 'Bengaluru Cant.', distanceKm: 362, lat: 12.9855, lng: 77.6057 },
  DPJ: { code: 'DPJ', name: 'Dharmapuri', distanceKm: 452, lat: 12.1277, lng: 78.1580 },
  SA: { code: 'SA', name: 'Salem Jn.', distanceKm: 528, lat: 11.6716, lng: 78.1460 },
  ED: { code: 'ED', name: 'Erode Jn.', distanceKm: 580, lat: 11.3410, lng: 77.7172 },
  KPG: { code: 'KPG', name: 'Kacheguda', distanceKm: 590, lat: 17.3803, lng: 78.4991 },
  SC: { code: 'SC', name: 'Secunderabad Jn.', distanceKm: 637, lat: 17.4326, lng: 78.5019 },
  HYB: { code: 'HYB', name: 'Hyderabad Deccan', distanceKm: 645, lat: 17.3753, lng: 78.4744 },
  RU: { code: 'RU', name: 'Renigunta Jn.', distanceKm: 130, lat: 13.6510, lng: 79.5163 },
  GDR: { code: 'GDR', name: 'Gudur Jn.', distanceKm: 208, lat: 14.1487, lng: 79.8514 },
  NLR: { code: 'NLR', name: 'Nellore', distanceKm: 275, lat: 14.4318, lng: 79.9865 },
  BZA: { code: 'BZA', name: 'Vijayawada Jn.', distanceKm: 431, lat: 16.5193, lng: 80.6305 },
};
