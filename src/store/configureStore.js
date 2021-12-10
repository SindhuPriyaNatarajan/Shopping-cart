import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './items';

const saveToLocalStorage = (state) => {
  try {
    localStorage.setItem('state', JSON.stringify(state));
  } catch (e) {
    console.error(e);
  }
};

const store = configureStore({
  reducer: {
    items: itemsReducer
  }
});

store.subscribe(() => {
  saveToLocalStorage(store.getState());
});

export default store;