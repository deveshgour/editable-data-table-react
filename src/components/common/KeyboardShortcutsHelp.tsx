'use client';

/**
 * Keyboard shortcuts help dialog — shows available keyboard shortcuts.
 */

import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Chip,
} from '@mui/material';
import KeyboardIcon from '@mui/icons-material/Keyboard';

interface KeyboardShortcutsHelpProps {
  open: boolean;
  onClose: () => void;
}

const shortcuts = [
  { keys: ['Ctrl', 'S'], description: 'Save all edited rows' },
  { keys: ['Ctrl', 'Z'], description: 'Undo last edit' },
  { keys: ['Ctrl', 'F'], description: 'Focus search bar' },
  { keys: ['Ctrl', 'E'], description: 'Export to CSV' },
  { keys: ['Esc'], description: 'Cancel editing / close panels' },
  { keys: ['Enter'], description: 'Save current row (while editing)' },
];

function KeyboardShortcutsHelp({ open, onClose }: KeyboardShortcutsHelpProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <KeyboardIcon />
        Keyboard Shortcuts
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {shortcuts.map((shortcut) => (
            <Box
              key={shortcut.description}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="body2">{shortcut.description}</Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {shortcut.keys.map((key) => (
                  <Chip
                    key={key}
                    label={key}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      minWidth: 40,
                    }}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(KeyboardShortcutsHelp);
