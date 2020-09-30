import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import { idbPromise, pluralize } from '../../utils/helpers';

import {
	ADD_TO_CART,
	UPDATE_CART_QUANTITY,
} from '../../utils/reducers/cartSlice';

function ProductItem(item) {
  const {
    image,
    name,
    _id,
    price,
    quantity
  } = item;
  const cartState = useSelector((state) => state.cart);
  const { cartItems } = cartState;
  const dispatch = useDispatch()

  const addToCart = () => {
    const itemInCart = cartItems.find((cartItem) => cartItem._id === _id);

    if (itemInCart) {
      dispatch(UPDATE_CART_QUANTITY({
        _id: _id,
			  purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      }));

		  idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });

    } else {
      dispatch(ADD_TO_CART({
        product: { ...item, purchaseQuantity: 1 }
      }));

      idbPromise('cart', 'put', {...item, purchaseQuantity: 1})
    }
  };

  return (
		<div className='card px-1 py-1'>
			<Link to={`/products/${_id}`}>
				<img alt={name} src={`/images/${image}`} />
				<p>{name}</p>
			</Link>
			<div>
				<div>
					{quantity} {pluralize('item', quantity)} in stock
				</div>
				<span>${price}</span>
			</div>
			<button onClick={addToCart}>Add to cart</button>
		</div>
  );
}

export default ProductItem;
