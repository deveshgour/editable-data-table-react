/**
 * Keyboard shortcuts hook for global application shortcuts.
 * Binds Ctrl/Cmd key combinations for common actions.
 */

import { useEffect, useCallback } from 'react';

interface ShortcutHandlers {
  onSaveAll?: () => void;
  onUndo?: () => void;
  onSearch?: () => void;
  onExport?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isModifier = event.ctrlKey || event.metaKey;

      /* Ctrl/Cmd + S — Save all */
      if (isModifier && event.key === 's') {
        event.preventDefault();
        handlers.onSaveAll?.();
        return;
      }

      /* Ctrl/Cmd + Z — Undo */
      if (isModifier && event.key === 'z') {
        event.preventDefault();
        handlers.onUndo?.();
        return;
      }

      /* Ctrl/Cmd + F — Focus search */
      if (isModifier && event.key === 'f') {
        event.preventDefault();
        handlers.onSearch?.();
        return;
      }

      /* Ctrl/Cmd + E — Export */
      if (isModifier && event.key === 'e') {
        event.preventDefault();
        handlers.onExport?.();
        return;
      }

      /* Escape — Cancel editing / close panels */
      if (event.key === 'Escape') {
        handlers.onEscape?.();
        return;
      }
    },
    [handlers]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
