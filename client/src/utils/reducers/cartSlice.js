import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
	name: 'cart',
	initialState: {
		cart: [],
		cartOpen: false,
	},
	reducers: {
		ADD_TO_CART: (state, action) => {
			state.cartOpen = true;
			state.cart.push(action.payload.product);
		},
		ADD_MULTIPLE_TO_CART: (state, action) => {
			action.payload.products.forEach((item) => {
				state.cart.push(item);
			});
		},
		REMOVE_FROM_CART: (state, action) => {
			let newState = state.cart.filter((product) => {
				return product._id !== action.payload._id;
			});

			state.cartOpen = newState.length > 0;
			state.cart = newState;
		},
		UPDATE_CART_QUANTITY: (state, action) => {
			state.cartOpen = true;
			state.cart = state.cart.map((product) => {
				if (action.payload._id === product._id) {
					product.purchaseQuantity = action.payload.purchaseQuantity;
				}
				return product;
			});
		},
		CLEAR_CART: (state) => {
			state.cartOpen = false;
			state.cart = [];
		},
		TOGGLE_CART: (state) => {
			state.cartOpen = !state.cartOpen;
		},
	},
});

export const {
	ADD_TO_CART,
	ADD_MULTIPLE_TO_CART,
	REMOVE_FROM_CART,
	UPDATE_CART_QUANTITY,
	CLEAR_CART,
	TOGGLE_CART,
} = cartSlice.actions;

export default cartSlice.reducer;
