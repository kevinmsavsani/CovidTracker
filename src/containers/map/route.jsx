import { lazy } from 'react';

export const path = '/map';
export const exact = true;
export const title = 'Map';
export const component = lazy(() => import('./CovidMap.jsx'));
