/**
 * Unsaved changes warning hook.
 * Shows browser-native confirmation dialog when the user tries
 * to leave the page with unsaved edits.
 */

import { useEffect } from 'react';
import { useAppSelector } from './useAppSelector';
import { selectHasUnsavedChanges } from '@/redux/selectors/tableSelectors';

export function useUnsavedChangesWarning() {
  const hasUnsavedChanges = useAppSelector(selectHasUnsavedChanges);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        /* Modern browsers show a generic message regardless of returnValue */
        event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return hasUnsavedChanges;
}
