import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
	name: 'product',
	initialState: {
		products: [],
	},
	reducers: {
		UPDATE_PRODUCTS: (state, action) => {
			state.products = action.payload.products;
		},
	},
});

export const { UPDATE_PRODUCTS } = productSlice.actions;

export default productSlice.reducer;
