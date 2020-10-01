import {
	ADD_TO_CART,
	ADD_MULTIPLE_TO_CART,
	REMOVE_FROM_CART,
	UPDATE_CART_QUANTITY,
	CLEAR_CART,
	TOGGLE_CART,
} from '../utils/reducers/cartSlice';
import {
	UPDATE_CATEGORIES,
	UPDATE_CURRENT_CATEGORY,
} from '../utils/reducers/categorySlice';
import { UPDATE_PRODUCTS } from '../utils/reducers/productSlice';

import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../utils/reducers/cartSlice';
import categoryReducer from '../utils/reducers/categorySlice';
import productReducer from '../utils/reducers/productSlice';

let store = configureStore({
	reducer: {
		cart: cartReducer,
		category: categoryReducer,
		product: productReducer,
	},
});

afterEach(() => store = configureStore({
	reducer: {
		cart: cartReducer,
		category: categoryReducer,
		product: productReducer,
	},
}));

test('UPDATE_PRODUCTS', () => {
	expect(store.getState().product.products.length).toBe(0);

	store.dispatch(
		UPDATE_PRODUCTS({
			products: [{}, {}],
		})
	);

	expect(store.getState().product.products.length).toBe(2);
});

test('UPDATE_CATEGORIES', () => {
	expect(store.getState().category.categories.length).toBe(0);

	store.dispatch(UPDATE_CATEGORIES({ categories: [{}, {}] }));

	expect(store.getState().category.categories.length).toBe(2);
});

test('UPDATE_CURRENT_CATEGORY', () => {
	expect(store.getState().category.currentCategory).toBe('');

	store.dispatch(UPDATE_CURRENT_CATEGORY({ currentCategory: '2' }));

	expect(store.getState().category.currentCategory).toBe('2');
});

test('ADD_TO_CART', () => {
	expect(store.getState().cart.cartItems.length).toBe(0);

	store.dispatch(ADD_TO_CART({ cartItems: { purchaseQuantity: 1 } }));

	expect(store.getState().cart.cartItems.length).toBe(1);
});

test('ADD_MULTIPLE_TO_CART', () => {
	expect(store.getState().cart.cartItems.length).toBe(0);

	store.dispatch(ADD_MULTIPLE_TO_CART({ cartItems: [{}, {}] }));

	expect(store.getState().cart.cartItems.length).toBe(2);
});

test('REMOVE_FROM_CART', () => {
	store.dispatch(
		ADD_MULTIPLE_TO_CART({ cartItems: [{ _id: '1' }, { _id: '2' }] })
	);
	expect(store.getState().cart.cartItems.length).toBe(2);

	store.dispatch(REMOVE_FROM_CART({ _id: '1' }));

	expect(store.getState().cart.cartOpen).toBe(true);

	expect(store.getState().cart.cartItems.length).toBe(1);
	expect(store.getState().cart.cartItems[0]._id).toBe('2');

	store.dispatch(REMOVE_FROM_CART({ _id: '2' }));

	expect(store.getState().cart.cartOpen).toBe(false);
	expect(store.getState().cart.cartItems.length).toBe(0);
});

test('UPDATE_CART_QUANTITY', () => {
	store.dispatch(
		ADD_MULTIPLE_TO_CART({ cartItems: [{ _id: '1', purchaseQuantity: 2 }, { _id: '2', purchaseQuantity: 1 }] })
	);
	expect(store.getState().cart.cartItems.length).toBe(2);
	expect(store.getState().cart.cartItems[0].purchaseQuantity).toBe(2);

	store.dispatch(UPDATE_CART_QUANTITY({ _id: '1', purchaseQuantity: 3 }));

	expect(store.getState().cart.cartOpen).toBe(true);
	expect(store.getState().cart.cartItems[0].purchaseQuantity).toBe(3);
	expect(store.getState().cart.cartItems[1].purchaseQuantity).toBe(1);
});

test('CLEAR_CART', () => {
	store.dispatch(
		ADD_MULTIPLE_TO_CART({ cartItems: [{ _id: '1', purchaseQuantity: 2 }, { _id: '2', purchaseQuantity: 1 }] })
	);
	expect(store.getState().cart.cartItems.length).toBe(2);

	store.dispatch(CLEAR_CART());

	expect(store.getState().cart.cartOpen).toBe(false);
	expect(store.getState().cart.cartItems.length).toBe(0);
});

test('TOGGLE_CART', () => {
	store.dispatch(TOGGLE_CART());

	expect(store.getState().cart.cartOpen).toBe(true);

	store.dispatch(TOGGLE_CART());

	expect(store.getState().cart.cartOpen).toBe(false);
});
