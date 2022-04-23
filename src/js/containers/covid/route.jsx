import { lazy } from 'react';

export const path = '/';
export const exact = true;
export const title = 'CovidTracker';
export const component = lazy(() => import('./index.jsx'));
