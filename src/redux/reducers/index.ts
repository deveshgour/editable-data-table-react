/**
 * Root reducer — combines all sub-reducers into a single reducer.
 */

import { combineReducers } from 'redux';
import tableReducer from './tableReducer';
import filterReducer from './filterReducer';
import uiReducer from './uiReducer';

const rootReducer = combineReducers({
  table: tableReducer,
  filter: filterReducer,
  ui: uiReducer,
});

export default rootReducer;
