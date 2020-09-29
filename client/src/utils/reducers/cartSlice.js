import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
	name: 'cart',
	initialState: {
		cart: [],
		cartOpen: false,
	},
	reducers: {
		ADD: (state, action) => {
			state.cartOpen = true;
			state.cart.push(action.payload.product);
		},
		ADD_MULTIPLE: (state, action) => {
			action.payload.products.forEach((item) => {
				state.cart.push(item);
			});
		},
		REMOVE: (state) => {
			let newState = state.cart.filter((product) => {
				return product._id !== action.payload._id;
			});

			(state.cartOpen = newState.length > 0), (state.cart = newState);
		},
		UPDATE_QUANTITY: (state, action) => {
			state.cartOpen = true;
			state.cart = state.cart.map((product) => {
				if (action.payload._id === product._id) {
					product.purchaseQuantity = action.payload.purchaseQuantity;
				}
				return product;
			});
		},
		CLEAR: (state) => {
			state.cartOpen = false;
			state.cart = [];
		},
		TOGGLE: (state) => {
			state.cartOpen = !state.cartOpen;
		},
	},
});

export const {
	ADD,
	ADD_MULTIPLE,
	REMOVE,
	UPDATE_QUANTITY,
	CLEAR,
	TOGGLE,
} = cartSlice.actions;

export default cartSlice.reducer;
