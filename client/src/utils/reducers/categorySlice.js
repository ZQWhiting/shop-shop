import { createSlice } from '@reduxjs/toolkit';

const categorySlice = createSlice({
	name: 'category',
	initialState: {
		categories: [],
		currentCategory: '',
	},
	reducers: {
		UPDATE: (state, action) => {
			state.categories = action.payload.categories;
		},
		UPDATE_CURRENT: (state, action) => {
			state.currentCategory = action.payload.currentCategory;
		},
	},
});

export const { UPDATE, UPDATE_CURRENT } = categorySlice.actions;

export default categorySlice.reducer;
