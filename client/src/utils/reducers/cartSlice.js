import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
	name: 'cart',
	initialState: {
		cartItems: [],
		cartOpen: false,
	},
	reducers: {
		ADD_TO_CART: (state, action) => {
			state.cartOpen = true;
			state.cartItems.push(action.payload.cartItems);
		},
		ADD_MULTIPLE_TO_CART: (state, action) => {
			action.payload.cartItems.forEach((item) => {
				state.cartItems.push(item);
			});
		},
		REMOVE_FROM_CART: (state, action) => {
			let newState = state.cartItems.filter((product) => {
				return product._id !== action.payload._id;
			});

			state.cartOpen = newState.length > 0;
			state.cartItems = newState;
		},
		UPDATE_CART_QUANTITY: (state, action) => {
			state.cartOpen = true;
			state.cartItems = state.cartItems.map((product) => {
				if (action.payload._id === product._id) {
					product.purchaseQuantity = action.payload.purchaseQuantity;
				}
				return product;
			});
		},
		CLEAR_CART: (state) => {
			state.cartOpen = false;
			state.cartItems = [];
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
