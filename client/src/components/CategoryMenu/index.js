import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useSelector, useDispatch } from 'react-redux';

import { QUERY_CATEGORIES } from "../../utils/queries";

import {
	UPDATE_CATEGORIES,
	UPDATE_CURRENT_CATEGORY,
} from '../../utils/reducers/categorySlice';

import { idbPromise } from '../../utils/helpers';

function CategoryMenu() {
	const category = useSelector((state) => state.category);
	const { categories } = category;

	const dispatch = useDispatch();

	const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

	useEffect(() => {
		// IF categoryData exists or has changed from the response of useQuery
		if (categoryData) {
			// THEN save categories in global store
			dispatch(
				UPDATE_CATEGORIES({
					categories: categoryData.categories,
				})
			);

			// AND save to indexedDB
			categoryData.categories.forEach((category) => {
				idbPromise('categories', 'put', category);
			});

		// ELSE IF offline (not loading)
		} else if (!loading) {
			// get category data from indexedDB
			idbPromise('categories', 'get').then((categories) => {
				// THEN save it to global store
				dispatch(
					UPDATE_CATEGORIES({
						categories: categories,
					})
				);
			});
		}
	}, [categoryData, loading, dispatch]);

	const handleClick = (id) => {
		dispatch(
			UPDATE_CURRENT_CATEGORY({
				currentCategory: id,
			})
		);
	};

	return (
		<div>
			<h2>Choose a Category:</h2>
			{categories.map((item) => (
				<button
					key={item._id}
					onClick={() => {
						handleClick(item._id);
					}}
				>
					{item.name}
				</button>
			))}
		</div>
	);
}

export default CategoryMenu;
