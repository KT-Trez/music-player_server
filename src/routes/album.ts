import express from 'express';
import AlbumService from '../services/AlbumService.js';


const albumRouter = express.Router();
albumRouter.use(express.json());


albumRouter.get('/all', async (req, res) => {
	// return data about all albums
	const albums = await AlbumService.get();
	res.send(JSON.stringify(albums));
});

albumRouter.get('/content', async (req, res) => {
	// return data about specified album's content
	const albumID = req.query.albumID.toString();

	if (!albumID || isNaN(parseInt(albumID)))
		return res.sendStatus(400);

	const albumContent = await AlbumService.getContent(parseInt(albumID));
	res.send(JSON.stringify(albumContent));
});

albumRouter.post('/save', (req, res) => {
	// todo: save album to server
});

export default albumRouter;