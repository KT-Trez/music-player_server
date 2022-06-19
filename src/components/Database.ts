import Datastore from 'nedb';
import path from 'path';


/**
 * Handles database loading and managing.
 */
export default class Database {
	/** Map of loaded databases. */
	private static map = new Map();

	/**
	 * Removes database from cache, allowing it to serialize itself
	 * @param {string} name - database's name.
	 */
	private static freeDatabase(name: string) {
		Database.map.delete(name);
	}

	/**
	 * Gets loaded database from databases map.
	 * @param {string} name - database's name.
	 * @return {Datastore} - loaded database.
	 */
	static getDatabase(name: string): Datastore {
		let db = Database.map.get(name);

		if (!db)
			return this.loadDatabase(name);
		else {
			this.freeDatabase(name);
			return this.loadDatabase(name);
		}
	}

	/**
	 * Loads new database to databases map.
	 * @param {string} name - database's name.
	 * @return {Datastore} - newly loaded database.
	 * @private
	 */
	private static loadDatabase(name: string): Datastore {
		let db = new Datastore({
			autoload: true,
			filename: path.resolve('local-storage', name + '.db'),
			onload(err: Error | null): void {
				err ? console.error('Error while loading db: ' + err.message) : null
			}
		});

		this.map.set(name, db);
		return db;
	}
}