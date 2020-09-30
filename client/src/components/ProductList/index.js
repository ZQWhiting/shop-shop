import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useSelector, useDispatch } from 'react-redux';

import { UPDATE_PRODUCTS } from '../../utils/reducers/productSlice';

import ProductItem from "../ProductItem";
import { QUERY_PRODUCTS } from "../../utils/queries";
import spinner from "../../assets/spinner.gif"

import { idbPromise } from '../../utils/helpers';

function ProductList() {
  const category = useSelector((state) => state.category);
  const { products } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    // if there's data to be stored
    if (data) {
      // store data in global store
      dispatch(
			UPDATE_PRODUCTS({
				products: data.products,
			})
		);

      // AND store in indexedDB
      data.products.forEach(product => {
        idbPromise('products', 'put', product);
      })

    // ELSE IF offline (data not loading)
    } else if (!loading) {
      // get products from indexedDB database
      idbPromise('products', 'get').then((products) => {
        // store products in global store
        dispatch(
			UPDATE_PRODUCTS({
				products: products,
			})
		);
      })
    }
  }, [data, loading, dispatch])

  function filterProducts() {
    if (!category.currentCategory) {
      return products;
    }

    return products.filter(product => product.category._id === category.currentCategory);
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {products.length ? (
        <div className="flex-row">
            {filterProducts().map(product => (
                <ProductItem
                  key= {product._id}
                  _id={product._id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  quantity={product.quantity}
                />
            ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      { loading ?
      <img src={spinner} alt="loading" />: null}
    </div>
  );
}

export default ProductList;
