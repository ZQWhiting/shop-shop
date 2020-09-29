import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './reducers/cartSlice';
import categoryReducer from './reducers/categorySlice';
import productReducer from './reducers/productSlice';

export default configureStore({
	reducer: {
		cart: cartReducer,
		category: categoryReducer,
		product: productReducer,
	},
});
