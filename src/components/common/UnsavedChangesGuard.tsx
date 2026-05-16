'use client';

/**
 * Unsaved Changes Guard component.
 * Renders nothing visible — purely handles the beforeunload event
 * to warn users about unsaved edits before navigating away.
 */

import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';

export default function UnsavedChangesGuard() {
  useUnsavedChangesWarning();
  return null;
}
