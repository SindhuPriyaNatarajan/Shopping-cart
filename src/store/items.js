import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    items: null,
};

/*
 * Function to retrieve the state from local storage
 */
const loadFromLocalStorage = () => {
    try {
        const stateStr = localStorage.getItem('state');
        const parsedState = stateStr ? JSON.parse(stateStr) : null;

        if (parsedState) {
            return parsedState.items;
        } else {
            return initialState;
        }
    } catch (e) {
        console.error(e);
        return initialState;
    }
};

const persistedState = loadFromLocalStorage();

export const itemSlice = createSlice({
    name: 'items',
    initialState: persistedState,
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload;
        },
        addNewItem: (state, action) => {
            const { items } = state;
            state.items = [...items, action.payload];
        },
        updateItem: (state, action) => {
            const { items } = state;
            const updatedIndex = items.findIndex(
                item => item.id === action.payload.id
            );
            state.items[updatedIndex] = { ...action.payload };
        }
    },
})

export const { addNewItem, setItems, updateItem } = itemSlice.actions

export default itemSlice.reducer