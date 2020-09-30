import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
	name: 'product',
	initialState: {
		products: [],
	},
	reducers: {
		UPDATE_PRODUCT: (state, action) => {
			state.products = action.payload.products;
		},
	},
});

export const { UPDATE_PRODUCT } = productSlice.actions;

export default productSlice.reducer;
