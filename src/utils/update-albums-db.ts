import fs, {Dirent} from 'fs';
import path from 'path';
import {cdnAudioURL, cdnBaseURL} from '../server.js';
import AlbumService from '../services/AlbumService.js';
import {Album} from '../types/interfaces';


/**
 * Searches for cover file (png | jpg) in album's directory.
 * @param {string} albumPath - path to album's directory.
 * @returns {string | null} - cover's name or null if there is no cover file.
 */
const getAlbumCover = (albumPath: string) => {
	// get album's directory content
	const albumContent = fs.readdirSync(albumPath, {
		withFileTypes: true
	});

	// todo: possible feature: add handling of other file types
	// search for cover, return result
	const coverFile = albumContent.find(file => file.isFile() && (file.name.endsWith('.png') || file.name.endsWith('.jpg')));
	if (coverFile)
		return coverFile.name;
	else
		return null;
};

/**
 * Calculates size of all files in album's directory.
 * @param {string} albumPath - path to album's directory.
 * @returns {number} - size of all files in bytes.
 */
const getAlbumSize = (albumPath: string) => {
	// get album's directory content
	const albumContent = fs.readdirSync(albumPath, {
		withFileTypes: true
	});

	// calc size of all files, return result
	let size = 0;
	for (const dirent of albumContent) {
		const fileStats = fs.statSync(path.resolve(albumPath, dirent.name));
		size += fileStats.size;
	}

	return size;
};


/**
 * Goes through all albums in audio's CDN directory and, using AlbumService, creates
 * new list of all albums.
 */
export default function updateAlbumsDB() {
	// check all directories in audio's CDN directory
	fs.readdir(path.resolve(cdnBaseURL, cdnAudioURL), {
		withFileTypes: true
	}, (err: Error, audioDirContent: Dirent[]) => {
		if (err)
			throw err;

		const albums: Album[] = [];
		for (const dirent of audioDirContent)
			// if dirent is a directory, collect full data about album
			if (dirent.isDirectory()) {
				const cover = getAlbumCover(path.resolve(cdnBaseURL, cdnAudioURL, dirent.name));
				albums.push( {
					cover: {
						cdn: cover ? '/' + [cdnBaseURL, cdnAudioURL, dirent.name, cover].join('/') : 'https://placehold.jp/240x240.png',
						hasCover: !!cover,
						name: cover ?? 'unavailable',
					},
					id: new Date().getTime() + Math.round(Math.random() * 1000).toString(),
					name: dirent.name,
					path: path.resolve(cdnBaseURL, cdnAudioURL, dirent.name),
					size: getAlbumSize(path.resolve(cdnBaseURL, cdnAudioURL, dirent.name))
				});
			}

		// recreate albums database with collected data
		AlbumService.recreateList(albums);
	});
}