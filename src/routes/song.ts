import express from 'express';
import SongService from '../services/SongService';


const singRouter = express.Router();
singRouter.use(express.json());


singRouter.get('/all', async (req, res) => {
	// respond with song data
	const songs = SongService.get();
	res.send(JSON.stringify(songs));
});


singRouter.get('/:songID', async (req, res) => {
	const songID = req.params.songID;

	// validate
	if (!songID)
		return res.sendStatus(400);

	if (!await SongService.isSongValid(songID))
		return res.sendStatus(404);

	// respond with song data
	const songData = SongService.get(songID);
	res.send(JSON.stringify(songData));
});

singRouter.patch('/edit', (req, res) => {

});

singRouter.post('/upload', (req, res) => {

});

export default singRouter;