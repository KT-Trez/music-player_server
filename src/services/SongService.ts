import SongController from '../controllers/SongController.js';
import {Song} from '../types/interfaces';


export default class SongService {
	// todo: docs
	static async get(id?: string): Promise<Song | Song[]> {
		// get info from database; return result
		const query = id ?? {};
		return await SongController.find(query, !!id) as Song;

	}

	// todo: docs
	static async isSongValid(id: string) {
		const songCount = await SongController.count({id});
		return songCount > 0;
	}
}