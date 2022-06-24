import express from 'express';
import AlbumService from '../services/AlbumService.js';


const router = express.Router();
router.use(express.json());


router.get('/', async (req, res) => {
	// respond with data about all albums
	const albums = await AlbumService.get();
	res.send(JSON.stringify(albums));
});

router.get('/:albumID', async (req, res) => {
	// return data about specified album's content
	const albumID = req.params.albumID;

	// validate
	if (!albumID)
		return res.sendStatus(400);

	if (!await AlbumService.isAlbumValid(albumID))
		return res.status(404).send('no album of id ' + albumID);

	// respond with album data
	const album = await AlbumService.get(albumID);
	res.send(JSON.stringify(album));
});

router.get('/content/:albumID', async (req, res) => {
	// return data about specified album's content
	const albumID = req.params.albumID;

	// validate
	if (!albumID)
		return res.sendStatus(400);

	if (!await AlbumService.isAlbumValid(albumID))
		return res.sendStatus(404);

	// respond with album data
	const albumContent = await AlbumService.getContent(albumID);
	res.send(JSON.stringify(albumContent));
});

router.patch('/edit', (req, res) => {
	// todo: edit album in server's storage
});

router.post('/upload', (req, res) => {
	// todo: save album to server
});

export {router as albumsRouter};