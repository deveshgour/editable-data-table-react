/**
 * Typed useDispatch hook for the application.
 */

import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/redux/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
