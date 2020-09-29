import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { useStoreContext } from '../utils/GlobalState';
import {
	REMOVE_FROM_CART,
	UPDATE_CART_QUANTITY,
	ADD_TO_CART,
	UPDATE_PRODUCTS,
} from '../utils/actions';

import { idbPromise } from '../utils/helpers';

import { QUERY_PRODUCTS } from '../utils/queries';
import spinner from '../assets/spinner.gif';

import Cart from '../components/Cart';

function Detail() {
	const { id } = useParams();
	const [state, dispatch] = useStoreContext();
	const { products, cart } = state;

	const [currentProduct, setCurrentProduct] = useState({});

	const { loading, data } = useQuery(QUERY_PRODUCTS);

	const addToCart = () => {
		const itemInCart = cart.find((cartItem) => cartItem._id === id);

		if (itemInCart) {
			dispatch({
				type: UPDATE_CART_QUANTITY,
				_id: id,
				purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
			});
		} else {
			dispatch({
				type: ADD_TO_CART,
				product: { ...currentProduct, purchaseQuantity: 1 },
			});
		}
	};

	const removeFromCart = () => {
		dispatch({
			type: REMOVE_FROM_CART,
			_id: currentProduct._id,
		});
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
						<button disabled={!cart.find(p => p._id === currentProduct._id)}
						onClick={removeFromCart}>
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
