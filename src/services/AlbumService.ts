import fs from 'fs';
import path from 'path';
import AlbumController from '../controllers/AlbumController.js';
import {cdnAudioURL, cdnBaseURL} from '../server.js';
import {Album, Song} from '../types/interfaces';


export default class AlbumService {
	/**
	 * Gets information about all albums, if ID is specified, gets information about one album.
	 * @param {number} id - ID of the one album you want to get the information of.
	 * @returns {Promise<Album | Album[]>} - data of all albums or, if ID specified, data of provided album.
	 */
	static async get(id?: string): Promise<Album | Album[]> {
		// get info from database, remove 'path' parameter (it's only for the server use); return result
		if (id) {
			const album = await AlbumController.find({id}, false) as Album;
			delete album.path;
			return album;
		} else {
			const albums = await AlbumController.find({}, true) as Album[];
			for (const album of albums)
				delete album.path;
			return albums;
		}
	}

	/**
	 * Get songs data from the album.
	 * @param {number} id - album's ID.
	 * @returns {Promise<Song[]>} - data of all songs in album.
	 */
	static async getContent(id: string): Promise<Song[]> {
		const album = await AlbumController.find({id}, false) as Album;

		return new Promise(resolve => {
			// read album directory
			fs.readdir(album.path, {
					withFileTypes: true
				}, (err, albumDirContent) => {
					if (err)
						throw err;

					// collect songs data
					const songs: Song[] = [];
					for (const dirent of albumDirContent)
						// todo: possible feature improvement: handle other formats than mp3
						if (dirent.isFile() && path.extname(dirent.name) === '.mp3') {
							const fileStats = fs.statSync(path.resolve(album.path, dirent.name));
							songs.push({
								album: {
									id: album.id,
									name: album.name
								},
								cover: {
									cdn: null,
									hasCover: false,
									name: null
								},
								// todo: calc file's checksum
								id: 'temp' + new Date().getTime() + Math.round(Math.random() * 1000000),
								cdn: '/' + [cdnBaseURL, cdnAudioURL, album.name, dirent.name].join('/'),
								name: dirent.name,
								size: Math.round(fileStats.size / 1024 / 1024 * 100) / 100
							});
						}
					resolve(songs);
				}
			);
		});
	}

	// todo: docs
	static async isAlbumValid(id: string) {
		const albumCount = await AlbumController.count({id});
		return albumCount > 0;
	}

	/**
	 * Recreates database with information about all albums.
	 * @param {Album[]} albums - array of new albums that will be used to recreate the list.
	 */
	static recreateList(albums: Album[]) {
		// remove all albums
		AlbumController.remove({}, true);
		// inset info about new albums
		for (const album of albums)
			AlbumController.insert(album);
	}
}