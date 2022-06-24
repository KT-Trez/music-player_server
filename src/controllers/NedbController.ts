import Datastore from 'nedb';


/**
 * Generic controller for Nedb database.
 */
export default class NedbController {
	/** database object that should be overridden in non-generic controllers  */
	static store: Datastore;

	/**
	 * Counts all documents that match the query.
	 * @param {object} query - query that will be tested against all database records.
	 */
	static async count(query: object): Promise<number> {
		return new Promise(resolve => {
			this.store.count(query, (err: Error, count: number) => {
				if (err)
					throw err;

				resolve(count);
			});
		});
	}

	/**
	 * Searches for one or multiple documents that match the query.
	 * @param {object} query - query that will be tested against all database records.
	 * @param multiple - whether to search for multiple documents or not.
	 * @returns {Promise<unknown>} - documents that matched the provided query.
	 */
	static find(query: object, multiple: boolean): Promise<any | any[] | null> {
		return new Promise(resolve => {
			if (!multiple)
				this.store.findOne(query, (err: Error, document: any) => {
					if (err)
						throw err;

					resolve(document);
				});
			else
				this.store.find(query, (err: Error, documents: any[]) => {
					if (err)
						throw err;

					resolve(documents);
				});
		});
	}

	/**
	 * Inserts new document to the database.
	 * @param {object} document - new document.
	 */
	static insert(document: object) {
		this.store.insert(document);
	}

	/**
	 * Updates one or multiple documents that match the query.
	 * @param {object} query - query that will be tested against all database records.
	 * @param {object} updateQuery - update query that will be used to update documents.
	 * @param multiple - whether to update multiple documents matching query or not.
	 */
	static update(query: object, updateQuery: object, multiple?: boolean) {
		this.store.update(query, updateQuery, {
			multi: multiple
		});
	}

	/**
	 * Removes one or multiple documents that match the query.
	 * @param {object} query - query that will be tested against all database records.
	 * @param {boolean} multiple - whether to remove multiple documents matching query or not.
	 */
	static remove(query: object, multiple?: boolean) {
		this.store.remove(query, {
			multi: multiple
		});
	}
}