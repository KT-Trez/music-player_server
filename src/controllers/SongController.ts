import Database from '../components/Database.js';
import NedbController from './NedbController.js';


/**
 * Non-generic controller for database with albums list.
 */
export default class SongController extends NedbController {
	static store = Database.getDatabase('.songs');
}