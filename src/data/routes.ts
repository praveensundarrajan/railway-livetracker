import type { Route } from '../types';

export const ROUTES: Record<string, Route> = {
  'MAS-HYB': {
    id: 'MAS-HYB',
    name: 'Chennai Central — Hyderabad Deccan',
    stations: ['MAS', 'AJJ', 'KPD', 'JTJ', 'BNC', 'DPJ', 'SA', 'ED', 'KPG', 'SC', 'HYB'],
  },
  'MAS-BZA': {
    id: 'MAS-BZA',
    name: 'Chennai Central — Vijayawada Jn.',
    stations: ['MAS', 'RU', 'GDR', 'NLR', 'BZA'],
  },
  'HYB-MAS': {
    id: 'HYB-MAS',
    name: 'Hyderabad Deccan — Chennai Central',
    stations: ['HYB', 'SC', 'KPG', 'ED', 'SA', 'DPJ', 'BNC', 'JTJ', 'KPD', 'AJJ', 'MAS'],
  },
};
