# Advanced Editable Data Table

A high-performance, enterprise-grade editable data table built with Next.js 14, React, Redux, and Material UI. This application is capable of handling datasets of 10,000+ rows seamlessly using virtualization, while providing a rich set of features like inline editing, multi-column sorting, debounced filtering, and CSV exporting.

## Features

- **High Performance Virtualization**: Uses `react-window` to render only the visible rows, ensuring smooth 60fps scrolling even with 10,000+ records.
- **Inline Row Editing**: Editable cells for text and numeric fields with real-time validation. 
- **Redux State Management**: Uses a plain Redux architecture (manual action types, action creators, and reducers) for complex state management, edit drafts, undo history, and row selection.
- **Multi-Column Sorting**: Sort by multiple columns simultaneously with visual indicators for the sort order priority.
- **Debounced Filtering**: Global search across all fields and specific column-level filters (text search and numeric ranges) with 300ms debouncing.
- **Bulk Actions & Export**: Select multiple rows for bulk deletion or export the filtered data to a CSV file using PapaParse.
- **Unsaved Changes Protection**: Browser-native warning when attempting to navigate away with unsaved edits.
- **Keyboard Shortcuts**: Built-in support for global shortcuts (`Ctrl+S` to save, `Ctrl+Z` to undo, `Ctrl+F` to search, `Ctrl+E` to export, `Esc` to cancel).
- **Dark/Light Mode**: Toggleable and persistent UI theme.
- **Column Visibility**: Show or hide specific columns dynamically.
- **View Modes**: Switch between Virtualized Scroll and traditional Paginated views.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **State Management**: Redux, React-Redux, Reselect
- **UI Components & Styling**: Material UI (MUI v5), Emotion
- **Virtualization**: react-window
- **CSV Export**: PapaParse

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture

The project is structured following enterprise best practices:
- `src/redux/`: Plain Redux setup divided into `actions`, `actionTypes`, `reducers`, and `selectors`.
- `src/components/table/`: Core table components including the `DataTableContainer`, `VirtualizedTable`, `TableRow`, and `EditableCell`.
- `src/components/filters/`: Filter panel and individual column filters.
- `src/components/toolbar/`: Main toolbar with search, view toggles, and bulk actions.
- `src/utils/`: Helper functions for sorting, filtering, validation, CSV export, and the deterministic mock data generator.

## License

MIT License
