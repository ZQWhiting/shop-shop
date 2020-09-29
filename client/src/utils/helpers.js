export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}

export function idbPromise(storeName, method, object) {
	return new Promise((resolve, reject) => {
		// open connection to database
		const request = window.indexedDB.open('shop-shop', 1);

		let db, tx, store;

    // create object store
		request.onupgradeneeded = function (e) {
			const db = request.result;

			db.createObjectStore('products', { keyPath: '_id' });
			db.createObjectStore('categories', { keyPath: '_id' });
			db.createObjectStore('cart', { keyPath: '_id' });
		};

		request.onerror = function (e) {
			console.log('There was an error');
		};

		request.onsuccess = function (e) {
      // open transaction from the database and get the object store
			db = request.result;
			tx = db.transaction(storeName, 'readwrite');
			store = tx.objectStore(storeName);

			db.onerror = function (e) {
				console.log('error', e);
			};

      // perform CRUD method on object store
			switch (method) {
				case 'put':
					store.put(object);
					resolve(object);
					break;
				case 'get':
					const all = store.getAll();
					all.onsuccess = function () {
						resolve(all.result);
					};
					break;
				case 'delete':
					store.delete(object._id);
					break;
				default:
					console.log('No valid method');
					break;
			}

      // close transaction
			tx.oncomplete = function () {
				db.close();
			};
		};
	});
}