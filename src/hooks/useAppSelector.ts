/**
 * Typed useSelector hook for the application.
 */

import { useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '@/types';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
