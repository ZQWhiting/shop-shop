import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
	name: 'product',
	initialState: {
		products: [],
	},
	reducers: {
		UPDATE: (state, action) => {
			state.products = action.payload.products;
		},
	},
});

export const { UPDATE } = productSlice.actions;

export default productSlice.reducer;
