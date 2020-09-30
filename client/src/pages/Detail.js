import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { useSelector, useDispatch } from 'react-redux';

import {
	REMOVE_FROM_CART,
	UPDATE_CART_QUANTITY,
	ADD_TO_CART,
} from '../utils/reducers/cartSlice';
import { UPDATE_PRODUCTS } from '../utils/reducers/productSlice';

import { idbPromise } from '../utils/helpers';

import { QUERY_PRODUCTS } from '../utils/queries';
import spinner from '../assets/spinner.gif';

import Cart from '../components/Cart';

function Detail() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const { cartItems } = useSelector((state) => state.cart);
	const { products } = useSelector((state) => state.product);

	const [currentProduct, setCurrentProduct] = useState({});

	const { loading, data } = useQuery(QUERY_PRODUCTS);

	const addToCart = () => {
		const itemInCart = cartItems.find((cartItem) => cartItem._id === id);

		if (itemInCart) {
			dispatch(
				UPDATE_CART_QUANTITY({
					_id: id,
					purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
				})
			);

			idbPromise('cart', 'put', {
				...itemInCart,
				purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
			});
		} else {
			dispatch(
				ADD_TO_CART({
					product: { ...currentProduct, purchaseQuantity: 1 },
				})
			);

			idbPromise('cart', 'put', {
				...currentProduct,
				purchaseQuantity: 1,
			});
		}
	};

	const removeFromCart = () => {
		dispatch(
			REMOVE_FROM_CART({
				_id: currentProduct._id,
			})
		);

		idbPromise('cart', 'delete', { ...currentProduct });
	};

	useEffect(() => {
		// IF already in global store
		if (products.length) {
			// set current product to matching product in GlobalStore
			setCurrentProduct(products.find((product) => product._id === id));

						// ELSE IF retrieved from server
		} else if (data) {
			// save products to global store
			dispatch({
				type: UPDATE_PRODUCTS,
				products: data.products,
			});
			// save products to indexedDB
			data.products.forEach((product) => {
				idbPromise('products', 'put', product);
			});

					// ELSE IF offline (not loading)
		} else if (!loading) {
			// get products from indexedDB
			idbPromise('products', 'get').then((indexedProducts) => {
				// save products to global store
				dispatch({
					type: UPDATE_PRODUCTS,
					products: indexedProducts,
				});
			});
		}
	}, [products, data, loading, dispatch, id]);

	return (
		<>
			{currentProduct ? (
				<div className='container my-1'>
					<Link to='/'>← Back to Products</Link>

					<h2>{currentProduct.name}</h2>

					<p>{currentProduct.description}</p>

					<p>
						<strong>Price:</strong>${currentProduct.price}{' '}
						<button onClick={addToCart}>Add to Cart</button>
						<button
							disabled={
								!cartItems.find(
									(p) => p._id === currentProduct._id
								)
							}
							onClick={removeFromCart}
						>
							Remove from Cart
						</button>
					</p>

					<img
						src={`/images/${currentProduct.image}`}
						alt={currentProduct.name}
					/>
				</div>
			) : null}
			{loading ? <img src={spinner} alt='loading' /> : null}
			<Cart />
		</>
	);
}

export default Detail;
