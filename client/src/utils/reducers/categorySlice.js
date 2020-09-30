import { createSlice } from '@reduxjs/toolkit';

const categorySlice = createSlice({
	name: 'category',
	initialState: {
		categories: [],
		currentCategory: '',
	},
	reducers: {
		UPDATE_CATEGORIES: (state, action) => {
			state.categories = action.payload.categories;
		},
		UPDATE_CURRENT_CATEGORY: (state, action) => {
			state.currentCategory = action.payload.currentCategory;
		},
	},
});

export const { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } = categorySlice.actions;

export default categorySlice.reducer;
