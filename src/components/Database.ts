import Datastore from 'nedb';
import Logger from '../components/Logger.js';


/**
 * Handles database loading and managing.
 */
export default class Database {
    /** Map of loaded databases. */
    private static map = new Map();

    /**
     * Gets loaded database from databases map.
     * @param {string} name - database's name.
     * @return {Datastore} - loaded database.
     */
    static getDatabase(name: string): Datastore {
        let db = Database.map.get(name);

        if (!db)
            return this.loadDatabase(name);
        else
            return db;
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
            filename: './src/data/' + name + '.db',
            onload(err: Error | null): void { err ? Logger.error('Error while loading db: ' + err.message, 'dhf') : null }
        });

        this.map.set(name, db);
        return db;
    }
}